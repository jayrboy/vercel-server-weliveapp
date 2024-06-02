import mongoose from 'mongoose'

let orderSchema = new mongoose.Schema({
  picture_payment: String,
  address: String,
  sub_district: String,
  sub_area: String,
  district: String,
  postcode: String,
  tel: String,
  date_added: Date,
})

let Order = mongoose.model('Order', orderSchema)

export default Order
