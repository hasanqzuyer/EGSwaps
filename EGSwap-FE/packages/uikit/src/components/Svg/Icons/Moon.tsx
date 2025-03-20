import React from "react";
import { useTheme } from "@pancakeswap/hooks";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  const { isDark } = useTheme();
  return (
    <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13.9905 7.97765C13.8467 7.9417 13.7029 7.97765 13.577 8.06754C13.1096 8.46304 12.5703 8.78663 11.977 9.00235C11.4198 9.21808 10.8085 9.32594 10.1614 9.32594C8.70521 9.32594 7.3749 8.7327 6.42211 7.77991C5.46932 6.82712 4.87608 5.49681 4.87608 4.04066C4.87608 3.42944 4.98394 2.83619 5.16371 2.29688C5.36146 1.72161 5.64909 1.20027 6.02661 0.750841C6.18841 0.553092 6.15245 0.265458 5.95471 0.103664C5.82887 0.0137778 5.68505 -0.0221765 5.54123 0.0137778C4.01317 0.427252 2.68286 1.34409 1.73008 2.56653C0.81324 3.771 0.273926 5.26311 0.273926 6.88105C0.273926 8.84056 1.06492 10.6203 2.35928 11.9147C3.65363 13.209 5.41539 14 7.39288 14C9.04677 14 10.5748 13.4247 11.7973 12.4719C13.0377 11.5012 13.9366 10.1169 14.3141 8.53495C14.386 8.28327 14.2422 8.03159 13.9905 7.97765Z"
        fill="url(#paint0_linear_1626_1366)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_1626_1366"
          x1="0.273926"
          y1="7"
          x2="14.3326"
          y2="7"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color={isDark ? "#2CF0D6" : "#6B7280"} />
          <stop offset="1" stop-color={isDark ? "#22CE77" : "#6B7280"} />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Icon;
