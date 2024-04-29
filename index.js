import 'dotenv/config'
import express from 'express'
import os from 'os'
import { readdirSync } from 'fs'
import morgan from 'morgan'
import cors from 'cors'
// import xhub from 'express-x-hub'
import cookieParser from 'cookie-parser'

import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './swaggerConfig.js'

// import webhooks from './webhooks.js'
import { channel } from 'diagnostics_channel'

const app = express()

/* --- Middleware --- */
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}
app.use(cors())
// app.use(xhub({ algorithm: 'sha256', secret: process.env.APP_SECRET }))
app.use(express.urlencoded({ extended: true })) // body-parser
app.use(express.json()) // parser-json data sent in request.body
app.use(cookieParser())

/* ----- UI Swagger API  -----*/
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.get('/', (req, res) => {
  res.send(
    `<h1>Server running at <br> ${os.hostname()}</h1> <br> <a href="/api-docs">Swagger API</a>`
  )
})

// app.use('/webhooks', webhooks)

const files = readdirSync('./router')
files.map(async (file) => {
  let fs = await import(`./router/${file}`)
  app.use('/api', fs.default)
})

/**
 * @swagger
 * /o/{id}:
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: number
 *    get:
 *      summary: Get Sale Orders
 *      responses:
 *        200:
 *          description: Successful response
 *        500:
 *          description: Internal server error
 */
app.get('/o/:id', (req, res) => {
  // Your API
  res.send(orderCustomer)
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
