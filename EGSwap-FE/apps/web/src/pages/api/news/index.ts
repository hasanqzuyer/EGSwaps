import { NextApiRequest, NextApiResponse } from 'next'
import { createRouter } from 'next-connect'
import axios from 'axios'

export const config = {
  api: {
    bodyParser: true,
  },
}

const NEWS_URL = 'https://feeds.newsramp.net/tldr/category/newsramp/moderated/30/1/crypto-blockchain.json'
const router = createRouter<NextApiRequest, NextApiResponse>()

function formatString(inputString: string): string {
  const stringWithOnlyLetters = inputString.replace(/[^a-zA-Z\s]/g, '')
  const lowercaseString = stringWithOnlyLetters.toLowerCase()
  const stringWithHyphens = lowercaseString.replace(/\s+/g, '-')

  return stringWithHyphens
}

function getSummary(htmlContent: string): string {
  return htmlContent.split('<h2>Summary</h2>')[1].replace(/(<([^>]+)>)/gi, '')
}

function parseNews(news: any) {
  return news.map((e: any) => ({
    ...e,
    redirect: formatString(e.headline.toLowerCase()),
    summary: getSummary(e.content),
  }))
}

router.get(async (req: any, res) => {
  try {
    const response = await axios.get(NEWS_URL)

    if (response.status !== 200) {
      const responseError = response.data
      console.log('chainanalysis response status', response.status, responseError)
      res.status(200).send([])
      return
    }

    const { news } = response.data

    const newsParsed = parseNews(news)

    res.status(200).send(newsParsed)
  } catch (error: any) {
    res.status(500).send([])
  }
})

export default router.handler({
  onError: (err: any, req, res) => {
    res.status(err.statusCode || 500).end(err.message)
  },
})
