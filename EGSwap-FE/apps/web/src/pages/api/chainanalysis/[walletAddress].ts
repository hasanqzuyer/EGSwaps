import * as fs from 'fs'
import { NextApiRequest, NextApiResponse } from 'next'
import { createRouter } from 'next-connect'

export const config = {
  api: {
    bodyParser: true,
  },
}

const CHAINALYSIS_URL = 'https://public.chainalysis.com/api/v1/address'
const router = createRouter<NextApiRequest, NextApiResponse>()

router.get(async (req: any, res) => {
  const { walletAddress } = req.query
  try {
    const response = await fetch(`${CHAINALYSIS_URL}/${walletAddress}`, {
      headers: {
        'X-API-Key': '4e7342fcd70254430b0929297ad0ca6243acca06ea6463e96430b56b153303c6',
        Accept: 'application/text',
      },
    })

    if (response.status !== 200) {
      const responseError = (await response.json()) as { message: string }
      console.log('chainanalysis response status', response.status, responseError)
      res.status(200).send({ isSanctioned: false, error: responseError?.message })
      return
    }

    const allowed = (await response.json()) as { identifications: any[] }

    res.status(200).send({ isSanctioned: allowed?.identifications?.length > 0 })
  } catch (error: any) {
    res.status(500).send({ isSanctioned: false, error: error?.message || error?.toString() })
  }
})

export default router.handler({
  onError: (err: any, req, res) => {
    res.status(err.statusCode || 500).end(err.message)
  },
})
