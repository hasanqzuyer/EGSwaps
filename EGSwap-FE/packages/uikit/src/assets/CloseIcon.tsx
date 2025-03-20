interface CloseIconProps {
  isBlue?: boolean;
}

const CloseIcon: React.FC<CloseIconProps> = ({ isBlue }) => {

  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.5" y="0.5" width="25" height="25" rx="6.5" stroke={`url(#paint0_linear_1703_1179${isBlue ? '_blue' : ''})`} />
      <g clip-path="url(#clip0_1703_1179)">
        <path
          d="M7.32713 19.9123C6.98389 19.9323 6.64633 19.8182 6.38562 19.5941C5.87146 19.0768 5.87146 18.2415 6.38562 17.7243L17.6441 6.46574C18.1789 5.96534 19.018 5.99315 19.5184 6.52793C19.9709 7.01152 19.9973 7.75482 19.5802 8.26924L8.25537 19.5941C7.99803 19.8149 7.66588 19.9288 7.32713 19.9123Z"
          fill={`url(#paint1_linear_1703_1179${isBlue ? '_blue' : ''})`}
        />
        <path
          d="M18.5724 19.9124C18.2246 19.9109 17.8912 19.7728 17.6442 19.5278L6.38564 8.26923C5.90929 7.71297 5.97405 6.87583 6.53031 6.39944C7.02679 5.97428 7.75899 5.97428 8.25543 6.39944L19.5802 17.658C20.1149 18.1585 20.1425 18.9977 19.642 19.5323C19.6221 19.5536 19.6015 19.5742 19.5802 19.5941C19.3029 19.8352 18.938 19.9505 18.5724 19.9124Z"
          fill={`url(#paint2_linear_1703_1179${isBlue ? '_blue' : ''})`}
        />
      </g>
      <defs>
        <linearGradient id="paint0_linear_1703_1179" x1="0" y1="13" x2="26" y2="13" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2CF0D6" />
          <stop offset="1" stopColor="#22CE77" />
        </linearGradient>
        <linearGradient id="paint1_linear_1703_1179" x1="6" y1="13.0112" x2="19.8763" y2="13.0112" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2CF0D6" />
          <stop offset="1" stopColor="#22CE77" />
        </linearGradient>
        <linearGradient id="paint2_linear_1703_1179" x1="6.06677" y1="13" x2="20" y2="13" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2CF0D6" />
          <stop offset="1" stopColor="#22CE77" />
        </linearGradient>
        <linearGradient id="paint0_linear_1703_1179_blue" x1="0" y1="13" x2="26" y2="13" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B5FFF" />
          <stop offset="1" stopColor="#7A33FF" />
        </linearGradient>
        <linearGradient id="paint1_linear_1703_1179_blue" x1="6" y1="13.0112" x2="19.8763" y2="13.0112" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B5FFF" />
          <stop offset="1" stopColor="#7A33FF" />
        </linearGradient>
        <linearGradient id="paint2_linear_1703_1179_blue" x1="6.06677" y1="13" x2="20" y2="13" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B5FFF" />
          <stop offset="1" stopColor="#7A33FF" />
        </linearGradient>
        <clipPath id="clip0_1703_1179">
          <rect width="14" height="14" fill="white" transform="translate(6 6)" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default CloseIcon;
