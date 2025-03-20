import { AtomBox } from "@pancakeswap/ui";
import { ReactNode } from "react";
import { Heading } from "../../components/Heading";
import { Text } from "../../components/Text";

interface Props {
  title: ReactNode;
  subtitle: ReactNode;
}

export const CurrencyInputHeader = ({ title, subtitle }: Props) => {
  return (
    <div className="px-6 pt-6">
      <AtomBox width="full" alignItems="center" flexDirection="column">
        <AtomBox display="flex" width="full" alignItems="center" justifyContent="space-between">
          {title}
        </AtomBox>
        {subtitle}
      </AtomBox>
    </div>
  );
};

export const CurrencyInputHeaderTitle = ({ children }: { children: ReactNode }) => (
  <Heading as="h2">{children}</Heading>
);
export const CurrencyInputHeaderSubTitle = ({ children }: { children: ReactNode }) => (
  <Text color="textSubtle" fontSize="14px">
    {children}
  </Text>
);
