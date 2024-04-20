import mongoose from 'mongoose'
import paginate from 'mongoose-paginate-v2' //สำหรับแบ่งเพจ

//* Connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('MongoDB Connected!')
  })
  .catch((e) => console.log({ message: 'Failed connection: ' + e }))

//* User Model
const userSchema = mongoose.Schema(
  {
    username: { type: String, required: true },
    password: String,
    role: { type: String, default: 'user' },
    name: String,
    email: String,
    picture: {
      type: Array,
      default: [{ data: { url: 'no-image.jpg' } }],
    },
  },
  { timestamps: true }
)
const User = mongoose.model('User', userSchema)

/* ------------------------------------- Product ------------------------------------- */
let productSchema = new mongoose.Schema({
  code: String,
  name: String,
  stock: Number,
  limit: Number,
  price: Number,
  cost: Number,
  cf: Number,
  remaining_cf: Number,
  paid: Number,
  remaining: Number,
  date_added: Date,
})
productSchema.plugin(paginate) //สำหรับแบ่งเพจ
let Product = mongoose.model('Product', productSchema)

/* ----------------------------------- Daily Stock ----------------------------------- */
let dailyStockSchema = new mongoose.Schema({
  status: String,
  chanel: String,
  products: Array,
  price_total: Number,
  date_added: Date,
})
let DailyStock = mongoose.model('DailyStock', dailyStockSchema)

//* Sale Order (Comment)
const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // รหัสไอดีลูกค้าที่แสดงความคิดเห็น
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DailyStock' }], // รหัสสินค้าที่ความคิดเห็นเกี่ยวข้อง
  address: Array,
  date_added: Date,
})
const Order = mongoose.model('Order', orderSchema)

//* Express Model
let expressSchema = new mongoose.Schema({
  exname: String,
  fprice: Number,
  sprice: Number,
  maxprice: Number,
  whenfprice: Number,
  date_start: Date,
})
let ExpressModel = mongoose.model('ExpressModel', expressSchema)

export { Product, User, DailyStock, Order, ExpressModel }
