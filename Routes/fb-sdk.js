import express from 'express'
import {
  getAppAccessToken,
  debugToken,
  getPagesBasedOnToken,
} from '../services/fb.js'

// http://localhost:8000/api/fb-sdk

const router = express.Router()

/**
 * @swagger
 * /api/fb-sdk:
 *   get:
 *     tags: [Facebook SDK]
 *     summary: Facebook Graph API
 *     parameters:
 *       - in: query
 *         name: token
 *         type: string
 *         required: true
 *         default: EAAGAtKWXZCNsBO2Uh4xNdZBapFDKpbVvygaujozMw7qBuzukg4c56LzEANaQhZBIRU6KTWShdLPjzqzgbruVf3FZBrV5tqSxSzBD540U1DDZBPMdxU0ZBlEj8L1CIB5IZAhMfJZAhjGbCv690L7XdQ7A9ZCDKUYAAitLR4q3HmNZCOgJDvvgCAXqZAfAArZAORVNtSSwqAaUvI92JFWN9zAO9oAPvPte5c8ZD
 *         description: The access token to debug and get pages
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 scopes:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "public_profile,pages_read_engagement,pages_manage_posts"
 *                 accessToken:
 *                   type: string
 *                   example: "EAAGAtKWXZCNsBO8iIiKAmTq3TtwyfzZBNWvMOxs7wLDfywmUNCAh3HjRMH5T9ZCI9ZBLAO8Dfbv8cdgL1bFg79ex4ndU7MwI9wUlkFlrLmxF1ZAxXunZCb1Tq9atd6fdahu6fVZBE1TNEPfDiEo2RW0cSLoHRu5zZCuKo3mxVpsiD1KrxYhkOVQLNcMvFg8McZBvqNXZA4aMZAQzLWXvnE7DrShkyIaxZASCWYvhFgZDZD"
 */
router.get('/fb-sdk', async (req, res) => {
  const appAccessToken = await getAppAccessToken()

  const scopes = await debugToken(appAccessToken, req.query.token)

  const pages = await getPagesBasedOnToken(req.query.token)

  console.log(scopes)

  res.json({ scopes, accessToken: pages?.[0].access_token })
})

export default router

/**
 * @swagger
 * components:
 *   schemas:
 *     FacebookSDK:
 *       type: string
 *       properties:
 *         token:
 *           type: string
 *           description: user access token
 *           example: "EAAGAtKWXZCNsBO2Uh4xNdZBapFDKpbVvygaujozMw7qBuzukg4c56LzEANaQhZBIRU6KTWShdLPjzqzgbruVf3FZBrV5tqSxSzBD540U1DDZBPMdxU0ZBlEj8L1CIB5IZAhMfJZAhjGbCv690L7XdQ7A9ZCDKUYAAitLR4q3HmNZCOgJDvvgCAXqZAfAArZAORVNtSSwqAaUvI92JFWN9zAO9oAPvPte5c8ZD"
 */
