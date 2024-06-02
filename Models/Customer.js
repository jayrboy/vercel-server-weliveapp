import mongoose from 'mongoose'

let customerSchema = new mongoose.Schema({
  idFb: Number,
  name: String,
  email: String,
  picture: String,
})

let Customer = mongoose.model('Customer', customerSchema)

export default Customer
