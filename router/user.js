import express from 'express'
import { User } from '../models.js'

import { auth, adminCheck } from '../middleware/auth.js'

const router = express.Router()

// http://localhost:8000/api/users
router.get('/users', auth, adminCheck, (req, res) => {
  User.find()
    .select('-password')
    .exec()
    .then((docs) => {
      //   console.log(docs)
      res.json(docs)
    })
})

router.post('/user/change-role', auth, adminCheck, async (req, res) => {
  // console.log(req.body)
  const newRole = req.body.data
  await User.findByIdAndUpdate(newRole.id, newRole, { new: true })
    .select('-password')
    .exec()
    .then((docs) => {
      // console.log(docs)
      res.json(docs)
    })
    .catch((err) => console.log(err))
})

export default router
