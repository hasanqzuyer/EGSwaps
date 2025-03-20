import * as fs from 'fs'
import { NextApiRequest, NextApiResponse } from 'next'
import { createRouter } from 'next-connect'

export const config = {
  api: {
    bodyParser: true,
  },
}

const router = createRouter<NextApiRequest, NextApiResponse>()

function formatString(inputString: string): string {
  const stringWithOnlyLetters = inputString.replace(/[^a-zA-Z\s]/g, '')
  const lowercaseString = stringWithOnlyLetters.toLowerCase()
  const stringWithHyphens = lowercaseString.replace(/\s+/g, '-')

  return stringWithHyphens
}

router.get(async (req: any, res) => {
  const { title } = req.query

  let currentPage = 1
  let totalPages = Infinity
  try {
    while (currentPage < totalPages) {
      const response = await fetch(
        `https://feeds.newsramp.net/tldr/category/newsramp/moderated/10/${currentPage}/crypto-blockchain.json`,
      )

      if (response.status !== 200) {
        const responseError = (await response.json()) as { message: string }
        console.log('chainanalysis response status', response.status, responseError)
        res.status(200).send([])
        return
      }

      const resp = await response.json()

      totalPages = resp.total_pages

      const article = resp.news.find((e: any) => formatString(e.headline) === title)

      if (article) {
        return res.status(200).send(article)
      }

      if (resp.current_page === resp.total_pages) {
        res.status(404).send(null)
      }

      currentPage += 1
    }
  } catch (error: any) {
    res.status(500).send([])
  }
})

export default router.handler({
  onError: (err: any, req, res) => {
    res.status(err.statusCode || 500).end(err.message)
  },
})
