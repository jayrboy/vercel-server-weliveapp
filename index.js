import 'dotenv/config'
import http from 'http'
import https from 'https'
import express from 'express'
import os from 'os'
import fs from 'fs'

import connectDB from './Data/db.js'
import cors from 'cors'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

import morgan from 'morgan'
import cookieParser from 'cookie-parser'

import webhooks from './tests/webhooks.js'

const app = express()

/* --- API Spec --- */
const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Express API with Swagger',
      version: '1.0.11',
      description:
        'Swagger Tools - [Swagger Editor](https://editor.swagger.io/?_gl=1*mogv8*_gcl_au*MzA2ODUyMTczLjE3MTQzOTk2MTA.&_ga=2.177703841.582691157.1717503507-1575908821.1714399610)',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./Routes/*.js'], // ระบุ path ไปยังไฟล์ที่มี API documentation
}
const swagger = swaggerJsdoc(options)

/* --- Middleware --- */
app.use(cors())
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
app.use('/webhooks', webhooks)

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

/* --- HTTP Server (Optional, Redirect to HTTPS) --- */
const httpPort = process.env.PORT || 8000

const httpServer = http.createServer((req, res) => {
  res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` })
  res.end()
})

httpServer.listen(httpPort, () => {
  console.log(`HTTP Server running at http://localhost:${httpPort}`)
})

/* --- HTTPS Server --- */
const httpsPort = 8443 // Choose a suitable HTTPS port

// const credentials = {
//   key: fs.readFileSync('./private.key'),
//   cert: fs.readFileSync('./certificate.crt'),
// }

// const httpsServer = https.createServer(credentials, app)

// httpsServer.listen(httpsPort, () => {
//   console.log(`HTTPS Server running at https://localhost:${httpsPort}`)
// })

connectDB()
