import { Flex, IconButton, CogIcon, useModal } from '@pancakeswap/uikit'
import SettingsModal from './SettingsModal'
import { useTheme } from 'styled-components'

type Props = {
  color?: string
  mr?: string
  mode?: string
}

const GlobalSettings = ({ color, mr = '8px', mode }: Props) => {
  const [onPresentSettingsModal] = useModal(<SettingsModal mode={mode} />)
  const theme = useTheme()
  return (
    <IconButton
      onClick={onPresentSettingsModal}
      variant="text"
      scale="sm"
      id={`open-settings-dialog-button-${mode}`}
      className="hover:scale-105"
    >
      {theme.isBlue ? (
        <svg width="27" height="26" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0.774048" y="0.5" width="25" height="25" rx="6.45457" fill="#2F2F2F" />
          <rect x="0.774048" y="0.5" width="25" height="25" rx="6.45457" stroke="url(#paint0_linear_0_302)" />
          <path
            d="M19.4319 7.69737H7.11615M19.4319 12.829H7.11615M19.4319 17.9605H7.11615M17.3793 6.1579V9.23685M9.16878 11.2895V14.3684M15.3267 16.4211V19.5"
            stroke="url(#paint1_linear_0_302)"
            stroke-width="1.73864"
            stroke-linecap="square"
            stroke-linejoin="bevel"
          />
          <defs>
            <linearGradient
              id="paint0_linear_0_302"
              x1="0.274048"
              y1="13"
              x2="26.274"
              y2="13"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#6630FF" />
              <stop offset="1" stop-color="#5900C9" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_0_302"
              x1="7.11615"
              y1="12.8289"
              x2="19.4319"
              y2="12.8289"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#ffffff" /> 
              <stop offset="1" stop-color="#ffffff" />
            </linearGradient>
          </defs>
        </svg>
      ) : theme.isDark ? (
        <svg width="27" height="26" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0.774048" y="0.5" width="25" height="25" rx="6.45457" fill="#2F2F2F" />
          <rect x="0.774048" y="0.5" width="25" height="25" rx="6.45457" stroke="url(#paint0_linear_0_302)" />
          <path
            d="M19.4319 7.69737H7.11615M19.4319 12.829H7.11615M19.4319 17.9605H7.11615M17.3793 6.1579V9.23685M9.16878 11.2895V14.3684M15.3267 16.4211V19.5"
            stroke="url(#paint1_linear_0_302)"
            stroke-width="1.73864"
            stroke-linecap="square"
            stroke-linejoin="bevel"
          />
          <defs>
            <linearGradient
              id="paint0_linear_0_302"
              x1="0.274048"
              y1="13"
              x2="26.274"
              y2="13"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#2CF0D6" />
              <stop offset="1" stop-color="#22CE77" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_0_302"
              x1="7.11615"
              y1="12.8289"
              x2="19.4319"
              y2="12.8289"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#2CF0D6" />
              <stop offset="1" stop-color="#22CE77" />
            </linearGradient>
          </defs>
        </svg>
      ) : (
        <svg width="27" height="26" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0.774017" y="0.5" width="25" height="25" rx="6.45457" fill="#F4F4F4" />
          <rect x="0.774017" y="0.5" width="25" height="25" rx="6.45457" stroke="url(#paint0_linear_0_756)" />
          <path
            d="M19.4319 7.69737H7.11612M19.4319 12.829H7.11612M19.4319 17.9605H7.11612M17.3793 6.1579V9.23685M9.16875 11.2895V14.3684M15.3266 16.4211V19.5"
            stroke="url(#paint1_linear_0_756)"
            stroke-width="1.73864"
            stroke-linecap="square"
            stroke-linejoin="bevel"
          />
          <defs>
            <linearGradient
              id="paint0_linear_0_756"
              x1="0.274017"
              y1="13"
              x2="26.274"
              y2="13"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#2CF0D6" />
              <stop offset="1" stop-color="#22CE77" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_0_756"
              x1="7.11612"
              y1="12.8289"
              x2="19.4319"
              y2="12.8289"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#2CF0D6" />
              <stop offset="1" stop-color="#22CE77" />
            </linearGradient>
          </defs>
        </svg>
      )}
    </IconButton>
  )
}

export default GlobalSettings
