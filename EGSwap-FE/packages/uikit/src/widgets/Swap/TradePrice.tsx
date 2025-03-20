import { Price, Currency } from "@pancakeswap/swap-sdk-core";
import { useState } from "react";
import { useTheme } from "@pancakeswap/hooks";
import { Text } from "../../components/Text";

interface TradePriceProps {
  price?: Price<Currency, Currency>;
}

export function TradePrice({ price }: TradePriceProps) {
  const [showInverted, setShowInverted] = useState<boolean>(false);
  const formattedPrice = showInverted ? price?.toSignificant(6) : price?.invert()?.toSignificant(6);
  const { isDark, isBlue } = useTheme();

  const show = Boolean(price?.baseCurrency && price?.quoteCurrency);

  const darkStyle = {
    backgroundImage: isBlue ? "linear-gradient(180deg, #8B5FFF 0%, #7A33FF 100%)" : "linear-gradient(90deg, #2CF0D6 0%, #22CE77 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };
  const lightStyle = {
    color: "#8c8c8c",
  };

  return (
    <Text style={isDark || isBlue ? darkStyle : lightStyle} className="items-center justify-center flex">
      {show ? (
        <>
          {`1 ${showInverted ? price?.baseCurrency?.symbol : price?.quoteCurrency?.symbol} > `}
          {`${formattedPrice} ${showInverted ? price?.quoteCurrency?.symbol : price?.baseCurrency?.symbol}`}
        </>
      ) : (
        "-"
      )}
    </Text>
  );
}
