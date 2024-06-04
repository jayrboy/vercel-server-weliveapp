import Order from '../Models/Order.js'

export const create = (req, res) => {
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

  Order.create(data)
    .then((docs) => {
      console.log('document saved new daily stock')
      res.send(true)
    })
    .catch((err) => {
      console.log('error saving daily stock:', err)
      res.send(false)
    })
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