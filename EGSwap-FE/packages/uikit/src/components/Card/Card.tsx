import React from "react";
import { StyledCard, StyledCardInner } from "./StyledCard";
import { CardProps } from "./types";

const Card: React.FC<React.PropsWithChildren<CardProps>> = ({ ribbon, children, background, ...props }) => {
  return (
    <StyledCard {...props}>
      <StyledCardInner background={background} hasCustomBorder={!!props.borderBackground} {...props}>
        {ribbon}
        {children}
      </StyledCardInner>
    </StyledCard>
  );
};
export default Card;
