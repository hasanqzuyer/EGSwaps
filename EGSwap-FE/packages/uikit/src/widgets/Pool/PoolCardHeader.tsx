import { ReactNode } from "react";
import styled from "styled-components";
import getThemeValue from "../../util/getThemeValue";
import { CardHeader, Flex, Heading, Text } from "../../components";

const Wrapper = styled(CardHeader)<{ isFinished?: boolean; background: string }>`
  background: ${({ theme }) => theme.colors.pool.poolCardHeader};

  border-radius: ${({ theme }) => `12px 12px 0 0`};
`;

export const PoolCardHeader: React.FC<
  React.PropsWithChildren<{
    isFinished?: boolean;
    isStaking?: boolean;
  }>
> = ({ isFinished = false, isStaking = false, children }) => {
  const background = isStaking ? "gradientBubblegum" : "gradientCardHeader";

  return (
    <Wrapper isFinished={isFinished} background={background}>
      <Flex alignItems="center" justifyContent="space-between">
        {children}
      </Flex>
    </Wrapper>
  );
};

export const PoolCardHeaderTitle: React.FC<
  React.PropsWithChildren<{ isFinished?: boolean; title: ReactNode; subTitle: ReactNode }>
> = ({ isFinished, title, subTitle }) => {
  return (
    <Flex flexDirection="column" >
      <Heading color={isFinished ? "text" : "text"} scale="lg">
        {title}
      </Heading>
      <Text fontSize="14px" color={isFinished ? "textDisabled" : "#495B8D"}>
        {subTitle}
      </Text>
    </Flex>
  );
};
