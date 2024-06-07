import { validationResult } from 'express-validator'
import Order from '../Models/Order.js'
import Customer from '../Models/Customer.js'

export const create = async (req, res) => {
  // console.log(req.body)
  try {
    // ฟังก์ชัน validationResult จะดึงข้อมูลผลการตรวจสอบ (validation) จาก request
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      // ใน errors: [] ว่างเปล่า แสดงว่ามีข้อผิดพลาดในการตรวจสอบข้อมูล
      return res.status(400).json({ errors: errors.array() })
    }

    let existingCustomer = await Customer.findOne({ idFb: req.body.idFb })
    if (!existingCustomer) {
      // ตรวจสอบว่าลูกค้า ถ้าไม่มีอยู่ ก็เพิ่มเข้า DB
      let customer = {
        idFb: req.body.idFb || '',
        name: req.body.name || '',
        email: req.body.email || '',
        picture_profile: req.body.picture_profile || [],
      }
      Customer.create(customer)
      console.log('New customer created')
    }

    let form = req.body
    let data = {
      idFb: form.idFb || '',
      name: form.name || '',
      email: form.email || '',
      picture_profile: form.picture_profile || [],
      orders: form.orders || [],
      picture_payment: form.picture_payment || '',
      address: form.address || '',
      sub_district: form.sub_district || '',
      sub_area: form.sub_area || '',
      district: form.district || '',
      postcode: form.postcode || 0,
      tel: form.tel || 0,
      complete: form.complete || false,
      date_added: form.date_added
        ? new Date(Date.parse(form.date_added))
        : new Date(),
    }

    let existingOrder = await Order.findOne({ idFb: data.idFb })
    // res.send(existingOrder)
    // Orders นี้มีอยู่แล้ว ก็เพิ่มแค่ order ถ้าไม่มี ถึงจะสร้างใหม่
    if (existingOrder) {
      await Order.findOneAndUpdate(
        { idFb: existingOrder.idFb },
        { $push: { orders: existingOrder.orders[0] } },
        { useFindAndModify: false }
      )

      // ดึง order เก่าที่อัปเดตแล้ว
      existingOrder = await Order.findById(existingOrder._id)
      res.status(200).send(existingOrder)
    } else {
      const newOrder = await Order.create(data)
      console.log('Document saved new sale order')
      res.status(200).send(newOrder)
    }
  } catch (error) {
    console.error('Error processing request: ', error)
    res
      .status(500)
      .send({ message: 'Internal Server Error', error: error.message })
  }
}

export const getAll = (req, res) => {
  Order.find()
    .sort({ date_added: -1 }) // เรียงข้อมูลตามวันที่เพิ่มข้อมูลล่าสุดก่อน
    .exec()
    .then((docs) => res.json(docs))
    .catch((err) => {
      console.error('Error reading sale orders:', err)
      res.status(500).send(false)
    })
}

export const getById = (req, res) => {
  let id = req.params.id
  Order.findById(id)
    .exec()
    .then((docs) => res.json(docs))
}

export const update = (req, res) => {
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

  // อัปเดตข้อมูล products ภายใน Order
  Order.findOneAndUpdate(
    {
      _id: idDaily, // เงื่อนไขการค้นหาเอกสาร Order ด้วย _id
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
      res.json({ error: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล Order' })
    })
}

export const remove = (req, res) => {
  let _id = req.body._id

  Order.findOneAndDelete(_id, { useFindAndModify: false })
    .exec()
    .then(() => {
      Order.find()
        .exec()
        .then((docs) => res.json(docs))
    })
    .catch((err) => res.json({ message: err.message }))
}
export const paid = (req, res) => {}
