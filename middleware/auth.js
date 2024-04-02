import jwt from 'jsonwebtoken'
import { User } from '../models.js'

export const auth = async (req, res, next) => {
  try {
    const token = req.headers['authtoken']
    if (!token) {
      return res.status(401).send({ message: 'No Token' })
    }
    const decoded = jwt.verify(token, 'jwtsecret')
    req.user = decoded.user
    next()
  } catch (error) {
    res.status(500).send({ message: 'Token Invalid!' })
  }
}

export const adminCheck = async (req, res, next) => {
  try {
    console.log(req.user.username)
    const userAdmin = await User.findOne({ username: req.user.username })
      .select('-password')
      .exec()
    // console.log(userAdmin)

    if (userAdmin.role !== 'admin') {
      res.status(403).send({ message: 'Admin Access Denied!' })
    } else {
      next()
    }
  } catch (err) {
    res.status(403).send({ error: 'Admin Access Denied!', err })
  }
}
