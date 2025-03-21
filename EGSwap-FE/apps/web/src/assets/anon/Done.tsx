import React from 'react'

const Done = ({ color, size }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16.52 22.68L12.6 26.6L25.2 39.2L53.2 11.2L49.28 7.28L25.2 31.36L16.52 22.68ZM50.4 28C50.4 40.32 40.32 50.4 28 50.4C15.68 50.4 5.6 40.32 5.6 28C5.6 15.68 15.68 5.6 28 5.6C30.24 5.6 32.2 5.88 34.16 6.44L38.6401 1.96C35.28 0.84 31.64 0 28 0C12.6 0 0 12.6 0 28C0 43.4 12.6 56 28 56C43.4 56 56 43.4 56 28H50.4Z"
        fill={color}
      />
    </svg>
  )
}

export default Done
