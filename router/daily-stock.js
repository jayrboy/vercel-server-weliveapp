import express from 'express'
import { DailyStock } from '../models.js'

const router = express.Router()

/**
 * @swagger
 * /api/daily/create:
 *   post:
 *     summary: Create a new daily stock
 *     tags: [DailyStock]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               chanel:
 *                 type: string
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *               price_total:
 *                 type: number
 *               date_added:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad request
 */
router.post('/daily/create', (req, res) => {
  let form = req.body
  let data = {
    status: form.status || 'New',
    chanel: form.chanel || 'Facebook',
    products: form.products || [],
    price_total: form.price_total || 0,
    date_added: form.date_added
      ? new Date(Date.parse(form.date_added))
      : new Date(),
  }

  // console.log(data)

  DailyStock.create(data)
    .then((docs) => {
      console.log('document saved new daily stock')
      res.send(true)
    })
    .catch((err) => {
      console.log('error saving daily stock:', err)
      res.send(false)
    })
})

/**
 * @swagger
 * /api/daily/read:
 *   get:
 *     summary: Retrieve all daily stocks
 *     tags: [DailyStock]
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DailyStock'
 *       500:
 *         description: Internal server error
 */
router.get('/daily/read', (req, res) => {
  DailyStock.find()
    .sort({ date_added: -1 }) // เรียงข้อมูลตามวันที่เพิ่มข้อมูลล่าสุดก่อน
    .exec()
    .then((docs) => res.json(docs))
    .catch((err) => {
      console.error('Error reading daily stocks:', err)
      res.status(500).send(false)
    })
})

/**
 * @swagger
 * /api/daily/read/{id}:
 *   get:
 *     summary: Retrieve a daily stock by ID
 *     tags: [DailyStock]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the daily stock to retrieve
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DailyStock'
 *       404:
 *         description: Daily stock not found
 */
router.get('/daily/read/:id', (req, res) => {
  let id = req.params.id
  DailyStock.findById(id)
    .exec()
    .then((docs) => res.json(docs))
})

/**
 * @swagger
 * /daily/read/{id}/product/{idproduct}:
 *   get:
 *     summary: Retrieve a product from a daily stock by ID
 *     tags: [DailyStock]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the daily stock containing the product
 *       - in: path
 *         name: idproduct
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the product to retrieve
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Daily stock or product not found
 *       500:
 *         description: Internal server error
 */
router.get('/daily/read/:id/product/:idproduct', async (req, res) => {
  // console.log(req.params)
  const dailyStockId = req.params.id
  const productId = req.params.idproduct
  try {
    const dailyStock = await DailyStock.findOne({
      _id: dailyStockId,
      'products._id': productId,
    })
    const product = dailyStock.products.find((p) => p._id == productId)

    res.json(product)
  } catch (error) {
    console.log('Error retrieving product:', error)
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า' })
  }
})

/**
 * @swagger
 * /api/daily/new-status:
 *   get:
 *     summary: Retrieve the latest daily stock with status 'new'
 *     tags: [DailyStock]
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DailyStock'
 *       404:
 *         description: No daily stock with status 'new' found
 *       500:
 *         description: Internal server error
 */
router.get('/daily/new-status', (req, res) => {
  DailyStock.findOne({ status: 'new' }) // ค้นหาเอกสารที่มี status เป็น 'new'
    .sort({ date_added: -1 }) // เรียงลำดับตามวันที่เพิ่มข้อมูลในลำดับล่าสุดก่อน
    .exec()
    .then((doc) => res.json(doc))
    .catch((err) => {
      console.error('Error reading latest daily stocks:', err)
      res.status(500).send(false)
    })
})

