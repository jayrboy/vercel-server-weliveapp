import express from 'express'
import { getAll, updateRole } from '../Controllers/user-controller.js'
import { auth, authAdmin } from '../Middleware/auth.js'

const router = express.Router()

// http://localhost:8000/api/users

router.get('/users', auth, authAdmin, getAll)

router.post('/user/change-role', auth, authAdmin, updateRole)

export default router
