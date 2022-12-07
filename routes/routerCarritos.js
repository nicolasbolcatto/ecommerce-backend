const express = require("express")
const { Router } = express
const Carrito = require("../classes/Carrito")
const fs = require("fs")

//Create routers

const routerCarritos = Router()

//Create API connections

//POST new product
routerCarritos.post("/", (req, res) => {
    async function pushCart() {
        try {
            const cart = new Carrito()

            //Read file
            const content = await fs.promises.readFile('./carritos.txt', 'utf-8')

            //Parse content into object, assign id as last id + 1, and push new item into parsed object
            let existingObjects = JSON.parse(content)

            cart.id = existingObjects[existingObjects.length - 1].id + 1

            cart.timestamp = Date.now()
            existingObjects.push(cart)
            console.log(existingObjects)

            //Write to file
            await fs.promises.writeFile("./carritos.txt", JSON.stringify(existingObjects, null, 2))

            res.json({ added: cart, assignedId: cart.id })

        } catch (error) {
            const cart = new Carrito()
            cart.id = 1
            cart.timestamp = Date.now()
                //Write to file
            await fs.promises.writeFile("./carritos.txt", "[" + JSON.stringify(cart, null, 2) + "]")

            res.json({ added: cart, assignedId: cart.id })
        }
    }

    pushCart()
})

//DELETE cart by id
routerCarritos.delete("/:id", (req, res) => {

    async function deleteCart() {
        try {
            //Read existing file
            const content = await fs.promises.readFile('./carritos.txt', 'utf-8')
            const { id } = req.params
                //Parse content into object and filter out item matching specific id
            let existingObjects = JSON.parse(content)
            let newExistingObjects = existingObjects.filter((element) => element.id !== Number(id))

            //If item with specific id is found, write new items array to file, if not warn by console
            if (JSON.stringify(newExistingObjects) != JSON.stringify(existingObjects)) {

                await fs.promises.writeFile("./carritos.txt", JSON.stringify(newExistingObjects, null, 2))
                res.json({ result: `Successfully written file after deleting item with id = ${id}` })

            } else {
                res.json({ result: `No items with id = ${id} were found` })
            }

        } catch (error) {
            res.json({ error: `Error: ${error}` })
        }
    }

    deleteCart()
})

//GET products in cart
routerCarritos.get("/:id/productos", (req, res) => {
    try {
        async function getCart() {
            const { id } = req.params
                //Read existing file

            const content = JSON.parse(await fs.promises.readFile('./carritos.txt', 'utf-8'))
            let cart = content.filter((element) => element.id === Number(id))
            res.json({ productos: cart[0].productos })
        }
        getCart()
    } catch (error) {
        res.json({ error: error })
    }


})

//POST products in cart
routerCarritos.post("/:id/productos/:id_prod", (req, res) => {
    try {
        const params = req.params
        const idCart = Number(params.id)
        const idProd = Number(params.id_prod)
        async function postProductToCart() {
            const carts = JSON.parse(await fs.promises.readFile('./carritos.txt', 'utf-8'))
            const products = JSON.parse(await fs.promises.readFile('./productos.txt', 'utf-8'))
            let product = products.filter((element) => element.id === Number(idProd))
            for (item of carts) {
                if (item.id == Number(idCart)) {
                    item.productos.push(product[0])
                }
            }

            await fs.promises.writeFile("./carritos.txt", JSON.stringify(carts, null, 2))

            res.json({ newCarts: carts })
        }
        postProductToCart()

    } catch (error) {
        res.json({ error: error })
    }
})

//DELETE products in cart
routerCarritos.delete("/:id/productos/:id_prod", (req, res) => {
    const params = req.params
    const idCart = Number(params.id)
    const idProd = Number(params.id_prod)

    async function deleteProductFromCart() {
        try {
            const carts = JSON.parse(await fs.promises.readFile('./carritos.txt', 'utf-8'))

            for (item of carts) {
                if (item.id == Number(idCart)) {
                    let products = item.productos
                    let product = products.filter((element) => element.id === Number(idProd))
                    let modifiedProducts = products.filter((element) => element != product[0])
                    item.productos = modifiedProducts
                }
            }
            await fs.promises.writeFile("./carritos.txt", JSON.stringify(carts, null, 2))

            res.json({ newCarts: carts })
        } catch (error) {
            res.json({ error: `Error: ${error}` })
        }
    }

    deleteProductFromCart()
})

module.exports = { routerCarritos }