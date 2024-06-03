import express from 'express'
import {
  create,
  getAll,
  getById,
  update,
  remove,
  search,
} from '../Controllers/product-controller.js'
import { auth } from '../Middleware/auth.js'

/*  
 http://localhost:8000/api/db
 https://vercel-server-weliveapp.vercel.app/api/db 
*/

const router = express.Router()

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
 *         price:
 *           type: integer
 *           format: int32
 *           description: Product price
 *           example: 100.0
 *         cost:
 *           type: integer
 *           format: int32
 *           description: Product cost
 *           example: 80.0
 *         stock_quantity:
 *           type: integer
 *           format: int32
 *           description: Product stock quantity
 *           example: 50
 *         limit:
 *           type: integer
 *           format: int32
 *           description: Purchase limit
 *           example: 5
 *         cf:
 *           type: integer
 *           format: int32
 *           description: Custom factor
 *           example: 1.0
 *         remaining_cf:
 *           type: integer
 *           format: int32
 *           description: Remaining custom factor
 *           example: 0.5
 *         paid:
 *           type: integer
 *           format: int32
 *           description: Paid amount
 *           example: 50.0
 *         remaining:
 *           type: integer
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
 *         remaining_cf: 0.5
 *         paid: 50.0
 *         remaining: 50.0
 *         date_added: "2023-01-01T00:00:00Z"
 *         update_date: "2023-01-02T00:00:00Z"
 *         is_delete: false
 */

/**
 * @swagger
 * /api/product/create:
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
 *                  default: "A2"
 *                name:
 *                  type: string
 *                  default: "สินค้าทดสอบ"
 *                price:
 *                  type: number
 *                  default: 700
 *                stock_quantity:
 *                  type: number
 *                  default: 10
 *                cost:
 *                  type: number
 *                  default: 5000
 *                limit:
 *                  type: number
 *                  default: 0
 *                create_date:
 *                  type: string
 *                  default: "2023-01-01T00:00:00Z"
 *                update_date:
 *      responses:
 *        200:
 *          description: Document saved
 *          content:
 *            application/json:
 *              schema:
 *                type: boolean
 *        500:
 *          description: Internal server error
 */
router.post('/product/create', create)

/**
 * @swagger
 * /api/product/read:
 *    get:
 *      tags: [Product]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Success
 *        401:
 *          description: Unauthorized
 */
router.get('/product/read', auth, getAll)

/**
 * @swagger
 * /api/product/read/{id}:
 *    get:
 *      tags: [Product]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Success
 *        404:
 *          description: Product not found
 */
router.get('/product/read/:id', getById)

/**
 * @swagger
 * /api/product/update:
 *    put:
 *      tags: [Product]
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
 *          description: Document updated
 *        500:
 *          description: Internal server error
 */
router.put('/product/update', update)

/**
 * @swagger
 * /api/product/delete/{id}:
 *    delete:
 *      tags: [Product]
 *      parameters:
 *        - in: path
 *          type: string
 *          name: _id
 *          required: true
 *      responses:
 *        200:
 *          description: Document deleted
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Product'
 *        500:
 *          description: Internal server error
 */
//TODO: สำหรับลบใน product ตอน create daily stock
router.delete('/product/delete/:id', remove)

/**
 * @swagger
 * /api/product/search:
 *    get:
 *      tags: [Product]
 *      summary: Search products
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: query
 *          name: q
 *          type: string
 *          default: swag
 *        - in: query
 *          name: page
 *          type: string
 *      responses:
 *        200:
 *          description: Success
 *        500:
 *          description: Internal server error
 */
router.get('/product/search', search)

export default router
