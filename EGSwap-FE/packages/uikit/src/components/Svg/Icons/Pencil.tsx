import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

interface PencilProps extends SvgProps {
  isBlue?: boolean;
}

const Icon: React.FC<React.PropsWithChildren<PencilProps>> = ({ isBlue, ...props }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 15 15" fill="none" {...props}>
      <g clip-path="url(#clip0_1626_1414)">
        <path
          d="M11.2107 7.88203C10.8882 7.88203 10.6274 8.1434 10.6274 8.46533V13.132C10.6274 13.4534 10.3661 13.7153 10.0441 13.7153H1.87744C1.5554 13.7153 1.29414 13.4534 1.29414 13.132V4.96533C1.29414 4.64394 1.5554 4.38203 1.87744 4.38203H6.54414C6.86671 4.38203 7.12744 4.12067 7.12744 3.79874C7.12744 3.4767 6.86671 3.21533 6.54414 3.21533H1.87744C0.912613 3.21533 0.127441 4.0005 0.127441 4.96533V13.132C0.127441 14.0969 0.912613 14.882 1.87744 14.882H10.0441C11.009 14.882 11.7941 14.0969 11.7941 13.132V8.46533C11.7941 8.14276 11.5333 7.88203 11.2107 7.88203Z"
          fill={`url(#paint0_linear_1626_1414${isBlue ? '_blue' : ''})`}
        />
        <path
          d="M5.59807 7.35019C5.55727 7.39099 5.52982 7.4429 5.51817 7.49887L5.10578 9.56161C5.08655 9.65721 5.11688 9.7558 5.18567 9.82523C5.24111 9.88066 5.31577 9.91035 5.39224 9.91035C5.41083 9.91035 5.43016 9.90865 5.44939 9.90459L7.51149 9.49219C7.56864 9.48044 7.62055 9.45309 7.66081 9.41219L12.2761 4.79686L10.214 2.73486L5.59807 7.35019Z"
          fill={`url(#paint1_linear_1626_1414${isBlue ? '_blue' : ''})`}
        />
        <path
          d="M13.7 1.3089C13.1313 0.740131 12.2061 0.740131 11.6378 1.3089L10.8306 2.11618L12.8927 4.17829L13.7 3.3709C13.9753 3.09618 14.127 2.72982 14.127 2.34017C14.127 1.95052 13.9753 1.58416 13.7 1.3089Z"
          fill={`url(#paint2_linear_1626_1414${isBlue ? '_blue' : ''})`}
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_1626_1414"
          x1="0.127441"
          y1="9.04868"
          x2="11.7941"
          y2="9.04868"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#2CF0D6" />
          <stop offset="1" stop-color="#22CE77" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1626_1414"
          x1="5.1001"
          y1="6.32261"
          x2="12.2761"
          y2="6.32261"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#2CF0D6" />
          <stop offset="1" stop-color="#22CE77" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_1626_1414"
          x1="10.8306"
          y1="2.53031"
          x2="14.127"
          y2="2.53031"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#2CF0D6" />
          <stop offset="1" stop-color="#22CE77" />
        </linearGradient>
        <linearGradient
          id="paint0_linear_1626_1414_blue"
          x1="0.127441"
          y1="9.04868"
          x2="11.7941"
          y2="9.04868"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#8B5FFF" />
          <stop offset="1" stop-color="#7A33FF" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1626_1414_blue"
          x1="5.1001"
          y1="6.32261"
          x2="12.2761"
          y2="6.32261"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#8B5FFF" />
          <stop offset="1" stop-color="#7A33FF" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_1626_1414_blue"
          x1="10.8306"
          y1="2.53031"
          x2="14.127"
          y2="2.53031"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#8B5FFF" />
          <stop offset="1" stop-color="#7A33FF" />
        </linearGradient>
        <clipPath id="clip0_1626_1414">
          <rect width="14" height="14" fill="white" transform="translate(0.127441 0.85498)" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default Icon;
