import React, { useEffect, useState } from "react";
import { usePopper } from "react-popper";
import styled from "styled-components";
import { useTheme } from "@pancakeswap/hooks";
import { Box, Flex } from "../../../../components/Box";
import { ChevronDownIcon } from "../../../../components/Svg";
import { UserMenuProps, variants } from "./types";
import MenuIcon from "./MenuIcon";
import { UserMenuItem } from "./styles";

export const StyledUserMenu = styled(Flex)`
  align-items: center;
  background: linear-gradient(90deg, #2cf0d6 -10%, #22ce77 110%);
  border-radius: 16px;
  box-shadow: inset 0px -2px 0px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: inline-flex;
  height: 32px;
  padding-left: 32px;
  padding-right: 8px;
  position: relative;
  color: #fff;
  &:hover {
    opacity: 0.65;
  }
`;

export const LabelText = styled.div`
  color: ${({ theme }) => theme.colors.text};
  display: none;
  font-weight: 600;

  ${({ theme }) => theme.mediaQueries.sm} {
    display: block;
    margin-left: 8px;
    margin-right: 4px;
  }
  color: #fff;
`;

const Menu = styled.div<{ isOpen: boolean; isDark?: boolean }>`
  background-color: ${({ isDark }) => (isDark ? "#181818" : "#f4f4f4")};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 16px;
  padding-bottom: 4px;
  padding-top: 4px;
  pointer-events: auto;
  width: 280px;
  visibility: visible;
  z-index: 1001;

  ${({ isOpen }) =>
    !isOpen &&
    `
    pointer-events: none;
    visibility: hidden;
  `}

  ${UserMenuItem}:first-child {
    border-radius: 8px 8px 0 0;
  }

  ${UserMenuItem}:last-child {
    border-radius: 0 0 8px 8px;
  }
`;

const UserMenu: React.FC<UserMenuProps> = ({
  account,
  text,
  avatarSrc,
  avatarClassName,
  variant = variants.DEFAULT,
  children,
  disabled,
  placement = "bottom-end",
  recalculatePopover,
  ...props
}) => {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [targetRef, setTargetRef] = useState<HTMLDivElement | null>(null);
  const [tooltipRef, setTooltipRef] = useState<HTMLDivElement | null>(null);
  const accountEllipsis = account ? `${account.substring(0, 2)}...${account.substring(account.length - 4)}` : null;
  const { styles, attributes, update } = usePopper(targetRef, tooltipRef, {
    strategy: "fixed",
    placement,
    modifiers: [{ name: "offset", options: { offset: [0, 0] } }],
  });

  // recalculate the popover position
  useEffect(() => {
    if (recalculatePopover && isOpen && update) update();
  }, [isOpen, update, recalculatePopover]);

  useEffect(() => {
    const showDropdownMenu = () => {
      setIsOpen(true);
    };

    const hideDropdownMenu = (evt: MouseEvent | TouchEvent) => {
      const target = evt.target as Node;
      if (target && !tooltipRef?.contains(target)) {
        setIsOpen(false);
        evt.stopPropagation();
      }
    };

    targetRef?.addEventListener("mouseenter", showDropdownMenu);
    targetRef?.addEventListener("mouseleave", hideDropdownMenu);

    return () => {
      targetRef?.removeEventListener("mouseenter", showDropdownMenu);
      targetRef?.removeEventListener("mouseleave", hideDropdownMenu);
    };
  }, [targetRef, tooltipRef, setIsOpen]);
  return (
    <Flex alignItems="center" height="100%" ref={setTargetRef} {...props}>
      <StyledUserMenu
        onTouchStart={() => {
          setIsOpen((s) => !s);
        }}
      >
        {avatarSrc ? (
          <MenuIcon className={avatarClassName} avatarSrc={avatarSrc} variant={variant} />
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5 text-white transition-transform group-hover:scale-110"
          >
            <path
              d="M21.91 5.636H3.726a.91.91 0 0 1 0-1.818h15.455a.909.909 0 1 0 0-1.818H3.727A2.73 2.73 0 0 0 1 4.727v14.546A2.73 2.73 0 0 0 3.727 22H21.91a1.82 1.82 0 0 0 1.818-1.818V7.455a1.82 1.82 0 0 0-1.818-1.819Zm0 14.546H3.726a.91.91 0 0 1-.909-.91V7.3c.292.103.6.156.91.156h18.181v12.727Zm-5.456-6.364a1.363 1.363 0 1 1 2.727 0 1.363 1.363 0 0 1-2.727 0Z"
              fill="#fff"
            />
          </svg>
        )}
        <LabelText title={typeof text === "string" ? text || account : account}>{text || accountEllipsis}</LabelText>
        {!disabled && <ChevronDownIcon color="#fff" width="24px" />}
      </StyledUserMenu>
      {!disabled && (
        <Menu style={styles.popper} ref={setTooltipRef} {...attributes.popper} isOpen={isOpen} isDark={isDark}>
          <Box onClick={() => setIsOpen(false)}>{children?.({ isOpen })}</Box>
        </Menu>
      )}
    </Flex>
  );
};

export default UserMenu;
