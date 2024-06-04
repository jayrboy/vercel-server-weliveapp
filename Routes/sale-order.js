import express from 'express'
import {
  create,
  getAll,
  getById,
  update,
  remove,
  paid,
} from '../Controllers/sale-order-controller.js'

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
 *              $ref: '#/components/schemas/Order'
 *        required: true
 *      responses:
 *        201:
 *          description: Create
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Order'
 *        400:
 *          description: Bad request
 *        401:
 *          description: Unauthorized
 */
router.post('/sale-order', create)

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
 *                  $ref: '#/components/schemas/Order'
 *        401:
 *          description: Unauthorized
 *        404:
 *          description: Not found
 */
router.get('/sale-order', getAll)

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
 *                $ref: '#/components/schemas/Order'
 *        401:
 *          description: Unauthorized
 *        404:
 *          description: Not found
 */
router.get('/sale-order/read/:id', getById)

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
 *              $ref: '#/components/schemas/Order'
 *      responses:
 *        200:
 *          description: Success
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Order'
 *        400:
 *          description: Bed request
 *        401:
 *          description: Unauthorized
 */
router.put('/sale-order', update)

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
 *                $ref: '#/components/schemas/Order'
 *        401:
 *          description: Unauthorized
 *        404:
 *          description: Not found
 */
router.delete('/sale-order/delete/:id', remove)

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
 *              $ref: '#/components/schemas/Order'
 *      responses:
 *        200:
 *          description: Success
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Order'
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
 *     Order:
 *       type: object
 *       required:
 *         - picture_payment
 *         - address
 *         - sub_district
 *         - sub_area
 *         - district
 *         - postcode
 *         - tel
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id
 *           example: "66238c86a0f9c66406e2e036"
 *         customer:
 *           type: array
 *           items:
 *            $ref: '#/components/schemas/Customer'
 *         orders:
 *           type: array
 *           items:
 *            $ref: '#/components/schemas/Product'
 *         picture_payment:
 *           type: array
 *           example: []
 *         address:
 *           type: string
 *           example: "66/9 ถนน 345 ซ.1/2"
 *         sub_district:
 *           type: string
 *           example: "ทุ่งนา"
 *         sub_area:
 *           type: string
 *           example: "คนคู"
 *         district:
 *           type: string
 *           example: "กรุงใด"
 *         postcode:
 *           type: number
 *           example: 36000
 *         tel:
 *           type: number
 *           example: 6604554112
 *         date_added:
 *           type: string
 *           format: date-time
 *           example: "2023-01-01T00:00:00Z"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       properties:
 *         idFb:
 *           type: string
 *           example: "66238c86a0f9_06e2e03612"
 *         name:
 *           type: string
 *           example: "Customer FB"
 *         email:
 *           type: string
 *           example: "example@test.com"
 *         picture:
 *           type: array
 *         date_added:
 *           type: string
 *           format: date-time
 *           example: "2023-01-01T00:00:00Z"
 */
