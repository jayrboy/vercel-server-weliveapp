import jwt from 'jsonwebtoken'
import User from '../Models/User.js'

export const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // "Bearer <token>" split to ["Bearer", "token"]

    if (!token) {
      return res.status(401).send({ message: 'No Token' })
    }

    const decoded = jwt.verify(token, 'jwtsecret')
    req.user = decoded.user
    next()
  } catch (error) {
    res.status(400).send({ message: 'Token Invalid!' })
  }
}

export const routeAdmin = async (req, res, next) => {
  try {
    // console.log(req.user.username)
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
