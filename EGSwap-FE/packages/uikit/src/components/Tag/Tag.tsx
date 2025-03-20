import React from "react";
import { scales, TagProps } from "./types";
import { StyledTag, CustomStyledTag } from "./StyledTag";

const Tag: React.FC<React.PropsWithChildren<TagProps>> = ({
  startIcon,
  endIcon,
  children,
  customTag = false,
  ...props
}) => {
  const ChildrenComponent = () => (
    <>
      {React.isValidElement(startIcon) &&
        React.cloneElement(startIcon, {
          // @ts-ignore
          mr: "16px",
        })}
      {children}
      {React.isValidElement(endIcon) &&
        React.cloneElement(endIcon, {
          // @ts-ignore
          ml: "0.5em",
        })}
    </>
  );
  return customTag ? (
    <CustomStyledTag {...props}>{ChildrenComponent()}</CustomStyledTag>
  ) : (
    <StyledTag {...props}>{ChildrenComponent()}</StyledTag>
  );
};

/* eslint-disable react/default-props-match-prop-types */
Tag.defaultProps = {
  variant: "primary",
  scale: scales.MD,
  outline: false,
};

export default Tag;
