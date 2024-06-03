# Middleware JWT token

1. Authorization:

```sh
npm install jsonwebtoken
```

```js
import jwt from 'jsonwebtoken'

//TODO: Middleware to Authenticate the Token
export const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // "Bearer <token>" split to ["Bearer", "token"]

    if (!token) {
      return res.status(401).send({ message: 'No Token' })
    }

    const decoded = jwt.verify(token, 'jwtsecret')
    req.user = decoded.user
    next()
  } catch (error) {
    res.status(500).send({ message: 'Token Invalid!' })
  }
}
```

2. Verify Token to API Endpoints

```js
import { auth } from '../Middleware/auth.js'

router.get('/product/read', auth, getAll)
```

## Testing

1. Swagger with Bearer Token

- add to options `index.js`
- add to http request

```js
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
```

2. Postman set up to Headers add

- key: Authenticate
- value: Bearer <token>
