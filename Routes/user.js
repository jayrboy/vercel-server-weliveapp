import express from 'express'
import { getAll, updateRole } from '../Controllers/user-controller.js'
import { auth, routeAdmin } from '../middleware/auth.js'

const router = express.Router()

// http://localhost:8000/api/users

router.get('/users', auth, routeAdmin, getAll)

router.post('/user/change-role', auth, routeAdmin, updateRole)

export default router
