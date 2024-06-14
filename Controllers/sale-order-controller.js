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
  // Order.find({ complete: false }) // กรองข้อมูลเฉพาะที่ complete เป็น false
  Order.find({}) // กรองข้อมูลเฉพาะที่ complete เป็น false
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

export const update = async (req, res) => {
  try {
    let form = req.body

    if (req.file) {
      form.picture_payment = req.file.filename
    }

    // console.log(form) // ตรวจสอบข้อมูลที่ได้รับจาก form-data

    // อัปเดตข้อมูล products ภายใน Order
    let updatedOrder = await Order.findByIdAndUpdate(form._id, form, {
      useFindAndModify: false,
    })

    console.log('Document updated sale order')
    res.json(updatedOrder)
  } catch (err) {
    console.error('Error updating order: ', err)
    res.status(400).json({ error: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล Order' })
  }
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

export const paid = async (req, res) => {
  try {
    let form = req.body
    // console.log(form) // ตรวจสอบข้อมูลที่ได้รับจาก form-data

    // อัปเดตข้อมูล products ภายใน Order
    Order.findByIdAndUpdate(
      form._id,
      { complete: form.complete },
      {
        useFindAndModify: false,
      }
    )
      .exec()
      .then(() => {
        //หลังการอัปเดต ก็อ่านข้อมูลอีกครั้ง แล้วส่งไปแสดงผลที่ฝั่งโลคอลแทนข้อมูลเดิม
        Order.findById(form._id)
          .exec()
          .then((docs) => {
            console.log(`Order: ${docs.name} has been completed.`)
            res.json(docs)
          })
      })
  } catch (err) {
    console.error('Error updating order: ', err.message)
    res.status(400).json({ error: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล Order' })
  }
}
