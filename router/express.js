import express from 'express'
import { ExpressModel } from '../models.js'

const router = express.Router()

/**
 * @swagger
 * /api/ex/create:
 *   post:
 *     summary: Create a new Express entry
 *     tags: [Express]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               exname:
 *                 type: string
 *               fprice:
 *                 type: number
 *               sprice:
 *                 type: string
 *               maxprice:
 *                 type: number
 *               whenfprice:
 *                 type: number
 *               selectex:
 *                 type: number
 *               selectcod:
 *                 type: number
 *               date_start:
 *                 type: string
 *                 format: date-time
 *             required:
 *               - exname
 *               - fprice
 *               - maxprice
 *               - whenfprice
 *               - selectex
 *               - selectcod
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
 */
router.post('/ex/create', (req, res) => {
  let form = req.body
  let data = {
    exname: form.exname || '',
    fprice: form.fprice || 0,
    sprice: form.sprice || '',
    maxprice: form.maxprice || 0,
    whenfprice: form.whenfprice || 0,
    selectex: form.selectex || 1,
    selectcod: form.selectcod || 1,
    date_start: new Date(Date.parse(form.date_start)) || new Date(),
  }

  ExpressModel.create(data)
    .then((docs) => {
      console.log('Document saved')
      res.send(true)
    })
    .catch((err) => {
      console.log(err.message).send(false)
    })
})

/**
 * @swagger
 * /api/ex/read:
 *    get:
 *      summary: Retrieve all Express entries
 *      tags: [Express]
 *      responses:
 *        200:
 *          description: Successful operation
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    exname:
 *                      type: string
 *                    fprice:
 *                      type: number
 *                    sprice:
 *                      type: string
 *                    maxprice:
 *                      type: number
 *                    whenfprice:
 *                      type: number
 *                    selectex:
 *                      type: number
 *                    selectcod:
 *                      type: number
 *                    date_start:
 *                      type: string
 *                      format: date-time
 */
router.get('/ex/read', (req, res) => {
  ExpressModel.find()
    .exec()
    .then((docs) => {
      res.json(docs)
    })
})

/**
 * @swagger
 * /api/ex/update:
 *    post:
 *      summary: Update an Express entry
 *      tags: [Express]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                _id:
 *                  type: string
 *                exname:
 *                  type: string
 *                fprice:
 *                  type: number
 *                sprice:
 *                  type: string
 *                maxprice:
 *                  type: number
 *                whenfprice:
 *                  type: number
 *                date_start:
 *                  type: string
 *                  format: date-time
 *              required:
 *                - _id
 *      responses:
 *        200:
 *          description: Successful operation. Returns all Express entries.
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    exname:
 *                      type: string
 *                    fprice:
 *                      type: number
 *                    sprice:
 *                      type: string
 *                    maxprice:
 *                      type: number
 *                    whenfprice:
 *                      type: number
 *                    date_start:
 *                      type: string
 *                      format: date-time
 */
router.post('/ex/update', (req, res) => {
  let form = req.body
  let data = {
    exname: form.exname || '',
    fprice: form.fprice || 0,
    sprice: form.sprice || '',
    maxprice: form.maxprice || 0,
    whenfprice: form.whenfprice || 0,
    date_start: new Date(Date.parse(form.date_start)) || new Date(),
  }

  ExpressModel.findByIdAndUpdate(form._id, data, { useFindAndModify: false })
    .exec()
    .then(() => {
      //หลังการอัปเดต ก็อ่านข้อมูลอีกครั้ง แล้วส่งไปแสดงผลที่ฝั่งโลคอลแทนข้อมูลเดิม
      ExpressModel.find()
        .exec()
        .then((docs) => res.json(docs))
    })
    .catch((err) => res.json({ message: err }))
})

/**
 * @swagger
 * /api/ex/delete:
 *    post:
 *      summary: Delete an Express entry
 *      tags: [Express]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                _id:
 *                  type: string
 *              required:
 *                - _id
 *      responses:
 *        200:
 *          description: Successful operation. Returns all remaining Express entries.
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    exname:
 *                      type: string
 *                    fprice:
 *                      type: number
 *                    sprice:
 *                      type: string
 *                    maxprice:
 *                      type: number
 *                    whenfprice:
 *                      type: number
 *                    date_start:
 *                      type: string
 *                      format: date-time
 */
router.post('/ex/delete', (req, res) => {
  let _id = req.body._id

  ExpressModel.findOneAndDelete(_id, { useFindAndModify: false })
    .exec()
    .then(() => {
      ExpressModel.find()
        .exec()
        .then((docs) => res.json(docs))
    })
    .catch((err) => res.json({ message: err.message }))
})

/**
 * @swagger
 * /api/ex/search:
 *    get:
 *      summary: Search for Express entries
 *      tags: [Express]
 *      parameters:
 *        - in: query
 *          name: q
 *          description: Search query string
 *          required: false
 *          schema:
 *            type: string
 *        - in: query
 *          name: page
 *          description: Page number for pagination
 *          required: false
 *          schema:
 *            type: integer
 *            minimum: 1
 *      responses:
 *        200:
 *          description: Successful operation. Returns Express entries.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  docs:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        exname:
 *                          type: string
 *                        fprice:
 *                          type: number
 *                        sprice:
 *                          type: string
 *                        maxprice:
 *                          type: number
 *                        whenfprice:
 *                          type: number
 *                        date_start:
 *                          type: string
 *                          format: date-time
 *                  totalDocs:
 *                    type: integer
 *                  totalPages:
 *                    type: integer
 *                  page:
 *                    type: integer
 *                  pagingCounter:
 *                    type: integer
 *                  hasPrevPage:
 *                    type: boolean
 *                  hasNextPage:
 *                    type: boolean
 */
router.get('/ex/search', (req, res) => {
  let q = req.query.q || ''

  //กรณีนี้ให้กำหนด pattern ด้วย RegExp แทนการใช้ / /
  let pattern = new RegExp(q, 'ig')

  //จะค้นหาจากฟิลด์ name
  let conditions = {
    $or: [{ exname: { $regex: pattern } }, { detail: { $regex: pattern } }],
  }

  let options = {
    page: req.query.page || 1, //เพจปัจจุบัน
    limit: 3, //แสดงผลหน้าละ 2 รายการ (ข้อมูลมีน้อย)
  }

  ExpressModel.paginate(conditions, options, (err, result) => {
    res.json(result)
  })
})

/**
 * @swagger
 * components:
 *   schemas:
 *     Express:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the express entry.
 *         exname:
 *           type: string
 *           description: The name of the express entry.
 *         fprice:
 *           type: number
 *           description: The first price of the express entry.
 *         sprice:
 *           type: string
 *           description: The second price of the express entry.
 *         maxprice:
 *           type: number
 *           description: The maximum price of the express entry.
 *         whenfprice:
 *           type: number
 *           description: The when first price of the express entry.
 *         date_start:
 *           type: string
 *           format: date-time
 *           description: The date and time when the express entry was started.
 *       required:
 *         - exname
 *         - fprice
 *         - date_start
 */

export default router
