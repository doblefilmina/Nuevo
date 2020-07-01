const express = require('express')
const { MongoClient } = require('mongodb')
const { ObjectId } = require('mongodb')
const server = express()


const urlencoded = express.urlencoded({ extended : true })
const json = express.json()

const url = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_HOST}/${process.env.MONGODB_BASE}?retryWrites=true&w=majority`

const connectDB = async () =>{
    const client = await MongoClient.connect(url, { useUnifiedTopology: true } )
    
    DB = await client.db("MercadoTECH")
}


let DB = null

connectDB()

console.log('El servidor de MongoDB es: ')
console.log(process.env.MONGODB_HOST)

server.use( json )
server.use( urlencoded )
server.listen(3000)

server.get('/api', async (req, res) => {      //api para obtener los datos
    
    const productos = await DB.collection('Productos')
    const resultado = await productos.find({}).toArray() 
    res.json( resultado )
}) 

server.get('/api/:id' , async (req, res) =>{

    const productos = await DB.collection('Productos')

    const ID = req.params.id
    const query = { '_id' : ObjectId(ID) }
    const resultado = await productos.find( query ).toArray() 

    res.json( resultado )


})



server.post('/api', async (req, res) => {     // api para crer con datos
    const datos = req.body
    const productos = await DB.collection('Productos')
    

    
    const resultado = await productos.insertOne( datos )
     
/*
REQUISITOS DEL ID:
    - Unico
    - Irrepetible
    - autoasignable
*/
/*

const id = new Date().getTime()

    DB.push({id, ...datos }) //con la estructura "...datos" se rompe el objeto, y cada propiedad del objeto se transforma en una variable nueva. {...datos} lo rompe y lo vuelve a armar. esto se hace para agregarle una propiedad más al objeto.

    console.log(DB)
*/
    const { result } = await productos.insertOne( datos )
    res.json({ rta : result.ok })
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