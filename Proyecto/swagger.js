const swaggerJSDoc = require('swagger-jsdoc')
const swaggerDefinition = {
openapi : '3.0.0',
info : {
title : 'MyAPI',
version: '1.0.0',
description:'Ejemplo de documentar son Swagger'
 },
}
const options = {
swaggerDefinition,
apis:['./routes/*.js'],
}
const swaggerSpec = swaggerJSDoc(options)
module.exports = swaggerSpec