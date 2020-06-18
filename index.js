const express = require('express')
const multer = require('multer')
const joi = require('@hapi/joi')
const server = express()

const public = express.static('public')
const urlencoded = express.urlencoded({extended : true}) // con esta configuración, todo lo que viene en url encoded, se interpreta como objeto
const json = express.json()
const upload = multer()

const schemaContact = joi.object( {
    nombre : joi.string().alphanum().min(4).max(25).required(),
    correo: joi.string().email({ 
        minDomainSegments: 2,
        tlds: {
             allow: ['com', 'net', 'org']
     }
    }),
    asunto : joi.string().alphanum().valid('ax14', 'ax38', 'ax45', 'ax67').required(),
    mensaje: joi.string().alphanum().min(10).max(100).required()
})

        // Middleware
server.use( json )
server.use ( urlencoded )
server.use( upload.array() )
server.use( public )

const datos = {
    nombre: "Luis Miguel",
    correo: "luis@miguel.com",
    asunto: "ax14",
    mensaje: "No culpers a la noche.."
}


server.post('/enviar', function (request, response) {
  
  const datos = request.body

  console.log('Estos son los datos enviados:')
  console.log(datos)

  const validacion = schemaContact.validate( datos )
  response.json({ rta: 'ok'})
  
})
 
server.listen(3000)