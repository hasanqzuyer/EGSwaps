import { AtomBox, AtomBoxProps } from "@pancakeswap/ui";
import { ReactNode } from "react";
import { useRouter } from "next/router";
import { SwapFooter } from "./Footer";
import { pageVariants } from "./SwapWidget.css";
import { useTheme } from "@pancakeswap/hooks"; 

type SwapPageProps = AtomBoxProps & {
  removePadding?: boolean;
  hideFooterOnDesktop?: boolean;
  noMinHeight?: boolean;
  helpUrl?: string;
  helpImage?: ReactNode;
  externalText?: string;
  externalLinkUrl?: string;
};

export const SwapPage = ({
  removePadding,
  noMinHeight,
  children,
  hideFooterOnDesktop,
  helpUrl,
  helpImage,
  externalText,
  externalLinkUrl,
  ...props
}: SwapPageProps) => {
  const router = useRouter();
  const routerName = router.route;
  const isSpectrePage = routerName.includes("/egspectre/");
  const isEmbedSwapPage = routerName.includes("/embed-swap");
  const spectreBgStyle = {
    background: "linear-gradient(45deg #E5FDFF 0%, #F1F1FF 100%)",
  };
  const swapBgStyle = { background: "#242424" };
  // const swapBgStyle_embedSwap = { background: "#181818"};
  const { isDark, isBlue } = useTheme();
  const swapBgStyle_embedSwap = isDark ? { background: "#181818"} : isBlue? { background: "#161622"} : { background: "#f4f4f4"};

  return (
    <AtomBox
      className={pageVariants({ removePadding, noMinHeight })}
      {...props}
      style={isSpectrePage ? spectreBgStyle : isEmbedSwapPage ? swapBgStyle_embedSwap : swapBgStyle}
    >
      {children}
      <AtomBox display="flex" flexGrow={1} />
      <AtomBox display={["block", null, null, hideFooterOnDesktop ? "none" : "block"]} width="100%">
        <SwapFooter
          externalText={externalText}
          externalLinkUrl={externalLinkUrl}
          helpUrl={helpUrl}
          helpImage={helpImage}
        />
      </AtomBox>
    </AtomBox>
  );
};
