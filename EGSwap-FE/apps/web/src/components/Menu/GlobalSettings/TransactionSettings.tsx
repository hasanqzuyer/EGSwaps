import { useEffect, useState } from 'react'
import { escapeRegExp } from 'utils'
import { Text, Button, Input, Flex, Box, QuestionHelper } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useUserSlippageTolerance, useUserTransactionTTL, useUserAutoSlippageTolerance } from 'state/user/hooks'
import { useTheme } from '@pancakeswap/hooks'

enum SlippageError {
  InvalidInput = 'InvalidInput',
  RiskyLow = 'RiskyLow',
  RiskyHigh = 'RiskyHigh',
}

enum DeadlineError {
  InvalidInput = 'InvalidInput',
}

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group
const THREE_DAYS_IN_SECONDS = 60 * 60 * 24 * 3

const SlippageTabs = () => {
  const [userSlippageTolerance, setUserSlippageTolerance] = useUserSlippageTolerance()
  const [userAutoSlippageTolerance, setUserAutoSlippageTolerance] = useUserAutoSlippageTolerance()
  const [ttl, setTtl] = useUserTransactionTTL()
  const [slippageInput, setSlippageInput] = useState('')
  const [deadlineInput, setDeadlineInput] = useState('')
  const { isDark, isBlue } = useTheme()

  const { t } = useTranslation()

  const slippageInputIsValid =
    slippageInput === '' || (userSlippageTolerance / 100).toFixed(2) === Number.parseFloat(slippageInput).toFixed(2)
  const deadlineInputIsValid = deadlineInput === '' || (ttl / 60).toString() === deadlineInput

  let slippageError: SlippageError | undefined
  if (slippageInput !== '' && !slippageInputIsValid) {
    slippageError = SlippageError.InvalidInput
  } else if (slippageInputIsValid && userSlippageTolerance < 50) {
    slippageError = SlippageError.RiskyLow
  } else if (slippageInputIsValid && userSlippageTolerance > 500) {
    slippageError = SlippageError.RiskyHigh
  } else {
    slippageError = undefined
  }

  let deadlineError: DeadlineError | undefined
  if (deadlineInput !== '' && !deadlineInputIsValid) {
    deadlineError = DeadlineError.InvalidInput
  } else {
    deadlineError = undefined
  }

  const parseCustomSlippage = (value: string) => {
    if (value === '' || inputRegex.test(escapeRegExp(value))) {
      setSlippageInput(value)

      try {
        const valueAsIntFromRoundedFloat = Number.parseInt((Number.parseFloat(value) * 100).toString())
        if (!Number.isNaN(valueAsIntFromRoundedFloat) && valueAsIntFromRoundedFloat < 5000) {
          setUserSlippageTolerance(valueAsIntFromRoundedFloat)
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  const parseCustomDeadline = (value: string) => {
    setDeadlineInput(value)

    try {
      const valueAsInt: number = Number.parseInt(value) * 60
      if (!Number.isNaN(valueAsInt) && valueAsInt > 60 && valueAsInt < THREE_DAYS_IN_SECONDS) {
        setTtl(valueAsInt)
      } else {
        deadlineError = DeadlineError.InvalidInput
      }
    } catch (error) {
      console.error(error)
    }
  }

  const commonStyle = {
    borderRadius: '6px',
    height: '37px',
  }
  const selectedStyle = {
    ...commonStyle,
    background: isBlue ? 'linear-gradient(180deg, #8B5FFF 0%, #7A33FF 100%)' : 'linear-gradient(90deg, #2CF0D6 0%, #22CE77 100%)',
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
      <Flex flexDirection="column" mb="24px">
        <Flex mb="23px">
          <span className={`${isDark || isBlue ? 'text-white' : '#2f2f2f'} text-sm`}>{t('Slippage Tolerance')}</span>
          <QuestionHelper
            text={t(
              'Setting a high slippage tolerance can help transactions succeed, but you may not get such a good price. Use with caution.',
            )}
            placement="top-start"
            ml="4px"
          />
        </Flex>
        <Flex flexWrap="wrap" my="10px">
          <Button
            mt="0px"
            mr="10px"
            scale="sm"
            onClick={() => {
              setSlippageInput('')
              setUserAutoSlippageTolerance(true)
            }}
            style={userAutoSlippageTolerance === true ? selectedStyle : normalStyle}
          >
            Auto
          </Button>
          <Button
            mt="0px"
            mr="10px"
            scale="sm"
            onClick={() => {
              setSlippageInput('')
              setUserSlippageTolerance(10)
              setUserAutoSlippageTolerance(false)
            }}
            // variant={userSlippageTolerance === 10 ? 'primary' : 'tertiary'}
            style={(userSlippageTolerance === 10 && !userAutoSlippageTolerance) ? selectedStyle : normalStyle}
          >
            0.1%
          </Button>
          <Button
            mt="0px"
            mr="10px"
            scale="sm"
            onClick={() => {
              setSlippageInput('')
              setUserSlippageTolerance(50)
              setUserAutoSlippageTolerance(false)
            }}
            // variant={userSlippageTolerance === 50 ? 'primary' : 'tertiary'}
            style={(userSlippageTolerance === 50  && !userAutoSlippageTolerance) ? selectedStyle : normalStyle}
          >
            0.5%
          </Button>
          <Button
            mr="10px"
            mt="0px"
            scale="sm"
            onClick={() => {
              setSlippageInput('')
              setUserSlippageTolerance(100)
              setUserAutoSlippageTolerance(false)
            }}
            // variant={userSlippageTolerance === 100 ? 'primary' : 'tertiary'}
            style={(userSlippageTolerance === 100 && !userAutoSlippageTolerance) ? selectedStyle : normalStyle}
          >
            1.0%
          </Button>
          <Flex alignItems="center">
            <Box width="76px" mt="0px">
              <Input
                scale="sm"
                inputMode="decimal"
                pattern="^[0-9]*[.,]?[0-9]{0,2}$"
                placeholder={!userAutoSlippageTolerance ? (userSlippageTolerance / 100).toFixed(2) : ""}
                value={slippageInput}
                onBlur={() => {
                  parseCustomSlippage((userSlippageTolerance / 100).toFixed(2))
                }}
                onChange={(event) => {
                  if (event.currentTarget.validity.valid) {
                    parseCustomSlippage(event.target.value.replace(/,/g, '.'))
                  }
                }}
                isWarning={!slippageInputIsValid}
                isSuccess={![10, 50, 100].includes(userSlippageTolerance)}
                style={{
                  ...commonStyle,
                  color: isDark || isBlue ? 'white' : '#2f2f2f',
                  border: `1px solid ${
                    slippageError
                      ? slippageError === SlippageError.InvalidInput
                        ? 'red'
                        : '#F3841E'
                      : isDark 
                      ? '#22CE77' : isBlue ? '#7A33FF' : 'transparent'
                  }`,
                }}
              />
            </Box>
            <Text bold ml="6px" style={{ color: isDark || isBlue ? 'white' : '#2f2f2f' }}>
              %
            </Text>
          </Flex>
        </Flex>
        {!!slippageError && (
          <Text fontSize="14px" color={slippageError === SlippageError.InvalidInput ? 'red' : '#F3841E'} mt="8px">
            {slippageError === SlippageError.InvalidInput
              ? t('Enter a valid slippage percentage')
              : slippageError === SlippageError.RiskyLow
              ? t('Your transaction may fail')
              : t('Your transaction may be frontrun')}
          </Text>
        )}
      </Flex>
      <Flex justifyContent="space-between" alignItems="center" mb="24px">
        <Flex alignItems="center">
          <Text style={{ color: isDark || isBlue ? 'white' : '#2f2f2f' }}>{t('Tx deadline (mins)')}</Text>
          <QuestionHelper
            text={t('Your transaction will revert if it is left confirming for longer than this time.')}
            placement="top-start"
            ml="4px"
          />
        </Flex>
        <Flex>
          <Box width="65px" mt="4px">
            <Input
              scale="sm"
              inputMode="numeric"
              pattern="^[0-9]+$"
              isWarning={!!deadlineError}
              onBlur={() => {
                parseCustomDeadline((ttl / 60).toString())
              }}
              placeholder={(ttl / 60).toString()}
              value={deadlineInput}
              onChange={(event) => {
                if (event.currentTarget.validity.valid) {
                  parseCustomDeadline(event.target.value)
                }
              }}
              style={{
                color: isDark || isBlue ? 'white' : '#2f2f2f',
                border: `1px solid ${deadlineError ? 'red' : isDark ? '#22CE77' : 'transparent'}`,
                textAlign: 'center',
              }}
            />
          </Box>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default SlippageTabs
