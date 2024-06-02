import mongoose from 'mongoose'
import paginate from 'mongoose-paginate-v2' //สำหรับแบ่งเพจ

let productSchema = new mongoose.Schema({
  code: String,
  name: String,
  price: Number,
  stock_quantity: Number,
  cost: Number,
  limit: Number,
  cf: Number,
  paid: Number,
  remaining: Number,
  create_date: Date,
  update_date: Date,
  is_delete: Boolean,
})

productSchema.plugin(paginate) //สำหรับแบ่งเพจ

let Product = mongoose.model('Product', productSchema)

export default Product
