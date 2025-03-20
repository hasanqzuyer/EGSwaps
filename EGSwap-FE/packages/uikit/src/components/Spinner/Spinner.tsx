import React from "react";
import { Image, Box } from "@pancakeswap/uikit";
import { SpinnerProps } from "./types";

const Spinner: React.FC<React.PropsWithChildren<SpinnerProps>> = ({ size = 128 }) => {
  return (
    <Box width={size*2} height={size * 2} position="relative">
      <Image
        width={size*2}
        height={size * 2}
        // src="https://assets.pancakeswap.finance/web/pancake-3d-spinner-v2.gif"
        src="/images/logo-egswap-light.png"
        alt="eg-3d-spinner"
      />
    </Box>
  );
};

export default Spinner;
