import express from 'express'
import { User } from '../models.js'

import { auth, adminCheck } from '../middleware/auth.js'

const router = express.Router()

// http://localhost:8000/api/users
/**
 * @swagger
 * /api/users:
 *    get:
 *      tags: [User]
 *      summary: Get all users
 *      description: Retrieve a list of all users.
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: A list of users.
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/User'
 *        401:
 *          description: Unauthorized. User must be authenticated and have admin privileges.
 *        500:
 *          description: Internal server error
 */
router.get('/users', auth, adminCheck, (req, res) => {
  User.find()
    .select('-password')
    .exec()
    .then((docs) => {
      //   console.log(docs)
      res.json(docs)
    })
})

/**
 * @swagger
 * /api/user/change-role:
 *    post:
 *      tags: [User]
 *      summary: Change user role
 *      description: Change the role of a user.
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: string
 *                    role:
 *                      type: string
 *      responses:
 *        200:
 *          description: User role changed successfully.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 *        401:
 *          description: Unauthorized. User must be authenticated and have admin privileges.
 *        500:
 *          description: Internal server error
 */
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

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the user.
 *         username:
 *           type: string
 *           description: The username of the user.
 *         email:
 *           type: string
 *           description: The email address of the user.
 *         role:
 *           type: string
 *           description: The role of the user (e.g., 'user', 'admin').
 *       required:
 *         - username
 *         - email
 *         - role
 */

export default router
