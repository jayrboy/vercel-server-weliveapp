import 'dotenv/config'
import express from 'express'
import os from 'os'
import fs from 'fs'

import connectDB from './Data/db.js'
import cors from 'cors'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import xhub from 'express-x-hub'
// import webhooks from './webhooks.js'

const app = express()

/* --- API Spec --- */
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API with Swagger',
      version: '1.0.0',
      description: 'We Live App API documented',
    },
    servers: [
      {
        url: 'http://localhost:8000',
      },
    ],
  },
  apis: ['./Routes/*.js'], // ระบุ path ไปยังไฟล์ที่มี API documentation
}
const swagger = swaggerJsdoc(options)

/* --- Middleware --- */
app.use(cors())
app.use(xhub({ algorithm: 'sha256', secret: process.env.APP_SECRET }))
app.use(express.urlencoded({ extended: true })) // body-parser
app.use(express.json()) // parser-json data sent in request.body
app.use(cookieParser())

if (process.env.NODE_ENV != 'production') {
  app.use(morgan('dev'))
  app.get('/', (req, res) => res.redirect('api-docs'))
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swagger))
} else {
  app.get('/', (req, res) => {
    res.status(200).send(`<h1>${os.hostname()}</h1>`)
  })
}
// app.use('/webhooks', webhooks)

/* --- API Endpoints --- */
const files = fs.readdirSync('./Routes')
for (const file of files) {
  let fs = await import(`./Routes/${file}`)
  app.use('/api', fs.default)
}

app.use((req, res) => {
  // กรณีที่กำหนด URL ไม่ตรงกับพาธ
  res.status(404).type('text/plain').send('404 Not Found')
})

/* --- Server --- */
const port = process.env.PORT || 8000
const runApp = () => {
  try {
    app.listen(port, () => {
      console.log('Server running at http://localhost:%s', port)
    })
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

runApp()
connectDB()
