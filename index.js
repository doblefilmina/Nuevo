const express = require('express')
const multer = require('multer')
const joi = require('@hapi/joi')
const nodemailer = require('nodemailer')
const server = express()

const public = express.static('public')
const urlencoded = express.urlencoded({extended : true}) // con esta configuración, todo lo que viene en url encoded, se interpreta como objeto
const json = express.json()
const upload = multer()

const schemaContact = joi.object({
    nombre : joi.string().min(4).max(25).required(),
    correo: joi.string().email({ 
        minDomainSegments: 2,
        tlds: {
             allow: ['com', 'net', 'org']
     }
    }).required(),
    asunto : joi.string().alphanum().valid('ax14', 'ax38', 'ax45', 'ax67').required(),
    mensaje: joi.string().min(5).max(100).required()
})

// 1) crear la conexión con el servidor de email
const miniOutlook = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: 'pruebascoding12345@gmail.com',
        pass: process.env.EMAIL_PASS
    }
});

// 2) verificar la conexión con el servidor de email
miniOutlook.verify( (error, ok) => {
    error ? console.log('AHHHH!!!') : console.log('Todo legal')
})

        // Middleware
server.use( json )
server.use( upload.array() )
server.use( public )
server.use( urlencoded )


server.post('/enviar', function (request, response) {
  
  const datos = request.body

  console.log('Estos son los datos enviados:')
  console.log(datos)

  const validacion = schemaContact.validate( datos )

  if( validacion.error) { 
  response.json({ rta: 'error', details : validacion.error.details })

  } else { //si los datos son validos.. hacer magia
    miniOutlook.sendMail({
        from : datos.correo,
        to : "fede_brusa@hotmail.com",
        replyTo : datos.correo ,
        subject : "consulta desde la oscuridad del servidor",
        html : `<p>${datos.mensaje}</p>`
    }, function(error, info){
        const rta = error ? "su consulta no pudo ser enviada" : "gracias por su consulta"
        response.json({rta})
    })
    
   
  }
  
})
 
server.listen(3000)