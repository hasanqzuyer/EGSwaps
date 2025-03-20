import { Button, ButtonProps } from '@pancakeswap/uikit'
import { useSwitchNetworkLoading } from 'hooks/useSwitchNetworkLoading'
import { useSetAtom } from 'jotai'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { hideWrongNetworkModalAtom } from './NetworkModal'
import Trans from './Trans'
import { useTheme } from '@pancakeswap/hooks'

const wrongNetworkProps: ButtonProps = {
  variant: 'danger',
  disabled: false,
  children: <Trans>Wrong Network</Trans>,
}

export const CommitButton = (props: ButtonProps) => {
  const { isWrongNetwork } = useActiveChainId()
  const [switchNetworkLoading] = useSwitchNetworkLoading()
  const setHideWrongNetwork = useSetAtom(hideWrongNetworkModalAtom)
  const { isBlue } = useTheme()

  return (
    <div className="w-full flex justify-center">
      <Button
        {...props}
        onClick={(e) => {
          if (isWrongNetwork) {
            setHideWrongNetwork(false)
          } else {
            props.onClick?.(e)
          }
        }}
        {...(switchNetworkLoading && { disabled: true })}
        {...(isWrongNetwork && wrongNetworkProps)}
        style={{
          background: isBlue ? 'linear-gradient(180deg, #6630FF 0%, #5900C9 100%)' : 'linear-gradient(90deg, #2CF0D6 0%, #22CE77 100%)',
          color: '#fff',
          margin: '0',
          borderRadius: '1.75rem',
        }}
        minWidth="150px"
        width="fit-content"
      />
    </div>
  )
}
