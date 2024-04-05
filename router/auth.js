import express from 'express'
import bcrypt from 'bcryptjs'
import { User } from '../models.js'
import jwt from 'jsonwebtoken'

import { auth, adminCheck } from '../middleware/auth.js'

const router = express.Router()

// http://localhost:8000/api/register
router.post('/register', async (req, res) => {
  try {
    let { username, password } = req.body
    let userData = await User.findOne({ username })
    if (userData) {
      return res.send('User Already Exists!').status(400)
    } else {
      // encrypt
      const salt = await bcrypt.genSalt(10)
      password = await bcrypt.hash(password, salt)
      userData = new User({
        username,
        password,
      })
      await userData.save()
      res.send('Register Successfully')
    }
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
})

router.get('/cookie/get', (req, res) => {
  let u = req.cookies['username'] || ''
  let p = req.cookies['password'] || ''
  let s = req.cookies['save'] ? true : false
  res.json({ username: u, password: p, save: s })
})

router.post('/login', async (req, res) => {
  try {
    let username = req.body.username || ''
    let password = req.body.password || ''

    // // Check if the user exists
    let user = await User.findOne({ username })

    if (!user) {
      return res.status(400).send('User Not Found!!!')
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).send('Password Invalid!!!')
    }

    // Generate token
    const payload = {
      user: {
        username: user.username,
        name: user.name,
        email: user.email,
        picture: user.picture,
        role: user.role,
      },
    }

    jwt.sign(payload, 'jwtsecret', { expiresIn: '1d' }, (error, token) => {
      if (error) throw error
      if (req.body.save) {
        let age = 60 * 60 * 1000 * 24 * 30 // 30 day
        res.cookie('username', username, { maxAge: age })
        res.cookie('password', password, { maxAge: age })
        let save = req.body.save
        res.cookie('save', save, { maxAge: age })
        console.log('Saved to Cookies')

        // ถ้าไม่ได้เลือกบันทึกข้อมูล แต่อาจมีข้อมูลเดิมเก็บเอาไว้
        // ดังนั้น เราอาจลบข้อมูลเหล่านั้นออกไป (ถึงไม่มีก็ไม่เกิด Error)
      } else {
        res.clearCookie('username')
        res.clearCookie('password')
        res.clearCookie('save')
        console.log('Not stored in cookies')
      }
      res.json({ token, payload })
    })
  } catch (error) {
    console.log({ message: error })
    res.status(500).send('Internal Server Error')
  }
})

//TODO: Development
router.post('/login-facebook', async (req, res) => {
  try {
    const { userID, name, email, picture } = req.body
    let userData = {
      username: userID,
      name: name,
      email: email,
      picture: picture,
    }

    let user = await User.findOneAndUpdate({ username: userID }, { new: true })
    if (user) {
      console.log('User updated')
    } else {
      console.log('User saved:')
      user = new User(userData)
      await user.save()
    }

    let payload = {
      user,
    }

    // generate toke
    jwt.sign(payload, 'jwtsecret', { expiresIn: '1d' }, (err, token) => {
      if (err) throw err
      res.json({ token, payload })
    })
  } catch (err) {
    console.log(err)
    res.json({ token, payload })
  }
})

router.post('/current-user', auth, (req, res) => {
  console.log('currentUser', req.user)
  User.findOne({ username: req.user.username })
    .select('-password')
    .exec()
    .then((docs) => res.send(docs))
    .catch((err) => {
      console.log({ message: err })
      res.status(500).send('Server Error')
    })
})

router.post('/current-admin', auth, adminCheck, (req, res) => {
  // console.log('currentAdmin', req.user)
  User.findOne({ username: req.user.username })
    .select('-password')
    .exec()
    .then((docs) => res.send(docs))
    .catch((err) => {
      console.log({ message: err })
      res.status(500).send('Server Error')
    })
})

export default router
