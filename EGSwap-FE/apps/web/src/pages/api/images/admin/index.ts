import * as fs from 'fs'
import { NextApiRequest, NextApiResponse } from 'next'
import { createRouter } from 'next-connect'

export const config = {
  api: {
    bodyParser: true,
  },
}

const router = createRouter<NextApiRequest, NextApiResponse>()

const ALLOWED_WALLETS = JSON.parse(process.env.ALLOWED_WALLETS || '[]').map(e => e.toLowerCase())
router.post(async (req: any, res) => {
  if (ALLOWED_WALLETS.includes(req.body?.wallet?.toLowerCase())) {
    res.status(200).json({ allowed: true })
  } else {
    res.status(200).json({ allowed: false })
  }
})

export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack)
    res.status(err.statusCode || 500).end(err.message)
  },
})
