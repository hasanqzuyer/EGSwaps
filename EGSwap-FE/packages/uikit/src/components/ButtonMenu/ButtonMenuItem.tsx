import styled, { useTheme } from "styled-components";
import { PolymorphicComponent } from "../../util/polymorphic";
import Button from "../Button/Button";
import { BaseButtonProps, variants } from "../Button/types";
import { ButtonMenuItemProps } from "./types";

interface InactiveButtonProps extends BaseButtonProps {
  forwardedAs: BaseButtonProps["as"];
}

const InactiveButton: PolymorphicComponent<InactiveButtonProps, "button"> = styled(Button)<InactiveButtonProps>`
  background-color: transparent;
  color: ${({ theme, variant }) => (variant === variants.PRIMARY ? theme.colors.text : theme.colors.text)};
  &:hover:not(:disabled):not(:active) {
    background-color: transparent;
  }
`;

const ButtonMenuItem: PolymorphicComponent<ButtonMenuItemProps, "button"> = ({
  isActive = false,
  variant = variants.NEWPRIMARY,
  as,
  pool,
  ...props
}: ButtonMenuItemProps) => {
  const theme = useTheme();
  if (!isActive) {
    return (
      <InactiveButton
        forwardedAs={as}
        variant={variant}
        {...props}
        style={pool ? { color: theme.isBlue ? "#9A6AFF" : "#22CE77", borderRadius: 6, border:theme.isBlue ? "1px  solid #9A6AFF" : !theme.isDark ? "1px  solid #22CE77" : "none" } : {}}
      />
    );
  }

  return (
    <Button
      as={as}
      variant={variant}
      {...props}
      style={
        pool && {
          color: "#fff",
          background: "#22CE77 !important",
          borderRadius: 6,
          border: theme.isBlue ? "1px  solid #9A6AFF" : !theme.isDark ? "1px  solid #22CE77" : "none",
        }
      }
    />
  );
};

export default ButtonMenuItem;
