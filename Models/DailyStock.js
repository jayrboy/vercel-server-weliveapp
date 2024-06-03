import mongoose from 'mongoose'

let dailyStockSchema = new mongoose.Schema({
  status: String,
  chanel: String,
  products: [{ type: mongoose.Types.ObjectId, ref: 'Product' }],
  price_total: Number,
  date_added: Date,
})
let DailyStock = mongoose.model('DailyStock', dailyStockSchema)

export default DailyStock
