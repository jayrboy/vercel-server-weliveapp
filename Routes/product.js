import express from 'express'
import {
  create,
  getAll,
  getById,
  update,
  remove,
  search,
} from '../Controllers/product-controller.js'

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
 *                  default: "2023-01-01T00:00:00Z"
 *                update_date:
 *                  type: string
 *                  default: "2023-01-01T00:00:00Z"
 *                is_delete:
 *                  type: boolean
 *                  default: false
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
router.post('/product', create)

/**
 * @swagger
 * /api/product:
 *    get:
 *      tags: [Product]
 *      responses:
 *        200:
 *          description: Success
 */
router.get('/product', getAll)

/**
 * @swagger
 * /api/product/{id}:
 *    get:
 *      tags: [Product]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the product to get
 *          type: integer
 *      responses:
 *        200:
 *          description: Success
 *        404:
 *          description: Product not found
 */
// router.get('/product/:id', getById)

/**
 * @swagger
 * /api/product:
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
router.put('/product', update)

/**
 * @swagger
 * /api/product/{id}:
 *    delete:
 *      tags: [Product]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the product to delete
 *          schema:
 *            type: string
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
router.delete('/product/:id', remove)

/**
 * @swagger
 * /api/product/search:
 *    get:
 *      tags: [Product]
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
 *          description: A list of products that match the search criteria.
 *        500:
 *          description: Internal server error
 */
router.get('/product/search', search)

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
 *         remaining_cf: 0.5
 *         paid: 50.0
 *         remaining: 50.0
 *         date_added: "2023-01-01T00:00:00Z"
 *         update_date: "2023-01-02T00:00:00Z"
 *         is_delete: false
 */

export default router
