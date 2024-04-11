import express from 'express'
import { Product } from '../models.js'

const router = express.Router()

/*  
 http://localhost:8000/api/db
 https://vercel-server-weliveapp.vercel.app/api/db 
*/

router.post('/db/create', (req, res) => {
  let form = req.body
  let data = {
    code: form.code || '',
    name: form.name || '',
    price: form.price || 0,
    cost: form.cost || 0,
    stock: form.stock || 0,
    remaining_cf: form.remaining_cf || 0,
    remaining: form.stock || 0,
  }
  data.date_added = !isNaN(Date.parse(form.date_added))
    ? new Date(form.date_added)
    : new Date()
  // console.log(data)

  Product.create(data)
    .then((docs) => {
      console.log('Document saved', docs)
      res.send(true)
    })
    .catch((err) => {
      console.log(err.message)
      res.send(false)
    })
})

router.get('/db/read', (req, res) => {
  Product.find()
    .exec()
    .then((docs) => res.json(docs))
})

router.get('/db/read/:id', (req, res) => {
  let id = req.params.id
  Product.findById(id)
    .exec()
    .then((docs) => res.json(docs))
})

router.post('/db/update', (req, res) => {
  // console.log(req.body)
  let form = req.body
  let data = {
    code: form.code || '',
    name: form.name || '',
    price: form.price || 0,
    cost: form.cost || 0,
    stock: form.stock || 0,
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
          console.log('Document updated', docs)
          res.json(docs)
        })
    })
    .catch((err) => res.json({ message: err.message }))
})

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

export default router
