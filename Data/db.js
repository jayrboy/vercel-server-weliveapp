import 'dotenv/config'
import mongoose from 'mongoose'

//TODO: Add Connection Strings for Default --> .connect('mongodb://localhost/mydatabase')

const connectDB = () =>
  mongoose
    .connect(process.env.MONGODB_URL, {
      connectTimeoutMS: 10000, // Timeout 10 วินาที
      socketTimeoutMS: 45000, // Timeout 45 วินาทีสำหรับการเชื่อมต่อ
    })
    .then(() => console.log('MongoDB Connected!'))
    .catch((e) => console.log({ message: 'Failed connection: ' + e }))

export default connectDB
