import express from 'express'
import Order from '../Models/Order.js'

const router = express.Router()

// http://localhost:8000/api/sale-order

router.post('/sale-order', (req, res) => {
  console.log(req.body)

  // const newOrder = req.body.data;
  // Order.create(data)
  //   .then((docs) => {
  //     console.log("Document saved");
  //     res.send(true);
  //   })
  //   .catch((err) => {
  //     console.log(err.message);
  //     res.send(false);
  //   });
})

export default router
