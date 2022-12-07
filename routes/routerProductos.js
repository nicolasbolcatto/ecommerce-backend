const express = require("express")
const { Router } = express
const Contenedor = require("../classes/Contenedor")
const Producto = require("../classes/Producto")
const fs = require("fs")

//Create boolean variable for administrator rights and assign true
let administrador = true

//Create container based on existing file
const container = new Contenedor('./productos.txt')

//Create routers

const routerProductos = Router()

//Create API connections

//GET specific product by id or every product

routerProductos.get("/:id?", (req, res) => {
    const { id } = req.params
    if (id === undefined) {
        getProducts()
    } else {
        getItem(id)
    }

    async function getItem(id) {
        try {

            let item = await container.getById(id)
            if (item === null) {
                item = "Error: producto no encontrado"
            }
            res.json(item)
        } catch {
            res.json({ error: "producto no encontrado" })
        }
    }

    async function getProducts() {
        try {
            const products = await container.getAll()
            res.json(products)
        } catch {
            console.log(`Error: ${error}`)
        }
    }

})

//POST new product
routerProductos.post("/", (req, res) => {
    async function pushProduct() {
        try {
            const product = new Producto(req.body.nombre, req.body.descripcion, req.body.foto, req.body.precio, req.body.stock)
            const productId = await container.save(product)

            res.json({ added: product, assignedId: productId })
        } catch (error) {
            res.json({ error: `Error: ${error}` })
        }
    }

    if (!administrador) {
        res.json({ error: -1, descripcion: "Ruta /api/carritos método POST no autorizada" })
        return
    }

    pushProduct()
})

//PUT change details of specific product by id
routerProductos.put("/:id", (req, res) => {

    let { id } = req.params

    async function editProduct() {
        try {

            const products = await container.getAll()
            const [name, desc, url, price, stock] = [req.body.nombre, req.body.descripcion, req.body.foto, req.body.precio, req.body.stock]


            if (products.length > Number(id)) {

                products[Number(id - 1)].nombre = name
                products[Number(id - 1)].descripcion = desc
                products[Number(id - 1)].foto = url
                products[Number(id - 1)].precio = price
                products[Number(id - 1)].stock = stock

                await fs.promises.writeFile(".\\productos.txt", JSON.stringify(products, null, 2))
                res.json({ assignedName: name, assignedDesc: desc, assignedUrl: url, assignedPrice: price, assignedStock: stock })

            } else {
                res.json({ error: "Error: no se encontró el producto" })
            }


        } catch (error) {
            console.log(`Error: ${error}`)
        }
    }

    if (!administrador) {
        res.json({ error: -1, descripcion: `Ruta /api/carritos/${id} método PUT no autorizada` })
        return
    }

    editProduct()
})

//DELETE product by id
routerProductos.delete("/:id", (req, res) => {

    const { id } = req.params

    async function deleteProduct() {
        try {

            const deletedItem = await container.deleteById(Number(id))

            res.json({ deleted: deletedItem })
        } catch {
            res.json({ error: `Error: ${error}` })
        }
    }

    if (!administrador) {
        res.json({ error: -1, descripcion: `Ruta /api/carritos/${id} método DELETE no autorizada` })
        return
    }
    deleteProduct()
})

module.exports = { routerProductos }