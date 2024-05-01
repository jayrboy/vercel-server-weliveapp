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
  app.use(morgan('dev'))
}

app.use(cors())
// app.use(xhub({ algorithm: 'sha256', secret: process.env.APP_SECRET }))
app.use(express.urlencoded({ extended: true })) // body-parser
app.use(express.json()) // parser-json data sent in request.body

app.use(cookieParser())

app.get('/', (req, res) => {
  res.send(
    `<h1>Server running at <br> ${os.hostname()}</h1> <br> <a href="/api-docs">Swagger API</a>`
  )
})

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
  apis: ['./router/*.js'],
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

let orderCustomer = [
  {
    _id: 1,
    date_added: new Date(),
    status: 'new',
    channel: 'facebook',
    total: 7801,
    promotion: 0,
    paid: false,
    customer: [
      {
        id: '123_456',
        name: 'Jay Jakkrit',
        email: 'jay@test.com',
        picture: {
          data: {
            url: 'http://m.gettywallpapers.com/wp-content/uploads/2023/06/Messi-pfp.jpg',
          },
        },
      },
    ],

    orders: [
      {
        _id: 1,
        code: 'A01',
        name: 'กระเป๋าสัมภาระ',
        quantity: 3,
        price: 150,
        total: 450,
      },
      {
        _id: 2,
        code: 'B02',
        name: 'เสื้อยืด',
        quantity: 5,
        price: 299,
        total: 1495,
      },
      {
        _id: 3,
        code: 'C03',
        name: 'กางเกงยีนส์',
        price: 499,
        quantity: 2,
        total: 998,
      },
      {
        _id: 4,
        code: 'D04',
        name: 'รองเท้าผ้าใบ',
        price: 899,
        quantity: 1,
        total: 899,
      },
      {
        _id: 5,
        code: 'E05',
        name: 'หมวกกันน้ำ',
        price: 149,
        quantity: 4,
        total: 596,
      },
      {
        _id: 6,
        code: 'F06',
        name: 'ถุงเท้า',
        price: 79,
        quantity: 6,
        total: 474,
      },
      {
        _id: 7,
        code: 'G07',
        name: 'แว่นตากันแดด',
        price: 150,
        quantity: 2,
        total: 300,
      },
      {
        _id: 8,
        code: 'H08',
        name: 'กล้องถ่ายรูป',
        price: 1999,
        quantity: 1,
        total: 1999,
      },
      {
        _id: 9,
        code: 'I09',
        name: 'ปากกา',
        price: 29,
        quantity: 10,
        total: 290,
      },
      {
        _id: 10,
        code: 'J10',
        name: 'แผ่นรองเมาส์',
        price: 100,
        quantity: 3,
        total: 300,
      },
    ],
  },
]

app.get('/o/:id', (req, res) => {
  res.send(orderCustomer)
})
