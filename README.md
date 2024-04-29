# Swagger API

1. install swagger ui

```sh
npm install swagger-jsdoc swagger-ui-express
```

2. create a file 'swaggerConfig.js'

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
  },
  apis: ['index.js'],
}
export const swaggerSpec = swaggerJsdoc(swaggerOption)
```

3. add middleware 'index.js'

```js
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './swaggerConfig.js'

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
```