/**
 * @swagger
 * /api/daily/update:
 *   post:
 *     summary: Update a product within a daily stock
 *     tags: [DailyStock]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idDaily:
 *                 type: string
 *                 description: ID of the daily stock containing the product to update
 *               idProduct:
 *                 type: string
 *                 description: ID of the product to update
 *               code:
 *                 type: string
 *                 description: Product code
 *               name:
 *                 type: string
 *                 description: Product name
 *               price:
 *                 type: number
 *                 description: Product price
 *               cost:
 *                 type: number
 *                 description: Product cost
 *               stock:
 *                 type: number
 *                 description: Product stock
 *               limit:
 *                 type: number
 *                 description: Product limit
 *               cf:
 *                 type: number
 *                 description: Product cf
 *               remaining_cf:
 *                 type: number
 *                 description: Remaining cf
 *               paid:
 *                 type: number
 *                 description: Paid amount
 *               date_added:
 *                 type: string
 *                 description: Date added in ISO 8601 format (e.g., "2022-04-29T12:00:00Z")
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DailyStock'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/daily/update', (req, res) => {
  const form = req.body
  const idDaily = req.body.idDaily
  const idProduct = req.body.idProduct

  const data = {
    code: form.code || '',
    name: form.name || '',
    price: form.price || 0,
    cost: form.cost || 0,
    stock: form.stock || 0,
    limit: form.limit || 0,
    cf: form.cf || 0,
    remaining_cf: form.remaining_cf || 0,
    paid: form.paid || 0,
    remaining: (form.stock || 0) - (form.paid || 0),
    date_added: form.date_added
      ? new Date(Date.parse(form.date_added))
      : new Date(),
  }

  // อัปเดตข้อมูล products ภายใน DailyStock
  DailyStock.findOneAndUpdate(
    {
      _id: idDaily, // เงื่อนไขการค้นหาเอกสาร DailyStock ด้วย _id
      'products._id': idProduct, // เงื่อนไขการค้นหาสินค้าภายใน products ด้วย _id ของสินค้า
    },
    {
      $set: {
        'products.$.code': data.code,
        'products.$.name': data.name,
        'products.$.price': data.price,
        'products.$.cost': data.cost,
        'products.$.stock': data.stock,
        'products.$.limit': data.limit,
        'products.$.cf': data.cf,
        'products.$.remaining_cf': data.remaining_cf,
        'products.$.paid': data.paid,
        'products.$.remaining': data.stock - data.paid,
        'products.$.date_added': data.date_added,
      },
    },
    { new: true } // ตัวเลือกเพื่อให้คืนค่าเอกสารหลังจากการอัปเดต
  )
    .then((docs) => {
      console.log('daily stock updated')
      res.json(docs)
    })
    .catch((err) => {
      res.json({ error: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล DailyStock' })
    })
})

/**
 * @swagger
 * /api/daily/update/total:
 *   post:
 *     summary: Update the total price of a daily stock
 *     tags: [DailyStock]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID of the daily stock to update
 *               total:
 *                 type: number
 *                 description: New total price of the daily stock
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DailyStock'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/daily/update/total', (req, res) => {
  const { id, total } = req.body

  DailyStock.findByIdAndUpdate(id, { price_total: total }, { new: true })
    .then((docs) => {
      // console.log(docs)
      res.json(docs)
    })
    .catch((err) => {
      console.error('Error updating DailyStock:')
      res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล' })
    })
})

/**
 * @swagger
 * /daily/delete/product/{id}:
 *   delete:
 *     summary: Delete a product from all daily stocks by ID
 *     tags: [DailyStock]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the product to delete
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found in any daily stock
 *       500:
 *         description: Internal server error
 */
router.delete('/daily/delete/product/:id', (req, res) => {
  const productId = req.params.id
  // console.log(productId)

  DailyStock.updateOne({}, { $pull: { products: { _id: productId } } })
    .exec()
    .then((result) => {
      if (result.nModified > 0) {
        res.send('ลบข้อมูลสินค้าเรียบร้อย')
      } else {
        res.send('ไม่พบสินค้าที่ต้องการลบ')
      }
    })
    .catch((err) => {
      console.log('เกิดข้อผิดพลาดในการลบข้อมูลสินค้า:', err)
      res.send('เกิดข้อผิดพลาดในการลบข้อมูลสินค้า')
    })
})

/**
 * @swagger
 * /api/daily/change-role:
 *   post:
 *     summary: Change the status of a daily stock by ID
 *     tags: [DailyStock]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID of the daily stock to update
 *               status:
 *                 type: string
 *                 description: New status to assign to the daily stock
 *     responses:
 *       200:
 *         description: Daily stock status changed successfully
 *       404:
 *         description: Daily stock not found
 *       500:
 *         description: Internal server error
 */
router.post('/daily/change-role', (req, res) => {
  // console.log(req.body)
  const id = req.body.id
  const newStatus = req.body.status

  DailyStock.findByIdAndUpdate(
    id,
    { status: newStatus },
    { useFindAndModify: false }
  )
    .exec()
    .then((docs) => {
      // console.log(docs)
      if (!docs) {
        res.send('อัปเดตไม่สำเร็จ')
      } else {
        res.send('อัปเดตสำเร็จ')
      }
    })
    .catch((err) => res.send('เกิดข้อผิดพลาด ไม่สามารถแก้ไขได้'))
})

/**
 * @swagger
 * components:
 *   schemas:
 *     DailyStock:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier of the daily stock.
 *         status:
 *           type: string
 *           description: The status of the daily stock.
 *         chanel:
 *           type: string
 *           description: The channel of the daily stock.
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 *           description: The list of products in the daily stock.
 *         price_total:
 *           type: number
 *           description: The total price of the daily stock.
 *         date_added:
 *           type: string
 *           format: date-time
 *           description: The date and time when the daily stock was added.
 *       required:
 *         - status
 *         - chanel
 *         - products
 *         - price_total
 *         - date_added
 */

export default router
