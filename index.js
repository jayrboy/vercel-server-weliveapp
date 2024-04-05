import 'dotenv/config'
import express from 'express'
import os from 'os'
import { readdirSync } from 'fs'
import morgan from 'morgan'
import cors from 'cors'
import xhub from 'express-x-hub'
import cookieParser from 'cookie-parser'

import webhooks from './webhooks.js'

const app = express()

/* --- Middleware --- */
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}
app.use(cors())
app.use(xhub({ algorithm: 'sha256', secret: process.env.APP_SECRET }))
app.use(express.urlencoded({ extended: true })) // body-parser
app.use(express.json()) // parser-json data sent in request.body

app.use(cookieParser())

app.get('/', (req, res) => {
  res.send(`<h1>Hello From Server... <br> ${os.hostname()}</h1>`)
})

app.use('/webhooks', webhooks)

const files = readdirSync('./router')
files.map(async (file) => {
  let fs = await import(`./router/${file}`)
  app.use('/api', fs.default)
})

app.disable('x-powered-by')

/* --- Server --- */
const port = process.env.PORT || 8000

const startApp = () => {
  try {
    app.listen(port, () => {
      console.log('Server running at http://localhost:%s', port)
    })
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

startApp()
