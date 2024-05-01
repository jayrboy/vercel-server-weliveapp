import 'dotenv/config'
import express from 'express'
import os from 'os'
import { readdirSync } from 'fs'
import morgan from 'morgan'
import cors from 'cors'
// import xhub from 'express-x-hub'
import cookieParser from 'cookie-parser'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
// import webhooks from './webhooks.js'

const app = express()
const files = readdirSync('./router')

/* --- Middleware --- */
if (process.env.NODE_ENV !== 'production') {
  3
  app.use(morgan('dev'))
}

app.use(cors())
// app.use(xhub({ algorithm: 'sha256', secret: process.env.APP_SECRET }))
app.use(express.urlencoded({ extended: true })) // body-parser
app.use(express.json()) // parser-json data sent in request.body

app.use(cookieParser())

files.map(async (file) => {
  let fs = await import(`./router/${file}`)
  app.use('/api', fs.default)
})

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
  apis: ['./router/*.js'], // Adjust this path as needed
}

const swaggerSpec = swaggerJsdoc(swaggerOption)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// app.use('/webhooks', webhooks)

app.disable('x-powered-by')

/* --- Server --- */
const port = process.env.PORT || 8000

app.listen(port, () => {
  console.log('Server running at http://localhost:%s', port)
})
