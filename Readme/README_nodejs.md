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
  "name": "server",
  "description": "Web API with express and swagger documentation",
  "main": "app.js",
  "type": "module",
  "scripts": {
    "start": "nodemon app.js"
  },
  "author": "Jay Jakkrit",
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

# Deployment

https://nodejs.org/en/learn/getting-started/nodejs-the-difference-between-development-and-production

1. settings file hosting to vercel.json

2. deploy to web vercel run `NODE_ENV=production node app.js`
