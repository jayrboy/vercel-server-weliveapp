# Express.JS with ES Module

https://www.npmjs.com/package/express

```sh
# create a folder for web server
npm init
touch app.js
npm install express
```

default: run app `node app.js` or `node --watch app.js`

if setting to package.json: run scripts start to `npm start`

```json
{
  "main": "index.js",
  "engines": {
    "node": "20.x"
  },
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "start:prod": "NODE_ENV=production node index.js"
  }
}
```

# Deployment

```js
if (process.env.NODE_ENV != 'production') {
  app.use(morgan('dev'))
  app.get('/', (req, res) => res.redirect('api-docs'))
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swagger))
}
```

https://nodejs.org/en/learn/getting-started/nodejs-the-difference-between-development-and-production

1. settings file hosting to vercel.json

2. config `NODE_ENV": "production`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```
