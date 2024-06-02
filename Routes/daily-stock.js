import express from 'express'
import DailyStock from '../Models/DailyStock.js'

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

export default router
