import Order from '../Models/Order.js'
import Customer from '../Models/Customer.js'

export const create = async (req, res) => {
  // console.log(req.body)

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
    postcode: form.postcode || '',
    tel: form.tel || '',
    complete: form.complete || false,
    date_added: form.date_added
      ? new Date(Date.parse(form.date_added))
      : new Date(),
  }
  let customer = {
    idFb: data.idFb || '',
    name: data.name || '',
    email: data.email || '',
    picture_profile: data.picture_profile || [],
  }

  // ตรวจสอบว่าลูกค้ามีอยู่หรือไม่
  let existingCustomer = await Customer.findOne({ idFb: customer.idFb })
  if (!existingCustomer) {
    existingCustomer = await Customer.create(customer)
    console.log('New customer created:', existingCustomer)
  }

  // ตรวจสอบว่ามี Order ที่มี idFb ของลูกค้าตรงกับค่าที่รับเข้ามาหรือไม่
  let existingOrder = await Order.findOne({ idFb: customer.idFb })
  if (existingOrder) {
    console.log('Order already exists:', existingOrder)
    // มี Order นี้มีอยู่แล้ว ก็เพิ่มแค่ order
    await Order.updateOne(
      { 'customer.idFb': existingCustomer.idFb },
      { $push: { orders: data.orders } }
    )
  } else {
    Order.create(data)
      .then((docs) => {
        console.log('document saved new sale order')
        res.status(200).send(true)
      })
      .catch((error) => {
        console.error('Error creating order:', error)
        res.status(400).send(false)
      })
  }
  res
    .status(200)
    .send(
      '1.ตรวจสอบลูกค้าเก่า ถ้ามีก็ไม่ต้องสร้างใหม่\n2.ตรวจสอบว่ามี Order ที่มี idFb ถ้ามี idFb ตรงก็ push เข้า order\n3.ถ้าไม่มี idFb ใน orders ก็สร้าง Sale Order\nสรุปตอนนี้ข้อมูลไม่ถูกสร้างใหม่ เนื่องจาก postman มีข้อมูลลูกค้าเก่า และมี idFb ตรงกับ order'
    )
}

export const getAll = (req, res) => {
  Order.find()
    .sort({ date_added: -1 }) // เรียงข้อมูลตามวันที่เพิ่มข้อมูลล่าสุดก่อน
    .populate('products')
    .exec()
    .then((docs) => res.json(docs))
    .catch((err) => {
      console.error('Error reading daily stocks:', err)
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
  const productId = req.params.id
  // console.log(productId)

  Order.updateOne({}, { $pull: { products: { _id: productId } } })
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
}
export const paid = (req, res) => {}
