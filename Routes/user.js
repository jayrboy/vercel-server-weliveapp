import express from 'express'
import { getAll, updateRole } from '../Controllers/user-controller.js'
import { auth, adminCheck } from '../middleware/auth.js'

const router = express.Router()

// http://localhost:8000/api/users

router.get('/users', auth, adminCheck, getAll)

router.post('/user/change-role', auth, adminCheck, updateRole)

export default router
