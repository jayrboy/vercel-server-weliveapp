import express from 'express'
import { DailyStock } from '../models.js'

const router = express.Router()

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
      date_added: form.date_added
        ? new Date(Date.parse(form.date_added))
        : new Date(),
    }

    const dailyStock = await DailyStock.findOneAndUpdate(
      { 'products._id': form._id },
      { $set: { 'products.$': data } },
      { new: true }
    )
    res.json(dailyStock.products) // ส่งข้อมูล DailyStock ที่อัปเดตแล้วกลับไป
  } catch (error) {
    console.log('Error updating product:', error)
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลสินค้า' })
  }
})

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

router.delete('/daily/delete/product/:id', async (req, res) => {
  try {
    const productId = req.params.id
    const deletedProduct = await DailyStock.updateOne(
      {},
      { $pull: { products: { _id: productId } } }
    )

    if (deletedProduct.nModified === 0) {
      return res.status(404).send('ไม่พบสินค้าที่ต้องการลบ')
    }

    res.send('ลบข้อมูลสินค้าเรียบร้อย')
  } catch (error) {
    console.log('Error deleting product:')
    res.status(500).send('เกิดข้อผิดพลาดในการลบข้อมูลสินค้า')
  }
})

export default router
