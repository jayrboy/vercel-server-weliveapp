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

router.post('/daily/update', (req, res) => {
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
  DailyStock.findByIdAndUpdate(form._id, data, { useFindAndModify: false })
    .exec()
    .then(() => {
      //หลังการอัปเดต ก็อ่านข้อมูลอีกครั้ง แล้วส่งไปแสดงผลที่ฝั่งโลคอลแทนข้อมูลเดิม
      DailyStock.find()
        .exec()
        .then((docs) => {
          console.log('Document updated', docs)
          res.json(docs)
        })
    })
    .catch((err) => res.json({ message: err.message }))
})

router.post('/daily/delete', (req, res) => {
  let _id = req.body._id

  DailyStock.findByIdAndDelete(_id, { useFindAndModify: false })
    .exec()
    .then(() => {
      DailyStock.find()
        .exec()
        .then((docs) => res.json(docs))
    })
    .catch((err) => res.json({ message: err }))
})

export default router
