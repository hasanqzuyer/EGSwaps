import styled from "styled-components";
import { ToggleProps, HandleProps, InputProps, ScaleKeys, scales, StyleToggleProps } from "./types";

const scaleKeyValues = {
  sm: {
    handleHeight: "16px",
    handleWidth: "16px",
    handleLeft: "2px",
    handleTop: "2px",
    checkedLeft: "calc(100% - 10px)",
    toggleHeight: "20px",
    toggleWidth: "36px",
  },
  md: {
    handleHeight: "20px",
    handleWidth: "20px",
    handleLeft: "3px",
    handleTop: "2px",
    checkedLeft: "calc(100% - 22px)",
    toggleHeight: "26px",
    toggleWidth: "54px",
  },
  lg: {
    handleHeight: "24px",
    handleWidth: "24px",
    handleLeft: "4px",
    handleTop: "3px",
    checkedLeft: "calc(100% - 27px)",
    toggleHeight: "32px",
    toggleWidth: "65px",
  },
};

const getScale =
  (property: ScaleKeys) =>
  ({ scale = scales.LG }: ToggleProps) => {
    return scaleKeyValues[scale][property];
  };

export const Handle = styled.div<HandleProps>`
  background-color: ${({ theme }) => theme.isBlue ? "#9A6AFF" : theme.toggle.handleBackground};
  border-radius: 50%;
  cursor: pointer;
  height: ${getScale("handleHeight")};
  left: ${getScale("handleLeft")};
  position: absolute;
  top: ${getScale("handleTop")};
  transition: left 200ms ease-in;
  width: ${getScale("handleWidth")};
  z-index: 1;
`;

export const Input = styled.input<InputProps>`
  cursor: pointer;
  opacity: 0;
  height: 100%;
  position: absolute;
  width: 100%;
  z-index: 3;

  &:checked + ${Handle} {
    left: ${getScale("checkedLeft")};
  }

  &:focus + ${Handle} {
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  &:hover + ${Handle}:not(:disabled):not(:checked) {
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
`;

const StyledToggle = styled.div<StyleToggleProps>`
  align-items: center;
  background-color: ${({ theme, $checked, $checkedColor, $defaultColor }) => ($checked ? "#181818" : "#2f2f2f")};
  border-radius: 24px;
  border: 1px solid ${({ theme }) => (theme.isBlue ? "#9A6AFF" : !theme.isDark ? "#000" : "#2CF0D6")};
  box-shadow: ${({ theme }) => theme.shadows.inset};
  cursor: pointer;
  display: inline-flex;
  height: ${getScale("toggleHeight")};
  position: relative;
  transition: background-color 200ms;
  width: ${getScale("toggleWidth")};
`;

export default StyledToggle;
