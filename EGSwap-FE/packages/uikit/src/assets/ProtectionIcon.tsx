import { useTheme } from "@pancakeswap/hooks";

const ProtectionIcon = () => {
  const { isBlue } = useTheme();
  
  return (
    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_1703_1797)">
        <path
          d="M3.79639 5.55512C3.85964 6.31178 4.00489 7.34825 4.33354 8.43653C5.03154 10.7477 6.26461 12.391 8.00039 13.3249C9.73617 12.391 10.9692 10.7477 11.6672 8.43653C11.9959 7.34834 12.1411 6.31184 12.2044 5.55512L8.00039 3.45312L3.79639 5.55512Z"
          fill={`url(#paint0_linear_1703_1797${isBlue ? '_blue' : ''})`}
        />
        <path
          d="M15.0578 4.1033C15.049 3.93474 14.9503 3.7839 14.7993 3.70843L8.20946 0.41349C8.07749 0.347521 7.92218 0.347521 7.79021 0.41349L1.20036 3.70843C1.04939 3.7839 0.950644 3.93474 0.941894 4.1033C0.936894 4.19924 0.828519 6.48355 1.60667 9.13564C2.06711 10.7048 2.74436 12.0754 3.61961 13.2092C4.72258 14.638 6.14021 15.6891 7.83311 16.3334C7.88683 16.3538 7.9433 16.364 7.99983 16.364C8.05636 16.364 8.11283 16.3538 8.16655 16.3334C9.85946 15.6891 11.2771 14.638 12.38 13.2092C13.2553 12.0754 13.9325 10.7048 14.393 9.13564C15.1711 6.48355 15.0628 4.19924 15.0578 4.1033ZM8.20758 14.2725C8.14211 14.3049 8.07096 14.3211 7.99983 14.3211C7.92871 14.3211 7.85752 14.3049 7.79208 14.2725C5.70483 13.2405 4.23908 11.3682 3.43558 8.70761C3.03371 7.3769 2.88861 6.12296 2.83767 5.3054C2.82596 5.11765 2.92764 4.94111 3.09589 4.85699L7.79024 2.50983C7.92221 2.4439 8.07752 2.44387 8.20949 2.50983L12.9039 4.85699C13.0721 4.94108 13.1738 5.11768 13.1621 5.30543C13.1111 6.12305 12.966 7.37702 12.5641 8.70761C11.7606 11.3681 10.2948 13.2405 8.20758 14.2725Z"
          fill={`url(#paint1_linear_1703_1797${isBlue ? '_blue' : ''})`}
        />
      </g>
      <defs>
        <linearGradient id="paint0_linear_1703_1797" x1="3.79639" y1="8.389" x2="12.2044" y2="8.389" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2CF0D6" />
          <stop offset="1" stopColor="#22CE77" />
        </linearGradient>
        <linearGradient id="paint1_linear_1703_1797" x1="0.934082" y1="8.364" x2="15.0656" y2="8.364" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2CF0D6" />
          <stop offset="1" stopColor="#22CE77" />
        </linearGradient>
        <linearGradient id="paint0_linear_1703_1797_blue" x1="3.79639" y1="8.389" x2="12.2044" y2="8.389" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B5FFF" />
          <stop offset="1" stopColor="#7A33FF" />
        </linearGradient>
        <linearGradient id="paint1_linear_1703_1797_blue" x1="0.934082" y1="8.364" x2="15.0656" y2="8.364" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B5FFF" />
          <stop offset="1" stopColor="#7A33FF" />
        </linearGradient>
        <clipPath id="clip0_1703_1797">
          <rect width="16" height="16" fill="white" transform="translate(0 0.364014)" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default ProtectionIcon;
