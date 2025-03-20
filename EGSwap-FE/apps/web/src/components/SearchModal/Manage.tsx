import { useState } from 'react'
import { Token } from '@pancakeswap/sdk'
import { ButtonMenu, ButtonMenuItem, ModalBody } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { TokenList } from '@pancakeswap/token-lists'
import { useTheme } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import ManageLists from './ManageLists'
import ManageTokens from './ManageTokens'
import { CurrencyModalView } from './types'

export default function Manage({
  setModalView,
  setImportList,
  setImportToken,
  setListUrl,
}: {
  setModalView: (view: CurrencyModalView) => void
  setImportToken: (token: Token) => void
  setImportList: (list: TokenList) => void
  setListUrl: (url: string) => void
}) {
  const [showLists, setShowLists] = useState(true)

  const { t } = useTranslation()
  const { isDark, isBlue } = useTheme()

  const StyledButtonMenu = styled(ButtonMenu)`
    width: 100%;
    button:first-child {
      background: ${({ activeIndex }) => (!activeIndex ? isBlue ? 'linear-gradient(180deg, #6630FF -10%, #5900C9 110%)' : '#22CE77' : 'transparent')};
    }
    button:nth-child(2) {
      background: ${({ activeIndex }) => (activeIndex ? isBlue ? 'linear-gradient(180deg, #6630FF -10%, #5900C9 110%)' : '#22CE77' : 'transparent')};
    }
    button {
      color: ${isDark || isBlue ? '#fff' : '#000'};
    }
  `

  return (
    <ModalBody style={{ overflow: 'visible' }}>
      <StyledButtonMenu
        activeIndex={showLists ? 0 : 1}
        onItemClick={() => setShowLists((prev) => !prev)}
        scale="sm"
        variant="primary"
        mb="32px"
      >
        <ButtonMenuItem width="50%" >{t('Lists')}</ButtonMenuItem>
        <ButtonMenuItem width="50%" >{t('Tokens')}</ButtonMenuItem>
      </StyledButtonMenu>
      {showLists ? (
        <ManageLists setModalView={setModalView} setImportList={setImportList} setListUrl={setListUrl} />
      ) : (
        <ManageTokens setModalView={setModalView} setImportToken={setImportToken} />
      )}
    </ModalBody>
  )
}
