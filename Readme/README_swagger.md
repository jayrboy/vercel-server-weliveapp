# (1) Swagger API

https://swagger.io/docs/specification/basic-structure/
https://swagger.io/docs/specification/data-models/data-types/
https://swagger.io/docs/specification/adding-examples/
https://swagger.io/docs/specification/authentication/bearer-authentication/

1. install swagger ui

```sh
npm install swagger-jsdoc swagger-ui-express
```

2. create a file 'swaggerConfig.js' or add to 'index.js'

```js
import swaggerJsdoc from 'swagger-jsdoc'

const swaggerOption = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'A simple API documentation',
    },
    servers: [
      {
        url: 'http://localhost:8000',
      },
    ],
    // Add Authorization with Bearer <token>
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['index.js'],
}
export const swaggerSpec = swaggerJsdoc(swaggerOption)
```

3. add middleware 'index.js'

```js
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './swaggerConfig.js'

// app.use(cors())

if (process.env.NODE_ENV != 'production') {
  app.get('/', (req, res) => res.redirect('api-docs'))
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}
```

## (1.1) Add Swagger to HTTP request

1. Example: POST /api/create

```js
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
 *                name:
 *                  type: String
 *                price:
 *                  type: Number
 *                date_added:
 *                  type: Date
 *      responses:
 *        200:
 *          description: Success
 *        400:
 *          description: Bad request
 *        401:
 *          description: Unauthorized
 *        500:
 *          description: Internal server error
 */
```

2. Example: GET /api/read

```js
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
 *        500:
 *          description: Internal server error
 */
```

3. Example: GET /api/read/{id}

```js
/**
 * @swagger
 * /api/product/{id}:
 *    get:
 *      tags: [Product]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the product to get
 *          schema:
 *            type: String
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
```

4. Example: PUT /api/update

```js
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
 *                _id:
 *                  type: string
 *                code:
 *                  type: string
 *                name:
 *                  type: string
 *                price:
 *                  type: number
 *                cost:
 *                  type: number
 *                stock:
 *                  type: number
 *                limit:
 *                  type: number
 *                date_added:
 *                  type: string
 *      responses:
 *        200:
 *          description: Document updated
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Product'
 *        400:
 *          description: Bad request
 *        401:
 *          description: Unauthorized
 *        500:
 *          description: Internal server error
 */
```

5. Example: DELETE /api/delete/{id}

```js
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
 *          description: Not found
 *        404:
 *          description: Not found
 *        500:
 *          description: Internal server error
 */
```

### (1.1.1) Add Swagger to Components

```js
/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: String
 *           description: Auto-generated ID.
 *         name:
 *           type: String
 *         price:
 *           type: Number
 *           format: Number
 *         date_added:
 *           type: Date
 *           format: Date
 *       example:
 *         _id: "66238c86a0f9c66406e2e036"
 *         name: "test"
 *         price: 100.0
 *         date_added: "2023-01-01T00:00:00Z"
 */
```
