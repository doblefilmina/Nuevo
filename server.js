const express = require('express')
const hbs = require('express-handlebars')
const { MongoClient } = require('mongodb')
const { ObjectId } = require('mongodb')
const jwt = require('jsonwebtoken')
const server = express()


const urlencoded = express.urlencoded({ extended : true })
const json = express.json()
const public = express.static(__dirname + '/public')

const url = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_HOST}/${process.env.MONGODB_BASE}?retryWrites=true&w=majority`

const connectDB = async () =>{
    const client = await MongoClient.connect(url, { useUnifiedTopology: true } )
    
    return await client.db("MercadoTECH")
}

const port = process.env.PORT || 3000

server.use( json )
server.use( urlencoded )
server.set('view engine', 'handlebars')
server.engine( 'handlebars', hbs() )

server.use('/', public)
server.listen(port)


// Inicio de Rutas del Dashboard //
server.get('/admin', async (req, res) =>{
    const DB = await connectDB()
    const productos = await DB.collection('Productos')
    const resultado = await productos.find({}).toArray()

    console.log('los productos son:')
    console.log( resultado )
    res.render('main', { 
        layout : false,
        items : resultado,
        url : req.protocol + "://"+ req.hostname + ":"+ port // <-- http://localhost:3000
    })

})

server.get('/admin/editar/:id', async (req, res) =>{
    res.end(`Aca hay que editar el producto: ${req.params.id}`)
})

server.get('/admin/nuevo', async (req, res) =>{
    res.end(`Aca vamos a ingresar un nuevo producto`)
})

// Fin de rutas del Dashboard //

server.get('/api', async (req, res) => {      //api para obtener los datos
    const DB = await connectDB()
    const productos = await DB.collection('Productos')
    const resultado = await productos.find({}).toArray() 
    res.json( resultado )
}) 

server.get('/api/:id' , async (req, res) =>{
    const DB = await connectDB()
    const productos = await DB.collection('Productos')

    const ID = req.params.id
    const query = { '_id' : ObjectId(ID) }
    const resultado = await productos.find( query ).toArray() 

    res.json( resultado )


})



server.post('/api', async (req, res) => {     // api para crer con datos
    const datos = req.body
    const productos = await DB.collection('Productos')
     
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


server.put('/api/:id', async (req, res) => {          // api para actualizar con datos
    
    const ID = req.params.id
    const datos = req.body

    const productos = await DB.collection('Productos')

    const query = { '_id' : ObjectId( ID ) }
    

    const update = { 
                    $set : {...datos }
                    }

    const resultado = await productos.updateOne( query, update )



  /*  const encontrado = DB.find(item => item.id == datos.id)
    encontrado.stock = datos.stock
*/
    res.json({ rta : 'ok'})
}) 
server.delete('/api/:id', async (req, res) => {       //api para eliminar los datos
    const ID = req.params.id

    const productos = await DB.collection('Productos')

    const query = { '_id' : ObjectId( ID ) }

    const result = await productos.findOneAndDelete( query )
    
    res.json({ rta : 'result.ok'})

}) 

/////////////JWT Test ///////////////
server.post('/login', (req, res) => {

    const datos = req.body

    if( datos.email == 'pepito@gmail.com' && datos.clave == 'HolaDonPepito2020') {
        
        const token = jwt.sign({})
        
        res.json({ rta : 'Estas logeado' })

    } else  {

        res.json({ rta: 'datos incorrectos'})
    }

})

server.get('/check', (req,res) => {

})