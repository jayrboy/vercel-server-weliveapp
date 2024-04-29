import swaggerJsdoc from 'swagger-jsdoc'

/* ----- UI Swagger API  -----*/
const swaggerOption = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'A simple API documentation',
    },
    servers: [
      {
        url: 'http://localhost:8000',
      },
    ],
  },
  apis: ['./router/*.js', './index.js'],
}
export const swaggerSpec = swaggerJsdoc(swaggerOption)
