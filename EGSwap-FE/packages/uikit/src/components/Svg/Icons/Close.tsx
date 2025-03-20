import React from "react";
import { useTheme } from "@pancakeswap/hooks";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  const { isDark, isBlue } = useTheme();
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_1626_1462)">
        <path
          d="M1.8959 19.8749C1.40556 19.9034 0.923326 19.7404 0.550889 19.4202C-0.18363 18.6813 -0.18363 17.488 0.550889 16.7491L16.6344 0.665488C17.3984 -0.0493789 18.5972 -0.00963981 19.3121 0.754324C19.9585 1.44517 19.9962 2.50702 19.4003 3.24192L3.22196 19.4202C2.85432 19.7358 2.37982 19.8985 1.8959 19.8749Z"
          fill="url(#paint0_linear_1626_1462)"
        />
        <path
          d="M17.9605 19.8749C17.4635 19.8728 16.9872 19.6755 16.6343 19.3256L0.550736 3.2419C-0.129757 2.44724 -0.0372407 1.25132 0.757417 0.570768C1.46667 -0.0366102 2.51267 -0.0366102 3.22186 0.570768L19.4002 16.6544C20.1639 17.3694 20.2034 18.5683 19.4884 19.3321C19.4599 19.3624 19.4306 19.3918 19.4002 19.4203C19.004 19.7648 18.4827 19.9294 17.9605 19.8749Z"
          fill="url(#paint1_linear_1626_1462)"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_1626_1462"
          x1="1.10771e-07"
          y1="10.0162"
          x2="19.8232"
          y2="10.0162"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color={isDark ? "#2CF0D6" : "#2F2F2F"} />
          <stop offset="1" stop-color={isDark ? "#22CE77" : "#2F2F2F"} />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1626_1462"
          x1="0.095215"
          y1="10.0002"
          x2="19.9999"
          y2="10.0002"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color={isDark ? "#2CF0D6" : "#2F2F2F"} />
          <stop offset="1" stop-color={isDark  ? "#22CE77" : "#2F2F2F"} />
        </linearGradient>
        <clipPath id="clip0_1626_1462">
          <rect width="20" height="20" fill="red" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default Icon;
