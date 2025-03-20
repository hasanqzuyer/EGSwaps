import styled, { DefaultTheme } from "styled-components";
import { Text } from "../Text";
import { BadgeProps, variants } from "./type";
import { useTheme } from "@pancakeswap/hooks";
import { useMatchBreakpoints } from "../../contexts";

const BadgeWrapper = styled.div<{ variant: string }>`
  border-radius: 6px;
  padding: 1px;
  background-image: ${({ variant }) => `linear-gradient(
    90deg,
    ${variant === "type1" ? "#FFF95E" : "#75E1B4"} 0%,
    ${variant === "type1" ? "#D62946" : "#64ACFF"} 100%
  )`};
`;

const BadgeBody = styled.div<{ isDark: boolean; variant: string }>`
  background: ${({ isDark, variant }) =>
    isDark
      ? "#181818"
      : `linear-gradient(90deg, ${variant === "type1" ? "#FFF55D" : "#75E1B4"} -1.71%, ${
          variant === "type1" ? "#D62946" : "#64ACFF"
        } 99.75%)`};
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
`;

const Badge = ({ title, variants }: { title: string; variants: string }) => {
  const { isDark, isBlue } = useTheme();
  const { isMobile } = useMatchBreakpoints();
  const darkStyle = {
    backgroundImage: `linear-gradient(
      90deg,
      ${variants === "type1" ? "#FFF95E" : "#75E1B4"} 0%,
      ${variants === "type1" ? "#D62946" : "#64ACFF"} 100%
    )`,
    backgroundClip: "text",
    color: "transparent",
    WebkitBackgroundClip: "text",
  };
  const lightStyle = {
    color: "white",
  };
  return (
    <BadgeWrapper variant={variants}>
      <BadgeBody isDark={isDark || isBlue} variant={variants}>
        <Text fontSize={isMobile ? 14 : 16} style={isDark || isBlue ? darkStyle : lightStyle}>
          {title}
        </Text>
      </BadgeBody>
    </BadgeWrapper>
  );
};

export default Badge;
