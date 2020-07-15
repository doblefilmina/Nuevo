const express = require('express')
const hbs = require('express-handlebars')
const { MongoClient } = require('mongodb')
const { ObjectId } = require('mongodb')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const server = express()


const urlencoded = express.urlencoded({ extended : true })
const json = express.json()
const public = express.static(__dirname + '/public')
const cookies = cookieParser()

const url = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_HOST}/${process.env.MONGODB_BASE}?retryWrites=true&w=majority`

const connectDB = async () =>{
    const client = await MongoClient.connect(url, { useUnifiedTopology: true } )
    
    return await client.db("MercadoTECH")
}

const port = process.env.PORT || 3000

server.use( json )
server.use( urlencoded )
server.use( cookies)
server.set('view engine', 'handlebars')
server.engine( 'handlebars', hbs() )

server.use('/', public)
server.listen(port)

/////////////JWT Test ///////////////

const verifyToken = (req, res, next) => {
    const token = req.cookies._auth   //verifica el token
    console.log(token)

    jwt.verify(token, process.env.JWT_PASSPHRASE, (error,data) => {
        if (error) {
            res.redirect('http://localhost:3000/admin/ingresar')
        } else {
            req.user = data.usuario
            next()
        }
    })
}


// Inicio de Rutas del Dashboard //
server.get('/admin', async (req, res) =>{
    const DB = await connectDB()

    const productos = await DB.collection('Productos')
    const resultado = await productos.find({}).toArray()

    res.render('main', { 
        layout : false,
        items : resultado,
        url : req.protocol + "://"+ req.hostname + ":"+ port // <-- http://localhost:3000
    })

})

server.get('/admin/nuevo', verifyToken, async (req, res) =>{
    const hansel = req.cookies._auth
    res.write(`<p> El token de la cookie es: ${hansel}</p>`)
    res.end(`Aca hay que agregar nuevo producto`)
   
})

server.get('/admin/editar/:id', async (req, res) =>{
    res.end(`Aca hay que editar el producto: ${req.params.id}`)
})



server.get('/admin/ingresar', async (req, res) =>{
    res.render('login', {layout: false})
})

// Fin de rutas del Dashboard //


//////// API REST //////////////
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

    res.json({ rta : 'ok'})
}) 

server.delete('/api/:id', async (req, res) => {       //api para eliminar los datos
    const ID = req.params.id

    const productos = await DB.collection('Productos')

    const query = { '_id' : ObjectId( ID ) }

    const result = await productos.findOneAndDelete( query )
    
    res.json({ rta : 'result.ok'})

})

       

  /*  const encontrado = DB.find(item => item.id == datos.id)
    encontrado.stock = datos.stock
*/
    
 

//////// JWT login //////////////


server.post('/login', (req, res) => {

    const datos = req.body

    if( datos.email == 'pepito@gmail.com' && datos.clave == 'HolaDonPepito2020') {

        const vencimientoTimestamp = Date.now() + 60*1000*5     //dentro de 5 minutos (en milisegundos)
        const vencimientoFecha = new Date( vencimientoTimestamp ) 
        
        const token = jwt.sign({ usuario : datos.email, expiresIn : 60}, process.env.JWt_PASSPHRASE)
        
        res.cookie("_auth", token, { expires: vencimientoFecha, httpOnly: true , sameSite: "Strict", secure: false })

        res.redirect('http://localhost:3000/admin')
    } else  {

        res.json({ rta: 'datos incorrectos'})
    }

})