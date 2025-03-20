import { useEffect, useState } from 'react'

const getIsMobile = () => window.innerWidth <= 720

const getIsResponsive = () => window.innerWidth <= 980

export default function useIsMobile() {
  const [isMobile, setIsMobile] = useState(getIsMobile())
  const [isResponsive, setIsResponsive] = useState(getIsResponsive())

  useEffect(() => {
    const onResize = () => {
      setIsMobile(getIsMobile())
      setIsResponsive(getIsResponsive())
    }

    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return { isMobile, isResponsive }
}
