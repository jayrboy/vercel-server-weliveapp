import express from 'express'
import {
  create,
  getAll,
  getById,
  update,
  remove,
  search,
} from '../Controllers/product-controller.js'
import { auth } from '../middleware/auth.js'

const router = express.Router()

/*  
 http://localhost:8000/api/db
 https://vercel-server-weliveapp.vercel.app/api/db 
*/

/**
 * @swagger
 * /api/product:
 *    post:
 *      tags: [Product]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                code:
 *                  type: string
 *                  default: "T1"
 *                name:
 *                  type: string
 *                  default: "รองเท้า"
 *                price:
 *                  type: number
 *                  default: 500
 *                stock_quantity:
 *                  type: number
 *                  default: 1000
 *                cost:
 *                  type: number
 *                  default: 250000
 *                limit:
 *                  type: number
 *                  default: 0
 *                remaining:
 *                  type: number
 *                  default: 1000
 *                date_added:
 *                  type: string
 *                  default: "2024-06-03"
 *      responses:
 *        201:
 *          description: Create
 *        400:
 *          description: Bad request
 *        401:
 *          description: Unauthorized
 */
router.post('/product', create)

/**
 * @swagger
 * /api/product:
 *    get:
 *      tags: [Product]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Success
 *        401:
 *          description: Unauthorized
 *        404:
 *          description: Not found
 */
router.get('/product', auth, getAll)

/**
 * @swagger
 * /api/product/read/{id}:
 *    get:
 *      tags: [Product]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the product to get
 *          type: start
 *      responses:
 *        200:
 *          description: Success
 *        401:
 *          description: Unauthorized
 *        404:
 *          description: Not found
 */
router.get('/product/read/:id', auth, getById)

/**
 * @swagger
 * /api/product:
 *    put:
 *      tags: [Product]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                _id:
 *                  type: string
 *                  default: "665cbbdbf7955570e64d7a7a"
 *                code:
 *                  type: string
 *                  default: "A2"
 *                name:
 *                  type: string
 *                  default: "ทดสอบ"
 *                price:
 *                  type: number
 *                  default: 500
 *                stock_quantity:
 *                  type: number
 *                  default: 10
 *                cost:
 *                  type: number
 *                  default: 2500
 *                limit:
 *                  type: number
 *                  default: 10
 *                cf:
 *                  type: number
 *                  default: 0
 *                paid:
 *                  type: number
 *                  default: 0
 *                remaining:
 *                  type: number
 *                  default: 0
 *                create_date:
 *                  type: string
 *                  default: "2024-06-02T19:17:33.690Z"
 *                is_delete:
 *                  type: boolean
 *                  default: false
 *      responses:
 *        200:
 *          description: Success
 *        400:
 *          description: Bed request
 *        401:
 *          description: Unauthorized
 */
router.put('/product', auth, update)

/**
 * @swagger
 * /api/product/{id}:
 *    delete:
 *      tags: [Product]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the product to delete
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Success
 *        401:
 *          description: Unauthorized
 *        404:
 *          description: Not found
 */
//TODO: สำหรับลบใน product ตอน create daily stock
router.delete('/product/:id', auth, remove)

/**
 * @swagger
 * /api/product/search:
 *    get:
 *      tags: [Product]
 *      security:
 *        - bearerAuth: []
 *      summary: Search products
 *      description: Search for products by name or detail.
 *      parameters:
 *        - in: query
 *          name: q
 *          type: string
 *          required: false
 *          default: swag
 *          description: The query string for searching products by code or name.
 *        - in: query
 *          name: page
 *          type: integer
 *          description: The page of products to return.
 *      responses:
 *        200:
 *          description: Success
 *        401:
 *          description: Unauthorized
 *        404:
 *          description: Not found
 *        500:
 *          description: Internal server error
 */
router.get('/product/search', auth, search)

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - code
 *         - name
 *         - price
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id
 *           example: "66238c86a0f9c66406e2e036"
 *         code:
 *           type: string
 *           description: Product code
 *           example: "A2"
 *         name:
 *           type: string
 *           description: Product name
 *           example: "test"
 *         price:
 *           type: number
 *           format: int32
 *           description: Product price
 *           example: 100.0
 *         cost:
 *           type: number
 *           format: int32
 *           description: Product cost
 *           example: 80.0
 *         stock_quantity:
 *           type: number
 *           format: int32
 *           description: Product stock quantity
 *           example: 50
 *         limit:
 *           type: number
 *           format: int32
 *           description: Purchase limit
 *           example: 5
 *         cf:
 *           type: number
 *           format: int32
 *           description: Custom factor
 *           example: 1.0
 *         remaining_cf:
 *           type: number
 *           format: int32
 *           description: Remaining custom factor
 *           example: 0.5
 *         paid:
 *           type: number
 *           format: int32
 *           description: Paid amount
 *           example: 50.0
 *         remaining:
 *           type: number
 *           format: int32
 *           description: Remaining amount
 *           example: 50.0
 *         date_added:
 *           type: string
 *           format: date-time
 *           description: Date when the product was added
 *           example: "2023-01-01T00:00:00Z"
 *         update_date:
 *           type: string
 *           format: date-time
 *           description: Date when the product was last updated
 *           example: "2023-01-02T00:00:00Z"
 *         is_delete:
 *           type: boolean
 *           description: Deletion status
 *           example: false
 *       example:
 *         _id: "66238c86a0f9c66406e2e036"
 *         code: "A2"
 *         name: "test"
 *         price: 100.0
 *         cost: 80.0
 *         stock_quantity: 50
 *         limit: 5
 *         cf: 1.0
 *         paid: 50.0
 *         remaining_cf: 0.5
 *         remaining: 50.0
 *         date_added: "2023-01-01T00:00:00Z"
 */

export default router
