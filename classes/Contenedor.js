const fs = require("fs")
const { v4: uuidv4 } = require('uuid');

class Contenedor {
    //Defining constructor with file name
    constructor(nombre) {
        this.nombre = nombre
    }

    //Function that saves an object into the file
    async save(object) {
            try {
                //Read file
                const content = await fs.promises.readFile('./productos.txt', 'utf-8')

                //Parse content into object, assign id as last id + 1, and push new item into parsed object
                let existingObjects = JSON.parse(content)
                object.id = existingObjects[existingObjects.length - 1].id + 1
                object.timestamp = Date.now()
                object.codigo = uuidv4()
                existingObjects.push(object)

                //Write to file
                await fs.promises.writeFile(`.\\${this.nombre}`, JSON.stringify(existingObjects, null, 2))
                return object.id //Return new item id
            } catch {

                //If file does not exist, assing id = 1
                object.id = 1
                object.timestamp = Date.now()
                object.codigo = uuidv4()
                    //Write to file
                await fs.promises.writeFile(`.\\${this.nombre}`, "[" + JSON.stringify(object, null, 2) + "]")
                return object.id //Return new item id
            }
        }
        //Function that gets object from file by specified id
    async getById(id) {
        try {
            //Read existing file
            const content = await fs.promises.readFile(process.cwd() + '/productos.txt', 'utf-8')

            //Parse content into object and loop over each item in array to find specific id
            let existingObjects = JSON.parse(content)
            let output = null
            existingObjects.forEach((element) => {
                if (element.id == id) {
                    output = element
                }
            })

            return output
        } catch (error) {
            return `Error while reading file: ${error}`
        }

    }

    //Function that gets all objects from file
    async getAll() {
        try {
            //Read existing file
            const content = await fs.promises.readFile(process.cwd() + '/productos.txt', 'utf-8')
            return JSON.parse(content)
        } catch (error) {
            return `Error while reading file: ${error}`
        }

    }

    //Function that deletes object from file by specified id
    async deleteById(id) {
        try {
            //Read existing file
            const content = await fs.promises.readFile('./productos.txt', 'utf-8')

            //Parse content into object and filter out item matching specific id
            let existingObjects = JSON.parse(content)
            let newExistingObjects = existingObjects.filter((element) => element.id !== id)

            //If item with specific id is found, write new items array to file, if not warn by console
            if (JSON.stringify(newExistingObjects) != JSON.stringify(existingObjects)) {

                await fs.promises.writeFile(`.\\${this.nombre}`, JSON.stringify(newExistingObjects, null, 2))
                return `Successfully written file after deleting item with id = ${id}`

            } else {
                return `No items with id = ${id} were found`
            }
        } catch (error) {
            return `Error while reading file: ${error}`
        }
    }

    //Function that deletes all objects from file
    async deleteAll() {
        try {
            //Read existing file
            await fs.promises.readFile('./productos.txt', 'utf-8')

            //Write empty string to file
            await fs.promises.writeFile('./productos.txt', '')
            return `Successfully deleted all items in ${this.nombre} file`
        } catch (error) {
            return `Unable to delete all items in ${this.nombre}. Error: ${error}`
        }
    }
}

module.exports = Contenedor