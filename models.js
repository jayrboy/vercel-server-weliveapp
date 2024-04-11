import mongoose from 'mongoose'
import paginate from 'mongoose-paginate-v2' //สำหรับแบ่งเพจ

//* Connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('MongoDB Connected!')
  })
  .catch((e) => console.log({ message: 'Failed connection: ' + e }))

//* Product Model
let productSchema = new mongoose.Schema({
  code: { type: String, lowercase: true },
  name: String,
  price: Number,
  cost: Number,
  stock: Number,
  limit: Number,
  cf: Number,
  remaining_cf: Number,
  paid: Number,
  remaining: Number,
  date_added: Date,
})
productSchema.plugin(paginate) //สำหรับแบ่งเพจ
let Product = mongoose.model('Product', productSchema)

//* Daily Stock
let dailyStockSchema = new mongoose.Schema({
  date_added: Date,
  status: { type: String, enum: ['new', 'clear'], default: 'new' },
  chanel: { type: String, default: 'facebook' },
  products: Array,
})
let DailyStock = mongoose.model('DailyStock', dailyStockSchema)

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

//* Comment Model
const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // รหัสไอดีผู้ใช้ที่แสดงความคิดเห็น
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // รหัสสินค้าที่ความคิดเห็นเกี่ยวข้อง
  content: { type: String }, // เนื้อหาความคิดเห็น
  createdAt: { type: Date, default: Date.now }, // วันที่และเวลาที่ความคิดเห็นถูกสร้าง
})
const Comment = mongoose.model('Comment', commentSchema)

export { Product, DailyStock, Comment, User, ExpressModel }
