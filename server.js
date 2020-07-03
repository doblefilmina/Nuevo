const express = require('express')
const hbs = require('express-handlebars')
const { MongoClient } = require('mongodb')
const { ObjectId } = require('mongodb')
const server = express()


const urlencoded = express.urlencoded({ extended : true })
const json = express.json()
const public = express.static(__dirname + '/public')

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
server.set('view engine', 'handlebars')
server.engine( 'handlebars', hbs() )

server.use('/', public)
server.listen(3000)


// Inicio de Rutas del Dashboard //
server.get('/admin', (req, res) =>{

    const productos = [{"_id":"5ef541d4ca97fcfffe753769","nombre":"5ef541d4ca97fcfffe753769","stock":"5","precio":"6900","disponible":"true","marca":"tu vieja"},{"_id":"5efbc65f6655a41144e74c03","nombre":"Jugo de Limon","stock":"999","precio":"99.99","marca":"Lemoncito"},{"_id":"5efbc7bc6655a41144e74c04","nombre":"Pan de queso","stock":"500","precio":"300","marca":"Quesolito"},{"_id":"5efe547bbceae77e54fcbad9","nombre":"leche","stock":"780","precio":"54","marca":"devaca","disponibilidad":"true"},{"_id":"5efe5d30814ab28cc096079d","nombre":"leche","stock":"780","precio":"54","marca":"devaca","disponibilidad":"true"},{"_id":"5efe5e6732662f5fe4d846f5","nombre":"caramelos","stock":"43","precio":"8","marca":"flin-paf","disponibilidad":"true","disponible":"true"},{"_id":"5efe5f19443dcd8c7475bf5e","nombre":"Lavarropas","stock":"5","precio":"6900","marca":"devaca","disponibilidad":"true","Marca":"florencia","disponible":"true"},{"_id":"5efe6b808d75c482303b8fc1","nombre":"iPhone X","stock":"500","precio":"699","asunto":"apple","detalle":"Modelo A6253 v4 64GB - LTE - Wifi 802.11n"}]
        
    res.render('listado', {productos})

} )

server.get('/admin/contacto', (req, res) =>{
    
    res.render('listado', {ACCION: 'productos'})

} )


// Fin de rutas del Dashboard //

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