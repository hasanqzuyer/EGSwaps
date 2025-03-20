import React, { PropsWithChildren, useRef } from "react";
import { useTheme } from "styled-components";
import Heading from "../../components/Heading/Heading";
import getThemeValue from "../../util/getThemeValue";
import { ModalBody, ModalHeader, ModalTitle, ModalContainer, ModalCloseButton, ModalBackButton } from "./styles";
import { ModalProps, ModalWrapperProps } from "./types";
import { useMatchBreakpoints } from "../../contexts";
import { Text } from "../../components";

export const MODAL_SWIPE_TO_CLOSE_VELOCITY = 300;

export const ModalWrapper = ({
  children,
  onDismiss,
  minWidth,
  hideCloseButton,
  ...props
}: PropsWithChildren<ModalWrapperProps>) => {
  const { isMobile } = useMatchBreakpoints();
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    // @ts-ignore
    <ModalContainer
      drag={isMobile && !hideCloseButton ? "y" : false}
      dragConstraints={{ top: 0, bottom: 600 }}
      dragElastic={{ top: 0 }}
      dragSnapToOrigin
      onDragStart={() => {
        if (wrapperRef.current) wrapperRef.current.style.animation = "none";
      }}
      onDragEnd={(e, info) => {
        if (info.velocity.y > MODAL_SWIPE_TO_CLOSE_VELOCITY && onDismiss) onDismiss();
      }}
      ref={wrapperRef}
      $minWidth={minWidth}
      {...props}
    >
      {children}
    </ModalContainer>
  );
};

const Modal: React.FC<React.PropsWithChildren<ModalProps>> = ({
  title,
  onDismiss,
  onBack,
  children,
  hideCloseButton = false,
  bodyPadding = "24px",
  headerBackground = "transparent",
  minWidth = "320px",
  pool = false,
  closeButton,
  ...props
}) => {
  const theme = useTheme();
  const darkStyle = {
    backgroundImage: "linear-gradient(90deg, #2CF0D6 0%, #22CE77 100%)",
    backgroundClip: "text",
    color: "transparent",
    WebkitBackgroundClip: "text",
  };
  const blueStyle = {
    backgroundImage: "linear-gradient(90deg, #2CF0D6 0%, #22CE77 100%)",
    backgroundClip: "text",
    color: "transparent",
    WebkitBackgroundClip: "text",
  };
  const lightStyle = {
    color: "#2f2f2f",
  };
  return (
    <ModalWrapper
      minWidth={minWidth}
      onDismiss={onDismiss}
      hideCloseButton={hideCloseButton}
      {...props}
      borderRadius={pool ? 12 : 32}
    >
      <ModalHeader
        style={{ paddingTop: 10, background: headerBackground, ...(pool && { padding: "16px 16px", borderBottom: 0 }) }}
      >
        <ModalTitle>
          {onBack && <ModalBackButton onBack={onBack} />}
          {!pool ? (
            <span className="text-[22px] font-bold" style={theme.isDark ? darkStyle : theme.isDark ? blueStyle: lightStyle}>
              {title}
            </span>
          ) : (
            <Text color="text" className="text-[36px] font-bold ">
              {title}
            </Text>
          )}
        </ModalTitle>
        {!hideCloseButton && closeButton ? closeButton : <ModalCloseButton onDismiss={onDismiss} />}
      </ModalHeader>
      <ModalBody p={bodyPadding} background={getThemeValue(theme, "colors.pool.poolStakeModalBody")}>
        {children}
      </ModalBody>
    </ModalWrapper>
  );
};

export default Modal;
