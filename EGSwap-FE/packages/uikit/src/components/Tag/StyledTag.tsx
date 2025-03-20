import styled, { DefaultTheme } from "styled-components";
import { space, variant, typography } from "styled-system";
import { Colors } from "../../theme/types";
import { scaleVariants, styleVariants } from "./theme";
import { TagProps, variants } from "./types";

interface ThemedProps extends TagProps {
  theme: DefaultTheme;
}

const getOutlineStyles = ({ outline, theme, variant: variantKey = variants.PRIMARY }: ThemedProps) => {
  if (outline) {
    const themeColorKey = styleVariants[variantKey].backgroundColor as keyof Colors;
    const color = theme.colors[themeColorKey];

    return `
      color: ${color};
      background: ${theme.isDark ? "transparent" : "#BADAE4"};
      border: 1px solid ${color};
    `;
  }

  return "";
};

export const CustomStyledTag = styled.div<ThemedProps>`
  align-items: center;
  border-radius: 16px;
  color: #ffffff;
  display: inline-flex;
  font-weight: 400;
  white-space: nowrap;

  & > svg {
    fill: currentColor;
  }

  ${({ textTransform }) => textTransform && `text-transform: ${textTransform};`}

  ${variant({
    prop: "scale",
    variants: scaleVariants,
  })}
  ${variant({
    variants: styleVariants,
  })}
  ${space}
  ${typography}

  ${getOutlineStyles}
`;

export const StyledTag = styled(CustomStyledTag)`
  justify-content: center;
  border-radius: 6px;
  color: ${({ theme }) => (theme.isDark ? "#495B8D" : "#fff")};
  background: ${({ theme }) => (theme.isDark ? "transparent" : "#BADAE4")} !important;
  border: 1px solid ${({ theme }) => (theme.isDark ? "#495B8D" : "#BADAE4")};
  font-size: 16px !important;
  width: 120px;
  height: 36px !important;
`;

export default null;
