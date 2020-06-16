const express = require('express')
const server = express()

const public = express.static('public')

server.use( public )
 
server.post('/enviar', function (request, response) {
  response.send('Hello Form')
})
 
server.listen(3000)