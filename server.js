const express = require("express")
const { routerProductos } = require("./routes/routerProductos")
const { routerCarritos } = require("./routes/routerCarritos")

//Start express app
const app = express()

//Configure app for json
app.use(express.json())
app.use(express.urlencoded({ extended: true }))



//Use routers
app.use("/api/productos", routerProductos)
app.use("/api/carritos", routerCarritos)



//Start listening to server
const PORT = process.env.PORT || 8080
const server = app.listen(PORT, () => {
    console.log(`Server listening in port ${8080}`)
})

//Indicate error if server fails
server.on("error", error => console.log(`Error on server: ${error}`))