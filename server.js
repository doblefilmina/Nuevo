const express = require('express')

const server = express()

const urlencoded = express.urlencoded({extended : true}) // con esta configuración, todo lo que viene en url encoded, se interpreta como objeto
const json = express.json()

const DB = []

server.use( json )
server.use( urlencoded )
server.listen(3000)

server.get('/api', (req, res) => {      //api para obtener los datos
    res.json(DB)
}) 
server.post('/api', (req, res) => {     // api para crer con datos
    const datos = req.body

/*
REQUISITOS DEL ID:
    - Unico
    - Irrepetible
    - autoasignable
*/


const id = new Date().getTime()

    DB.push({id, ...datos }) //con la estructura "...datos" se rompe el objeto, y cada propiedad del objeto se transforma en una variable nueva. {...datos} lo rompe y lo vuelve a armar. esto se hace para agregarle una propiedad más al objeto.

    console.log(DB)

    res.json({ rta : 'ok'})
}) 
server.put('/api', (req, res) => {          // api para actualizar con datos
    const datos = req.body

    const encontrado = DB.find(item => item.id == datos.id)
    encontrado.stock = datos.stock
    res.json({ rta : 'ok'})
}) 
server.delete('/api', (req, res) => {       //api para eliminar los datos
    res.json({ rta : 'Acá vas borrar productos'})
}) 