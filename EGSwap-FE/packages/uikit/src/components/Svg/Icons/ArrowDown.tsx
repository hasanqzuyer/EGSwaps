import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";
import { useTheme } from "@pancakeswap/hooks";
interface ArrowDownProps extends SvgProps {
}

const Icon: React.FC<React.PropsWithChildren<ArrowDownProps>> = ({ ...props }) => {
  const { isBlue } = useTheme();
  return (
    <svg width="29" height="28" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.727783" width="27.8183" height="27.8183" rx="13.9091" fill="url(#paint0_linear_1626_1851)" />
      <path
        d="M15.5643 17.1664V6.25928H13.2461V17.1664H9.7688L14.4052 21.7911L19.0416 17.1664H15.5643ZM15.5643 17.1664V6.25928H13.2461V17.1664H9.7688L14.4052 21.7911L19.0416 17.1664H15.5643Z"
        fill="white"
      />
      <defs>
        <linearGradient
          id="paint0_linear_1626_1851"
          x1="0.727783"
          y1="13.9091"
          x2="28.5461"
          y2="13.9091"
          gradientUnits="userSpaceOnUse"
        >
          {isBlue ? <stop stop-color="#6630FF" /> : <stop stop-color="#2CF0D6" />}
          {isBlue ? <stop offset="1" stop-color="#5900C9" /> : <stop offset="1" stop-color="#22CE77" />}
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Icon;
