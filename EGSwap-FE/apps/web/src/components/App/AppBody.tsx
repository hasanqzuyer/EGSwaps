import styled from 'styled-components'
import { Card } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'

export const BodyWrapper = styled(Card)`
  border-radius: 24px;
  min-width: 600px;
  width: 30%;
  z-index: 1;
  background-color: ${({ theme }) => (theme.isDark ? '#181818' : '#f4f4f4')};
  box-shadow: 0 0 20px #00000044;

  @media (max-width: 600px) {
    min-width: 50px;
    width: 100%;
  }
`
export const BodyWrapperEmbed = styled(Card)`
  border-radius: 24px;
  min-width: 600px;
  width: 30%;
  z-index: 1;
  background-color: ${({ theme }) => (theme.isDark ? '#181818' : theme.isBlue ? '#161622' : '#f4f4f4')};

  @media (max-width: 600px) {
    min-width: 50px;
    width: 100%;
  }
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const defaultReturn = <BodyWrapper>{children}</BodyWrapper>;
  const embedReturn = <BodyWrapperEmbed>{children}</BodyWrapperEmbed>;
  return router.pathname.includes("embed-swap") ? embedReturn  : defaultReturn;
}
