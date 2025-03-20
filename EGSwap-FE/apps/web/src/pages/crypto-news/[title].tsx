import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import styled, { useTheme } from 'styled-components'

const ParentDiv = styled.div<{ darkMode: boolean }>`
  h1 {
    color: ${(props) => (props.darkMode ? 'white' : '#111827')};
  }
  li,
  ul,
  p,
  h2 {
    color: ${(props) => (props.darkMode ? 'white' : 'inherit')};
  }
`

const formatDate = (date: Date | string): string => {
  const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' }
  return new Date(date).toLocaleDateString('en-US', options)
}

const CryptoNews = () => {
  const theme = useTheme()
  const [article, setArticle] = useState(null)
  const router = useRouter()

  const { title } = router.query
  const fetchData = async () => {
    try {
      const newsResp = await axios.get(`/api/news/${title}`)
      setArticle(newsResp.data)
    } catch (e) {
      console.log('Error when loading news', e)
    }
  }

  useEffect(() => {
    fetchData()
    return () => {}
  }, [title])

  if (!article) {
    return <div> Article not found</div>
  }

  return (
    <div className="mx-auto sm:w-[90%] md:w-[90%] my-10 px-7 xl:px-0 w-[70%]">
      <audio controls className="mb-5 !w-[30%] sm:!w-full">
        <source src={article.audio_release} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
      <div className="my-4 gap-y-3 flex flex-col">
        <p>Curated news</p>
        <p>
          {' '}
          By:{' '}
          <a className="text-golden" target="_blank" href="https://newsramp.com">
            NewsRamp Editorial Staff
          </a>
        </p>
        <p>{formatDate(article.published)}</p>
      </div>
      <ParentDiv darkMode={theme.isDark}>
        <div className="max-w-none prose [&>h2]:font-semibold dark:[&>li]:text-zinc-200 marker:[&>ul]:text-golden dark:[&>p]:text-zinc-200 [&>p]:text-base [&>p]:leading-relaxed [&>a]:text-golden [&>a]:no-underline hover:[&>a]:underline [&>img]:rounded-lg [&>img]:my-5 dark:[&>strong]:text-zinc-200 lg:[&>img]:max-w-[800px]">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>
      </ParentDiv>
    </div>
  )
}

export default CryptoNews
