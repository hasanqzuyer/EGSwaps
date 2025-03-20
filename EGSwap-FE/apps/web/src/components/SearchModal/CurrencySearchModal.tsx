import { useCallback, useState, useRef, useEffect } from 'react'
import { Currency, Token } from '@pancakeswap/sdk'
import {
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalBackButton,
  ModalCloseButton,
  ModalBody,
  InjectedModalProps,
  Heading,
  Button,
  useMatchBreakpoints,
  MODAL_SWIPE_TO_CLOSE_VELOCITY,
  ImportList,
} from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useListState } from 'state/lists/lists'
import { useAllLists } from 'state/lists/hooks'
import { usePreviousValue, useTheme } from '@pancakeswap/hooks'
import { TokenList } from '@pancakeswap/token-lists'
import { useTranslation } from '@pancakeswap/localization'
import { enableList, removeList, useFetchListCallback } from '@pancakeswap/token-lists/react'
import CurrencySearch from './CurrencySearch'
import ImportToken from './ImportToken'
import Manage from './Manage'
import { CurrencyModalView } from './types'

const Footer = styled.div`
  width: 100%;
  // background-color: ${({ theme }) => theme.colors.backgroundAlt};
  text-align: center;
`
const StyledModalContainer = styled(ModalContainer)`
  width: 100%;
  min-width: 320px;
  max-width: 420px !important;
  min-height: calc(var(--vh, 1vh) * 90);
  ${({ theme }) => theme.mediaQueries.md} {
    min-height: auto;
  }
`

const StyledModalBody = styled(ModalBody)`
  padding: 24px;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`
const GradientText = styled.span<{ font?: number; mx?: number; isBlue?: boolean }>`
  background-image: ${({ isBlue }) => isBlue ? 'linear-gradient(180deg, #6630FF -10%, #5900C9 110%)' : 'linear-gradient(90deg, #2cf0d6 0%, #22ce77 100%)'};
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  font-size: ${({ font }) => font}px;
  margin: 0 ${({ mx }) => mx ?? 0}px;
`

export interface CurrencySearchModalProps extends InjectedModalProps {
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherSelectedCurrency?: Currency | null
  showCommonBases?: boolean
  commonBasesType?: string
  showSearchInput?: boolean
  tokensToShow?: Token[]
}

export default function CurrencySearchModal({
  onDismiss = () => null,
  onCurrencySelect,
  selectedCurrency,
  otherSelectedCurrency,
  showCommonBases = true,
  commonBasesType,
  showSearchInput,
  tokensToShow,
}: CurrencySearchModalProps) {
  const { isDark, isBlue } = useTheme()
  const [modalView, setModalView] = useState<CurrencyModalView>(CurrencyModalView.search)

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onDismiss?.()
      onCurrencySelect(currency)
    },
    [onDismiss, onCurrencySelect],
  )

  // for token import view
  const prevView = usePreviousValue(modalView)

  // used for import token flow
  const [importToken, setImportToken] = useState<Token | undefined>()

  // used for import list
  const [importList, setImportList] = useState<TokenList | undefined>()
  const [listURL, setListUrl] = useState<string | undefined>()

  const { t } = useTranslation()

  const [, dispatch] = useListState()
  const lists = useAllLists()
  const adding = Boolean(lists[listURL]?.loadingRequestId)

  const fetchList = useFetchListCallback(dispatch)

  const [addError, setAddError] = useState<string | null>(null)

  const handleAddList = useCallback(() => {
    if (adding) return
    setAddError(null)
    fetchList(listURL)
      .then(() => {
        dispatch(enableList(listURL))
        setModalView(CurrencyModalView.manage)
      })
      .catch((error) => {
        setAddError(error.message)
        dispatch(removeList(listURL))
      })
  }, [adding, dispatch, fetchList, listURL])

  const config = {
    [CurrencyModalView.search]: { title: t('Select a Token'), onBack: undefined },
    [CurrencyModalView.manage]: { title: t('Manage'), onBack: () => setModalView(CurrencyModalView.search) },
    [CurrencyModalView.importToken]: {
      title: t('Import Tokens'),
      onBack: () =>
        setModalView(prevView && prevView !== CurrencyModalView.importToken ? prevView : CurrencyModalView.search),
    },
    [CurrencyModalView.importList]: { title: t('Import List'), onBack: () => setModalView(CurrencyModalView.search) },
  }
  const { isMobile } = useMatchBreakpoints()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(undefined)
  useEffect(() => {
    if (!wrapperRef.current) return
    setHeight(wrapperRef.current.offsetHeight - 330)
  }, [])

  return (
    <StyledModalContainer
      drag={isMobile ? 'y' : false}
      dragConstraints={{ top: 0, bottom: 600 }}
      dragElastic={{ top: 0 }}
      dragSnapToOrigin
      onDragStart={() => {
        if (wrapperRef.current) wrapperRef.current.style.animation = 'none'
      }}
      // @ts-ignore
      onDragEnd={(e, info) => {
        if (info.velocity.y > MODAL_SWIPE_TO_CLOSE_VELOCITY && onDismiss) onDismiss()
      }}
      ref={wrapperRef}
    >
      <ModalHeader background={isDark ? '#0f0f0f' : isBlue ? '#050f2d' : '#e1e1e1'}>
        <ModalTitle>
          {config[modalView].onBack && <ModalBackButton onBack={config[modalView].onBack} />}
          <Heading>
            <GradientText font={20} isBlue={isBlue}>{config[modalView].title}</GradientText>
          </Heading>
        </ModalTitle>
        <ModalCloseButton onDismiss={onDismiss} />
      </ModalHeader>
      <StyledModalBody style={{ background: isDark ? '#181818' : isBlue ? '#050f2d' : '#f4f4f4' }}>
        {modalView === CurrencyModalView.search ? (
          <CurrencySearch
            onCurrencySelect={handleCurrencySelect}
            selectedCurrency={selectedCurrency}
            otherSelectedCurrency={otherSelectedCurrency}
            showCommonBases={showCommonBases}
            commonBasesType={commonBasesType}
            showSearchInput={showSearchInput}
            showImportView={() => setModalView(CurrencyModalView.importToken)}
            setImportToken={setImportToken}
            height={height}
            tokensToShow={tokensToShow}
          />
        ) : modalView === CurrencyModalView.importToken && importToken ? (
          <ImportToken tokens={[importToken]} handleCurrencySelect={handleCurrencySelect} />
        ) : modalView === CurrencyModalView.importList && importList && listURL ? (
          <ImportList
            onAddList={handleAddList}
            addError={addError}
            listURL={listURL}
            listLogoURI={importList?.logoURI}
            listName={importList?.name}
            listTokenLength={importList?.tokens.length}
          />
        ) : modalView === CurrencyModalView.manage ? (
          <Manage
            setModalView={setModalView}
            setImportToken={setImportToken}
            setImportList={setImportList}
            setListUrl={setListUrl}
          />
        ) : (
          ''
        )}
        {modalView === CurrencyModalView.search && (
          <Footer>
            <Button
              scale="sm"
              // variant="text"
              onClick={() => setModalView(CurrencyModalView.manage)}
              className="list-token-manage-button"
              style={{
                background: isBlue ? 'linear-gradient(180deg, #6630FF -10%, #5900C9 110%)' : 'linear-gradient(90deg, #2CF0D6 0%, #22CE77 100%)',
                width: '200px',
                height: '40px',
                borderRadius: '20px',
              }}
            >
              {t('Manage Tokens')}
            </Button>
          </Footer>
        )}
      </StyledModalBody>
    </StyledModalContainer>
  )
}
