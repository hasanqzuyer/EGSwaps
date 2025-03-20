import React from 'react'
import { useMatchBreakpoints } from '@pancakeswap/uikit'

const Progress = ({ color }) => {
  const { isDesktop, isTablet } = useMatchBreakpoints()
  return (
    <svg
      width={isDesktop || isTablet ? 20 : 6}
      height={isDesktop || isTablet ? 32 : 20}
      viewBox="0 0 20 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.7893 14.7514L4.54888 0.511215C4.21951 0.181592 3.77984 0 3.31103 0C2.84222 0 2.40255 0.181592 2.07319 0.511215L1.02448 1.55966C0.342083 2.24284 0.342083 3.35321 1.02448 4.03535L12.9825 15.9934L1.01122 27.9646C0.681852 28.2943 0.5 28.7337 0.5 29.2022C0.5 29.6713 0.681852 30.1107 1.01122 30.4406L2.05992 31.4888C2.38955 31.8184 2.82896 32 3.29777 32C3.76658 32 4.20625 31.8184 4.53561 31.4888L18.7893 17.2356C19.1194 16.905 19.3008 16.4635 19.2997 15.9941C19.3008 15.523 19.1194 15.0818 18.7893 14.7514Z"
        fill={color}
      />
    </svg>
  )
}

export default Progress
