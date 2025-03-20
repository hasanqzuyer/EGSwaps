import { useContext, useCallback, useMemo, useEffect } from 'react'
import Cookie from 'js-cookie'
import { ThemeContext as StyledThemeContext } from 'styled-components'
import { useTheme as useNextTheme } from 'next-themes'
import { useRouter } from 'next/router'

export const COOKIE_THEME_KEY = 'egswap.theme'
export const THEME_DOMAIN = '.pancakeswap.finance'

const useTheme = () => {
  const { resolvedTheme, setTheme } = useNextTheme()
  const theme = useContext(StyledThemeContext)
  const router = useRouter()

  // Set blue theme by default for embed-swap
  useEffect(() => {
    if (router.pathname === '/embed-swap' && resolvedTheme !== 'blue') {
      handleSwitchTheme('blue')
    }
  }, [router.pathname])

  // Get theme from URL parameter
  useEffect(() => {
    const { theme: urlTheme } = router.query
    if (urlTheme && ['light', 'dark', 'blue'].includes(urlTheme as string)) {
      handleSwitchTheme(urlTheme as 'light' | 'dark' | 'blue')
    }
  }, [router.query])

  const handleSwitchTheme = useCallback(
    (themeValue: 'light' | 'dark' | 'blue') => {
      try {
        setTheme(themeValue)
        Cookie.set(COOKIE_THEME_KEY, themeValue, { domain: THEME_DOMAIN })
      } catch (err) {
        // ignore set cookie error for perp theme
      }
    },
    [setTheme],
  )

  return useMemo(
    () => ({ 
      isDark: resolvedTheme === 'dark', 
      isBlue: resolvedTheme === 'blue', 
      resolvedTheme, 
      theme, 
      setTheme: handleSwitchTheme 
    }),
    [theme, resolvedTheme, handleSwitchTheme],
  )
}

export default useTheme
