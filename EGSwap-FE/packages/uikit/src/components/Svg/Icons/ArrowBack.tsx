import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";
import { useTheme } from "@pancakeswap/hooks";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  const { isBlue } = useTheme();
  return (
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17 7H1M1 7L7 1M1 7L7 13"
        stroke={isBlue ? "#6630FF" : "#2CF0D6"}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default Icon;
