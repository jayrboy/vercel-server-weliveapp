import mongoose from 'mongoose'

let orderSchema = new mongoose.Schema({
  customer: Array,
  orders: Array,
  picture_payment: {
    type: Array,
    default: [{ data: { url: 'no-image.jpg' } }],
  },
  address: String,
  sub_district: String, // ตำบล/แขวง
  sub_area: String, // อำเภอ/เขต
  district: String, // จังหวัด
  postcode: String,
  tel: String,
  date_added: Date,
})

let Order = mongoose.model('Order', orderSchema)

export default Order
