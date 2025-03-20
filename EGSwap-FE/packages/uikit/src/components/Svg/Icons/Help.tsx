import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

interface HelpProps extends SvgProps {
  isBlue?: boolean;
}

const Icon: React.FC<React.PropsWithChildren<HelpProps>> = ({ isBlue, ...props }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none" {...props}>
      <g clip-path="url(#clip0_1626_1662)">
        <path
          d="M8 0.5C3.57841 0.5 0 4.078 0 8.5C0 12.9215 3.578 16.5 8 16.5C12.4216 16.5 16 12.922 16 8.5C16 4.07841 12.422 0.5 8 0.5ZM8 15.3837C4.20431 15.3837 1.11628 12.2957 1.11628 8.5C1.11628 4.70428 4.20431 1.61628 8 1.61628C11.7957 1.61628 14.8837 4.70428 14.8837 8.5C14.8837 12.2957 11.7957 15.3837 8 15.3837Z"
          fill={`url(#paint0_linear_help${isBlue ? '_blue' : ''})`}
        />
        <path
          d="M7.7632 10.6226C7.32092 10.6226 6.96289 10.9911 6.96289 11.4334C6.96289 11.8652 7.31039 12.2442 7.7632 12.2442C8.21602 12.2442 8.57402 11.8652 8.57402 11.4334C8.57402 10.9911 8.20545 10.6226 7.7632 10.6226Z"
          fill={`url(#paint1_linear_help${isBlue ? '_blue' : ''})`}
        />
        <path
          d="M7.90018 4.4834C6.47856 4.4834 5.82568 5.32587 5.82568 5.89449C5.82568 6.30518 6.17318 6.49474 6.4575 6.49474C7.02615 6.49474 6.7945 5.68387 7.86859 5.68387C8.39509 5.68387 8.81634 5.91555 8.81634 6.39996C8.81634 6.96859 8.22662 7.29502 7.87912 7.58987C7.57371 7.85309 7.17359 8.28487 7.17359 9.19049C7.17359 9.73806 7.32103 9.89602 7.75275 9.89602C8.26871 9.89602 8.37403 9.66437 8.37403 9.46424C8.37403 8.91668 8.38456 8.60077 8.96375 8.14796C9.24806 7.92684 10.1431 7.21074 10.1431 6.2209C10.1431 5.23105 9.24806 4.4834 7.90018 4.4834Z"
          fill={`url(#paint2_linear_help${isBlue ? '_blue' : ''})`}
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_help"
          x1="0"
          y1="8.5"
          x2="16"
          y2="8.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#2CF0D6" />
          <stop offset="1" stop-color="#22CE77" />
        </linearGradient>
        <linearGradient
          id="paint0_linear_help_blue"
          x1="0"
          y1="8.5"
          x2="16"
          y2="8.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#6630FF" />
          <stop offset="1" stop-color="#5900C9" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_help"
          x1="6.96289"
          y1="11.4334"
          x2="8.57402"
          y2="11.4334"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#2CF0D6" />
          <stop offset="1" stop-color="#22CE77" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_help_blue"
          x1="6.96289"
          y1="11.4334"
          x2="8.57402"
          y2="11.4334"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#6630FF" />
          <stop offset="1" stop-color="#5900C9" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_help"
          x1="5.82568"
          y1="7.18971"
          x2="10.1431"
          y2="7.18971"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#2CF0D6" />
          <stop offset="1" stop-color="#22CE77" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_help_blue"
          x1="5.82568"
          y1="7.18971"
          x2="10.1431"
          y2="7.18971"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#6630FF" />
          <stop offset="1" stop-color="#5900C9" />
        </linearGradient>
        <clipPath id="clip0_1626_1662">
          <rect width="16" height="16" fill="white" transform="translate(0 0.5)" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default Icon;
