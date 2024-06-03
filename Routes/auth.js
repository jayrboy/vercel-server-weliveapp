import express from 'express'
import {
  register,
  login,
  loginFB,
  getCookies,
  checkUser,
  checkAdmin,
} from '../Controllers/auth-controller.js'
import { auth, adminCheck } from '../middleware/auth.js'

const router = express.Router()

// http://localhost:8000/api/register
router.post('/register', register)

router.get('/cookie/get', getCookies)

router.post('/login', login)

//TODO: Development
router.post('/login-facebook', loginFB)

router.post('/current-user', auth, checkUser)

router.post('/current-admin', auth, adminCheck, checkAdmin)

export default router
