import express from 'express'
import { Product } from '../models.js'

const router = express.Router()

/*  
 http://localhost:8000/api/db
 https://vercel-server-weliveapp.vercel.app/api/db 
*/

/**
 * @swagger
 * /api/db/create:
 *    post:
 *      tags: [Product]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                code:
 *                  type: string
 *                name:
 *                  type: string
 *                price:
 *                  type: number
 *                cost:
 *                  type: number
 *                stock:
 *                  type: number
 *                date_added:
 *                  type: string
 *      responses:
 *        200:
 *          description: Document saved
 *          content:
 *            schema:
 *              type: boolean
 *        500:
 *          description: Internal server error
 */
router.post('/db/create', (req, res) => {
  let form = req.body
  let data = {
    code: form.code || '',
    name: form.name || '',
    price: form.price || 0,
    cost: form.cost || 0,
    stock: form.stock || 0,
    limit: form.limit || 0,
    cf: form.cf || 0,
    remaining_cf: form.remaining_cf || 0,
    paid: form.paid || 0,
    remaining: form.stock || 0,
  }
  data.date_added = !isNaN(Date.parse(form.date_added))
    ? new Date(form.date_added)
    : new Date()
  // console.log(data)

  Product.create(data)
    .then((docs) => {
      console.log('Document saved')
      res.send(true)
    })
    .catch((err) => {
      console.log(err.message)
      res.send(false)
    })
})

/**
 * @swagger
 * /api/db/read:
 *    get:
 *      tags: [Product]
 *      responses:
 *        200:
 *          description: Successful response
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Product'
 *        500:
 *          description: Internal server error
 */
router.get('/db/read', (req, res) => {
  Product.find()
    .exec()
    .then((docs) => res.json(docs))
})

/**
 * @swagger
 * /api/db/read/{id}:
 *    get:
 *      tags: [Product]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the product to get
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Successful response
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Product'
 *        404:
 *          description: Product not found
 *        500:
 *          description: Internal server error
 */
router.get('/db/read/:id', (req, res) => {
  let id = req.params.id
  Product.findById(id)
    .exec()
    .then((docs) => res.json(docs))
})

/**
 * @swagger
 * /api/db/update:
 *    post:
 *      tags: [Product]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                _id:
 *                  type: string
 *                code:
 *                  type: string
 *                name:
 *                  type: string
 *                price:
 *                  type: number
 *                cost:
 *                  type: number
 *                stock:
 *                  type: number
 *                limit:
 *                  type: number
 *                date_added:
 *                  type: string
 *      responses:
 *        200:
 *          description: Document updated
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Product'
 *        500:
 *          description: Internal server error
 */
router.post('/db/update', (req, res) => {
  // console.log(req.body)
  let form = req.body
  let data = {
    code: form.code || '',
    name: form.name || '',
    price: form.price || 0,
    cost: form.cost || 0,
    stock: form.stock || 0,
    limit: form.limit || 0,
    date_added: new Date(Date.parse(form.date_added)) || new Date(),
  }

  // console.log(data)
  Product.findByIdAndUpdate(form._id, data, { useFindAndModify: false })
    .exec()
    .then(() => {
      //หลังการอัปเดต ก็อ่านข้อมูลอีกครั้ง แล้วส่งไปแสดงผลที่ฝั่งโลคอลแทนข้อมูลเดิม
      Product.find()
        .exec()
        .then((docs) => {
          console.log('Document updated')
          res.json(docs)
        })
    })
    .catch((err) => res.json({ message: err.message }))
})

/**
 * @swagger
 * /api/db/delete:
 *    post:
 *      tags: [Product]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                _id:
 *                  type: string
 *      responses:
 *        200:
 *          description: Document deleted
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Product'
 *        500:
 *          description: Internal server error
 */
router.post('/db/delete', (req, res) => {
  let _id = req.body._id

  Product.findByIdAndDelete(_id, { useFindAndModify: false })
    .exec()
    .then(() => {
      Product.find()
        .exec()
        .then((docs) => res.json(docs))
    })
    .catch((err) => res.json({ message: err }))
})

//สำหรับลบใน product ตอน create daily stock
/**
 * @swagger
 * /api/db/delete/{id}:
 *    delete:
 *      tags: [Product]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the product to delete
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Document deleted
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Product'
 *        500:
 *          description: Internal server error
 */
router.delete('/db/delete/:id', (req, res) => {
  let _id = req.params.id

  Product.findByIdAndDelete(_id, { useFindAndModify: false })
    .exec()
    .then(() => {
      // เมื่อลบข้อมูลสำเร็จ ทำการค้นหาข้อมูลสินค้าทั้งหมดใหม่
      Product.find()
        .exec()
        .then((docs) => res.json(docs))
    })
    .catch((err) => res.status(500).json({ message: err }))
})

/**
 * @swagger
 * /api/db/search:
 *    get:
 *      tags: [Product]
 *      summary: Search products
 *      description: Search for products by name or detail.
 *      parameters:
 *        - in: query
 *          name: q
 *          schema:
 *            type: string
 *          description: The query string for searching products by name or detail.
 *        - in: query
 *          name: page
 *          schema:
 *            type: integer
 *          description: The page number for pagination (default is 1).
 *      responses:
 *        200:
 *          description: A list of products that match the search criteria.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  docs:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/Product'
 *                  total:
 *                    type: integer
 *                    description: The total number of products found.
 *                  limit:
 *                    type: integer
 *                    description: The limit per page.
 *                  page:
 *                    type: integer
 *                    description: The current page number.
 *                  pages:
 *                    type: integer
 *                    description: The total number of pages.
 *        500:
 *          description: Internal server error
 */
router.get('/db/search', (req, res) => {
  let q = req.query.q || ''

  //กรณีนี้ให้กำหนด pattern ด้วย RegExp แทนการใช้ / /
  let pattern = new RegExp(q, 'ig')

  //จะค้นหาจากฟิลด์ name และ detail
  let conditions = {
    $or: [{ name: { $regex: pattern } }, { detail: { $regex: pattern } }],
  }

  let options = {
    page: req.query.page || 1, //เพจปัจจุบัน
    limit: 5, //แสดงผลหน้าละ 5 รายการ (ข้อมูลมีน้อย)
  }

  Product.paginate(conditions, options, (err, result) => {
    res.json(result)
  })
})

// รายละเอียดของสินค้า
/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the product.
 *         code:
 *           type: string
 *           description: The product code.
 *         name:
 *           type: string
 *           description: The name of the product.
 *         price:
 *           type: number
 *           description: The price of the product.
 *         cost:
 *           type: number
 *           description: The cost of the product.
 *         stock:
 *           type: number
 *           description: The stock of the product.
 *         limit:
 *           type: number
 *           description: The limit of the product.
 *         cf:
 *           type: number
 *           description: The cf of the product.
 *         remaining_cf:
 *           type: number
 *           description: The remaining cf of the product.
 *         paid:
 *           type: number
 *           description: The paid of the product.
 *         remaining:
 *           type: number
 *           description: The remaining of the product.
 *         date_added:
 *           type: string
 *           format: date-time
 *           description: The date added of the product.
 */

export default router
