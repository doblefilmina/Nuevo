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

    DB.push(datos)

    res.json({ rta : 'ok'})
}) 
server.put('/api', (req, res) => {          // api para actualizar con datos
    res.json({ rta : 'Acá vas a actualizar productos'})
}) 
server.delete('/api', (req, res) => {       //api para eliminar los datos
    res.json({ rta : 'Acá vas borrar productos'})
}) 