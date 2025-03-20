import { HelpIcon, useTooltip, Box, BoxProps, Placement } from "@pancakeswap/uikit";
import styled from "styled-components";
import { useTheme } from '@pancakeswap/hooks'

interface Props extends BoxProps {
  text: string | React.ReactNode;
  placement?: Placement;
  size?: string;
}

const QuestionWrapper = styled.div`
  :hover,
  :focus {
    opacity: 0.7;
  }
`;

export const QuestionHelper: React.FC<React.PropsWithChildren<Props>> = ({
  text,
  placement = "right-end",
  size = "16px",
  ...props
}) => {
  const { targetRef, tooltip, tooltipVisible } = useTooltip(text, { placement });
  const { isBlue } = useTheme()

  return (
    <Box {...props}>
      {tooltipVisible && tooltip}
      <QuestionWrapper ref={targetRef}>
        <HelpIcon width={size} isBlue={isBlue} />
      </QuestionWrapper>
    </Box>
  );
};
