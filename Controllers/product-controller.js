import Product from '../Models/Product.js'

export const getAll = (req, res) => {
  Product.find()
    .exec()
    .then((docs) => res.status(200).json(docs))
}

export const getById = (req, res) => {
  let id = req.params.id

  Product.findById(id)
    .exec()
    .then((doc) => res.json(doc))
    .catch((err) => res.status(404).send('Product not found'))
}

export const create = (req, res) => {
  let form = req.body
  let data = {
    code: form.code || '',
    name: form.name || '',
    price: form.price || 0,
    stock_quantity: form.stock_quantity || 0,
    cost: form.cost || 0,
    limit: form.limit || 0,
    cf: form.cf || 0,
    paid: form.paid || 0,
    remaining: form.stock || 0,
    create_date: form.date_added
      ? new Date(Date.parse(form.date_added))
      : new Date(),
    update_date: new Date(),
    is_delete: false,
  }
  // console.log(data)

  Product.create(data)
    .then((docs) => {
      console.log('Document saved')
      res.send(true)
    })
    .catch((err) => {
      console.log(err.message)
      res.send(false)
    })
}

export const update = (req, res) => {
  // console.log(req.body)
  let form = req.body
  let data = {
    code: form.code,
    name: form.name,
    price: form.price,
    stock_quantity: form.stock_quantity,
    cost: form.cost,
    limit: form.limit,
    cf: form.cf,
    paid: form.paid,
    remaining: form.stock,
    create_date: form.date_added,
    update_date: new Date(),
    is_delete: form.is_delete,
  }

  // console.log(data)
  Product.findByIdAndUpdate(form._id, data, { useFindAndModify: false })
    .exec()
    .then(() => {
      //หลังการอัปเดต ก็อ่านข้อมูลอีกครั้ง แล้วส่งไปแสดงผลที่ฝั่งโลคอลแทนข้อมูลเดิม
      Product.find()
        .exec()
        .then((docs) => {
          console.log('Document updated')
          res.json(docs)
        })
    })
    .catch((err) => res.json({ message: err.message }))
}

export const remove = (req, res) => {
  let _id = req.params.id

  Product.findByIdAndDelete(_id, { useFindAndModify: false })
    .exec()
    .then(() => {
      // เมื่อลบข้อมูลสำเร็จ ทำการค้นหาข้อมูลสินค้าทั้งหมดใหม่
      Product.find()
        .exec()
        .then((docs) => res.json(docs))
    })
    .catch((err) => res.status(500).json({ message: err }))
}

export const search = async (req, res) => {
  try {
    let q = req.query.q || ''

    // กำหนด pattern ด้วย RegExp
    let pattern = new RegExp(q, 'ig')

    // ค้นหาจากฟิลด์ name และ remaining
    let conditions = {
      $or: [{ name: { $regex: pattern } }, { code: { $regex: pattern } }],
    }

    let options = {
      page: req.query.page || 1, // เพจปัจจุบัน
      limit: 2, // แสดงผลหน้าละ 2 รายการ (ข้อมูลมีน้อย)
    }

    const result = await Product.paginate(conditions, options)
    res.send(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
