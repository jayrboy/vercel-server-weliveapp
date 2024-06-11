import express from 'express'
import { body } from 'express-validator'
import {
  create,
  getAll,
  getById,
  update,
  remove,
  paid,
} from '../Controllers/sale-order-controller.js'
import { auth } from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'

const router = express.Router()

/*  
 http://localhost:8000/api/sale-order
 https://vercel-server-weliveapp.vercel.app/api/sale-order
*/

/**
 * @swagger
 * /api/sale-order:
 *    post:
 *      tags: [Sale Order]
 *      security:
 *        - bearerAuth: []
 *      summary: Add a new Sale Order to the stock
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/SaleOrder'
 *        required: true
 *      responses:
 *        201:
 *          description: Create
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/SaleOrder'
 *        400:
 *          description: Bad request
 *        401:
 *          description: Unauthorized
 */
router.post(
  '/sale-order',
  body('idFb').notEmpty().withMessage('ID Facebook is required'),
  create
)

/**
 * @swagger
 * /api/sale-order:
 *    get:
 *      tags: [Sale Order]
 *      security:
 *        - bearerAuth: []
 *      summary: Get All Sale Orders
 *      responses:
 *        200:
 *          description: Success
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/SaleOrder'
 *        401:
 *          description: Unauthorized
 *        404:
 *          description: Not found
 */
router.get('/sale-order', auth, getAll)

/**
 * @swagger
 * /api/sale-order/read/{id}:
 *    get:
 *      tags: [Sale Order]
 *      summary: Get Sale Order By ID
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Success
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/SaleOrder'
 *        401:
 *          description: Unauthorized
 *        404:
 *          description: Not found
 */
router.get('/sale-order/read/:id', auth, getById)

/**
 * @swagger
 * /api/sale-order:
 *    put:
 *      tags: [Sale Order]
 *      security:
 *        - bearerAuth: []
 *      summary: Update Sale Order
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/SaleOrder'
 *      responses:
 *        200:
 *          description: Success
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/SaleOrder'
 *        400:
 *          description: Bed request
 *        401:
 *          description: Unauthorized
 */
router.put('/sale-order', upload.single('picture_payment'), update)

/**
 * @swagger
 * /api/sale-order/{id}:
 *    delete:
 *      tags: [Sale Order]
 *      security:
 *        - bearerAuth: []
 *      summary: Delete Sale Order By ID
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the Sale Order to delete
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Success
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/SaleOrder'
 *        401:
 *          description: Unauthorized
 *        404:
 *          description: Not found
 */
router.delete('/sale-order/:id', remove)

/**
 * @swagger
 * /api/sale-order/complete:
 *    put:
 *      tags: [Sale Order]
 *      security:
 *        - bearerAuth: []
 *      summary: Update Status Paid of Sale Order
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/SaleOrder'
 *      responses:
 *        200:
 *          description: Success
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/SaleOrder'
 *        400:
 *          description: Bed request
 *        401:
 *          description: Unauthorized
 */
router.put('/sale-order/complete', paid)

export default router

/**
 * @swagger
 * components:
 *   schemas:
 *     SaleOrder:
 *       type: object
 *       properties:
 *         idFb:
 *           type: string
 *           example: "24610349765279316"
 *         name:
 *           type: string
 *           example: "Jay Jakkrit"
 *         email:
 *           type: string
 *           example: "example@fb.com"
 *         picture_profile:
 *           type: array
 *         orders:
 *           type: array
 *           items:
 *            $ref: '#/components/schemas/Order'
 *         picture_payment:
 *           type: array
 *         address:
 *           type: string
 *         sub_district:
 *           type: string
 *         sub_area:
 *           type: string
 *         district:
 *           type: string
 *         postcode:
 *           type: number
 *         tel:
 *           type: number
 *         complete:
 *           type: boolean
 *           example: false
 *         date_added:
 *           type: string
 *           format: date-time
 *           example: "2023-01-01T00:00:00Z"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "66238c86a0f9c66406e2e036"
 *         name:
 *           type: string
 *           example: "รองเท้าสุดเท่"
 *         quantity:
 *           type: number
 *           example: 3
 *         price:
 *           type: number
 *           example: 1000
 */
