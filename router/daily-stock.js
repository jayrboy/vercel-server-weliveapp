import express from 'express'
import { DailyStock } from '../models.js'

const router = express.Router()

router.post('/daily/create', (req, res) => {
  let form = req.body
  let data = {
    status: form.status || 'new',
    chanel: form.chanel || 'facebook',
    products: form.products || [],
    price_total: form.price_total || 0,
  }

  data.date_added = !isNaN(Date.parse(form.date_added))
    ? new Date(form.date_added)
    : new Date()

  // console.log(data)

  DailyStock.create(data)
    .then((docs) => {
      console.log('Document saved new daily stock:', docs)
      res.send(true)
    })
    .catch((err) => {
      console.log('Error saving daily stock:', err)
      res.send(false)
    })
})

router.get('/daily/read', (req, res) => {
  DailyStock.find()
    .exec()
    .then((docs) => res.json(docs))
})

router.get('/daily/read/:id', (req, res) => {
  let id = req.params.id
  DailyStock.findById(id)
    .exec()
    .then((docs) => res.json(docs))
})

router.get('/daily/read/product/:id', async (req, res) => {
  const id = req.params.id
  try {
    const dailyStock = await DailyStock.findOne({ 'products._id': id }) // ค้นหา dailyStock ที่มี id ย่อยของสินค้าตรงกับ id ที่ระบุ
    if (!dailyStock) {
      return res
        .status(404)
        .json({ error: 'ไม่พบข้อมูล DailyStock ที่มีสินค้าที่มี ID ที่ระบุ' })
    }
    const product = dailyStock.products.find((product) => product._id == id) // ค้นหาสินค้าด้วย id ในฟิลด์ products
    if (!product) {
      return res
        .status(404)
        .json({ error: 'ไม่พบสินค้าที่มี ID ที่ระบุใน DailyStock' })
    }
    res.json(product) // ส่งข้อมูลสินค้ากลับไป
  } catch (error) {
    console.log('Error retrieving product:', error)
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า' })
  }
})

router.post('/daily/update', async (req, res) => {
  const form = req.body
  try {
    const data = {
      _id: form._id,
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
      date_added: form.date_added ? new Date(form.date_added) : new Date(),
    }
    console.log(data)

    const dailyStock = await DailyStock.findOneAndUpdate(
      { 'products._id': form._id }, // เงื่อนไขในการค้นหา DailyStock ที่มีสินค้าที่ต้องการอัปเดต
      { $set: { 'products.$': data } },
      { new: true } // ตั้งค่าเพื่อให้คืนค่า DailyStock หลังจากการอัปเดต
    )

    if (!dailyStock) {
      return res
        .status(404)
        .json({ error: 'ไม่พบข้อมูล DailyStock ที่มีสินค้าที่ต้องการอัปเดต' })
    }

    res.json(dailyStock.products) // ส่งข้อมูล DailyStock ที่อัปเดตแล้วกลับไป
  } catch (error) {
    console.log('Error updating product:', error)
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลสินค้า' })
  }
})

router.post('/daily/delete/:id', async (req, res) => {
  let id = req.params.id
  console.log(id)

  try {
    const deletedProduct = await DailyStock.deleteOne({ 'products._id': id })

    if (deletedProduct.deletedCount === 0) {
      return res.status(404).json({ error: 'ไม่พบสินค้าที่ต้องการลบ' })
    }

    res.json({ message: 'ลบข้อมูลสินค้าเรียบร้อย' })
  } catch (error) {
    console.log('Error deleting product:', error)
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบข้อมูลสินค้า' })
  }
})

export default router
