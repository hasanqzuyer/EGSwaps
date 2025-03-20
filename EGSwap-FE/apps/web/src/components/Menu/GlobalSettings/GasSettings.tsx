import { Flex, Button, Text, QuestionHelper } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useTheme } from '@pancakeswap/hooks'
import { useGasPriceManager } from 'state/user/hooks'
import { GAS_PRICE_GWEI, GAS_PRICE } from 'state/types'

const GasSettings = () => {
  const { t } = useTranslation()
  const { isDark, isBlue } = useTheme()
  const [gasPrice, setGasPrice] = useGasPriceManager()

  const commonStyle = {
    borderRadius: '6px',
    height: '37px',
  }
  const selectedStyle = {
    ...commonStyle,
    background: !isBlue ? 'linear-gradient(90deg, #2CF0D6 0%, #22CE77 100%)' : 'linear-gradient(180deg, #8B5FFF 0%, #7A33FF 100%)',
    border: '1px solid transparent',
    color: 'white',
  }
  const normalStyle = {
    ...commonStyle,
    background: isDark || isBlue ? '#2f2f2f' : '#f4f4f4',
    border: `1px solid ${isDark || isBlue ? 'transparent' : '#22CE77'}`,
    color: isDark || isBlue ? 'white' : '#22ce77',
  }

  return (
    <Flex flexDirection="column">
      <Flex mb="12px" alignItems="center">
        <Text small>{t('Default Transaction Speed (GWEI)')}</Text>
        <QuestionHelper
          text={
            <Flex flexDirection="column">
              <Text>
                {t(
                  'Adjusts the gas price (transaction fee) for your transaction. Higher GWEI = higher speed = higher fees.',
                )}
              </Text>
              <Text mt="8px">{t('Choose “Default” to use the settings from your current blockchain RPC node.')}</Text>
            </Flex>
          }
          placement="top-start"
          ml="4px"
        />
      </Flex>
      <Flex flexWrap="wrap">
        <Button
          mt="4px"
          mr="10px"
          scale="sm"
          onClick={() => {
            setGasPrice(GAS_PRICE_GWEI.rpcDefault)
          }}
          // variant={gasPrice === GAS_PRICE_GWEI.rpcDefault ? 'primary' : 'input'}
          style={gasPrice === GAS_PRICE_GWEI.rpcDefault ? selectedStyle : normalStyle}
        >
          {t('Default')}
        </Button>
        <Button
          mt="4px"
          mr="10px"
          scale="sm"
          onClick={() => {
            setGasPrice(GAS_PRICE_GWEI.default)
          }}
          // variant={gasPrice === GAS_PRICE_GWEI.default ? 'primary' : 'tertiary'}
          style={gasPrice === GAS_PRICE_GWEI.default ? selectedStyle : normalStyle}
        >
          {t('Standard (%gasPrice%)', { gasPrice: GAS_PRICE.default })}
        </Button>
        <Button
          mt="4px"
          mr="10px"
          scale="sm"
          onClick={() => {
            setGasPrice(GAS_PRICE_GWEI.fast)
          }}
          // variant={gasPrice === GAS_PRICE_GWEI.fast ? 'primary' : 'tertiary'}
          style={gasPrice === GAS_PRICE_GWEI.fast ? selectedStyle : normalStyle}
        >
          {t('Fast (%gasPrice%)', { gasPrice: GAS_PRICE.fast })}
        </Button>
        <Button
          mr="0px"
          mt="4px"
          scale="sm"
          onClick={() => {
            setGasPrice(GAS_PRICE_GWEI.instant)
          }}
          // variant={gasPrice === GAS_PRICE_GWEI.instant ? 'primary' : 'tertiary'}
          style={gasPrice === GAS_PRICE_GWEI.instant ? selectedStyle : normalStyle}
        >
          {t('Instant (%gasPrice%)', { gasPrice: GAS_PRICE.instant })}
        </Button>
      </Flex>
    </Flex>
  )
}

export default GasSettings
