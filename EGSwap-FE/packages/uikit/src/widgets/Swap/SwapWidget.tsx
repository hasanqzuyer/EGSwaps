import { ButtonProps, IconButton } from "../../components/Button";
import { ArrowDownIcon } from "../../components/Svg";
import { switchButtonClass, iconDownClass, iconUpDownClass } from "./SwapWidget.css";
import { CurrencyInputPanel } from "./CurrencyInputPanel";
import { CurrencyInputHeader, CurrencyInputHeaderSubTitle, CurrencyInputHeaderTitle } from "./CurrencyInputHeader";
import { SwapPage } from "./Page";
import { SwapFooter } from "./Footer";
import { SwapInfo, SwapInfoLabel } from "./SwapInfo";
import { TradePrice } from "./TradePrice";

const SwapSwitchButton = (props: ButtonProps) => (
  <IconButton
    className={"hover:rotate-180 transition-transform duration-700 ease-in-out"}
    style={{ backgroundColor: "transparent" }}
    variant="light"
    scale="sm"
    {...props}
  >
    <ArrowDownIcon className={iconDownClass} color="#fff" />
  </IconButton>
);

const Swap = {
  SwitchButton: SwapSwitchButton,
  CurrencyInputHeaderTitle,
  CurrencyInputHeaderSubTitle,
  CurrencyInputHeader,
  CurrencyInputPanel,
  Page: SwapPage,
  Footer: SwapFooter,
  Info: SwapInfo,
  InfoLabel: SwapInfoLabel,
  TradePrice,
};

export { Swap };
