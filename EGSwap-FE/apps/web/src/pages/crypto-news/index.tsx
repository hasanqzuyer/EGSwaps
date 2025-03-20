import { useEffect, useState } from 'react'
import axios from 'axios'

const formatDate = (date: Date | string): string => {
  const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' }
  return new Date(date).toLocaleDateString('en-US', options)
}

const AdNewsworthy: React.FC<{}> = () => (
  <div className="bg-[#eab308] p-5 prose prose-h2:mt-0 prose-h2:mb-2 prose-h2:text-4xl prose-h2:text-zinc-950 prose-a:bg-blue-900 hover:prose-a:golden/80 prose-a:text-zinc-100 prose-a:text-2xl prose-a:no-underline prose-p:mt-0 prose-p:text-zinc-950 prose-p:text-xl prose-img:mt-0 rounded-lg prose-img:mb-5">
    <img src="https://cdn1.newsworthy.ai/logo-dark.svg" alt="NewsRamp" className="w-[275px] h-auto" />
    <div className="flex flex-col justify-between">
      <h2>Create a Press Release with EGSwap,</h2>
      <p>...See your news here and on hundreds of other websites and news platforms, including Google News.</p>
      <p>
        Newsworthy.ai is the Internet's only News Marketing platform, and the first news platform to deploy AI and Web3
        technology stacks for news visibility and integrity.
      </p>
      <a
        className="flex items-center justify-center gap-3 rounded py-3"
        target="_blank"
        href="https://app.newsworthy.ai/auth/coregister/pr/egswap"
      >
        Submit Your News
      </a>
    </div>
  </div>
)

const Newsworthy: React.FC<{ newsObj: any }> = ({ newsObj }) => (
  <div className="bg-zinc-900 rounded-lg prose prose-h2:mt-0 prose-h2:text-xl prose-a:text-zinc-200 prose-a:no-underline hover:prose-a:text-golden prose-a:mb-0 prose-p:text-zinc-200 prose-p:line-clamp-3 prose-img:my-0 flex flex-col">
    <a href={`/crypto-news/${newsObj.redirect}`}>
      <img src={newsObj.enclosure} alt="" className="w-full h-[188px] object-cover rounded-t-lg mx-auto bg-zinc-800" />
    </a>
    <div className="px-5 py-4 flex flex-col justify-between flex-1">
      <div>
        <h2>
          <a href={`/crypto-news/${newsObj.redirect}`}>{newsObj.headline}</a>
        </h2>
        <p>{newsObj.summary}</p>
      </div>
      <div className="flex justify-between items-center">
        <p>{formatDate(newsObj.published)}</p>
        <a className="flex items-center gap-3" href={`/crypto-news/${newsObj.redirect}`}>
          Read the News
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-arrow-right-circle"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 12h8"></path>
            <path d="m12 16 4-4-4-4"></path>
          </svg>
        </a>
      </div>
    </div>
  </div>
)

const CryptoNews = () => {
  const [news, setNews] = useState([])

  const getNewsObj = (newsObj: any) => {
    if (newsObj.ad) {
      return <AdNewsworthy />
    }
    return <Newsworthy newsObj={newsObj} />
  }

  const fetchData = async () => {
    try {
      const newsResp = await axios.get<any[]>('/api/news')
      newsResp.data.unshift({ ad: true })
      const middleIndex = Math.floor(newsResp.data.length / 2)
      newsResp.data.splice(middleIndex + 2, 0, { ad: true })

      newsResp.data.push({ ad: true })
      setNews(newsResp.data || [])
    } catch (e) {
      console.log('Error when loading news', e)
    }
  }

  useEffect(() => {
    fetchData()
    return () => {}
  }, [])

  return (
    <div className="bg-zinc-100 dark:bg-zinc-950 dark:text-zinc-100 selection:bg-golden/90 selection:text-zinc-950">
      <div className="text-center bg-zinc-900 py-20 text-white text-[48px]">
        <h1 className="text-3xl lg:text-4xl font-bold uppercase tracking-widest text-zinc-100">CRYPTO NEWS</h1>
      </div>
      <div className="my-10 px-7 mx-auto w-full xl:max-w-screen-xl grid grid-cols-3 md:grid-cols-1 lg:grid-cols-1 gap-5">
        {news.map((newsObj) => getNewsObj(newsObj))}
      </div>
    </div>
  )
}

export default CryptoNews
