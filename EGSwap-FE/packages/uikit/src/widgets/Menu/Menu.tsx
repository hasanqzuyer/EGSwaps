import { useIsMounted } from "@pancakeswap/hooks";
import { AtomBox } from "@pancakeswap/ui/components/AtomBox";
import throttle from "lodash/throttle";
import React, { useEffect, useRef, useState, useMemo, Fragment } from "react";
import styled from "styled-components";
import { Transition } from "@headlessui/react";
import BottomNav from "../../components/BottomNav";
import { Box } from "../../components/Box";
import Flex from "../../components/Box/Flex";
import CakePrice from "../../components/CakePrice/CakePrice";
import Footer from "../../components/Footer";
import NewFooter from "../../components/NewFooter";
import LangSelector from "../../components/LangSelector/LangSelector";
import MenuItems from "../../components/MenuItems/MenuItems";
import { SubMenuItems } from "../../components/SubMenuItems";
import { useMatchBreakpoints } from "../../contexts";
import Logo from "./components/Logo";
import { MENU_HEIGHT, MOBILE_MENU_HEIGHT, TOP_BANNER_HEIGHT, TOP_BANNER_HEIGHT_MOBILE } from "./config";
import { MenuContext } from "./context";
import { NavProps } from "./types";
import Navbar from "./Navbar";
import { useRouter } from 'next/router'

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  display: grid;
  // grid-template-rows: auto 1fr;
`;

const StyledNav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: ${MENU_HEIGHT}px;
  background-color: #213266;
  color: #fff;
  transform: translate3d(0, 0, 0);
  padding: 0px 20px;
  font-family: Poppins, sans-serif;
  font-weight: bold;

  & a {
    font-family: Poppins, sans-serif;
    font-weight: bold;
  }

  .logo-left {
    margin: 4px 0px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

const FixedContainer = styled.div<{ showMenu: boolean; height: number }>`
  position: fixed;
  top: ${({ showMenu, height }) => (showMenu ? 0 : `-${height}px`)};
  left: 0;
  transition: top 0.2s;
  height: ${({ height }) => `${height}px`};
  width: 100%;
  z-index: 20;
`;

const TopBannerContainer = styled.div<{ height: number }>`
  height: ${({ height }) => `${height}px`};
  min-height: ${({ height }) => `${height}px`};
  max-height: ${({ height }) => `${height}px`};
  width: 100%;
`;

const SubMenu = styled.div`
  position: absolute !important;
  display: flex;
  flex-wrap: wrap;
  background-color: #213266 !important;
  z-index: 2;
  left: -21px;
  top: 50px;
  padding: 0px !important;
  margin: 0px !important;

  & a {
    font-family: Poppins, sans-serif;
    padding: 10px;
  }
`;

const MenuContainer = styled(Flex)`
  width: auto;
  flex: 1;
  justify-content: space-between;
`;

const MenuLinks = styled.div`
  font-family: Poppins, sans-serif;
  display: flex;
  font-size: 14px;
  font-weight: bold;
  flex-wrap: nowrap;
  justify-content: right;
  position: relative;

  & div:nth-child(1),
  & div:nth-child(6),
  & a {
    font-family: Poppins, sans-serif;
    margin: 0px 20px;
    padding: 20px 0px;
    position: relative;
  }

  @media (max-width: 1024px) {
    display: none;
  }
`;

const BodyWrapper = styled(Box)`
  position: relative;
  display: flex;
  max-width: 100vw;
`;

const Inner = styled.div`
  flex-grow: 1;
  transition: margin-top 0.2s, margin-left 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translate3d(0, 0, 0);
  max-width: 100%;
`;

const Menu: React.FC<React.PropsWithChildren<NavProps>> = ({
  linkComponent = "a",
  banner,
  rightSide,
  isDark,
  toggleTheme,
  currentLang,
  setLang,
  cakePriceUsd,
  links,
  subLinks,
  footerLinks,
  activeItem,
  activeSubItem,
  langs,
  buyCakeLabel,
  buyCakeLink,
  children,
}) => {
  const { isMobile } = useMatchBreakpoints();
  const isMounted = useIsMounted();
  const [showMenu, setShowMenu] = useState(true);
  const [show, setShow] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const refPrevOffset = useRef(typeof window === "undefined" ? 0 : window.pageYOffset);
  const [embedSwap, setEmbedSwap] = useState(false);
  const router = useRouter();

  const topBannerHeight = isMobile ? TOP_BANNER_HEIGHT_MOBILE : TOP_BANNER_HEIGHT;

  // const totalTopMenuHeight = isMounted && banner ? MENU_HEIGHT + topBannerHeight : MENU_HEIGHT;
  const totalTopMenuHeight = MENU_HEIGHT + topBannerHeight;
  useEffect(() => {
    if (router.pathname == "/embed-swap") {
      setEmbedSwap(true);
      setShowMenu(false);
    } else {
      setEmbedSwap(false);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentOffset = window.pageYOffset;
      const isBottomOfPage = window.document.body.clientHeight === currentOffset + window.innerHeight;
      const isTopOfPage = currentOffset === 0;
      // Always show the menu when user reach the top
      if (isTopOfPage && !embedSwap) {
        setShowMenu(true);
      }
      // Avoid triggering anything at the bottom because of layout shift
      else if (!isBottomOfPage) {
        if ((currentOffset < refPrevOffset.current || currentOffset <= totalTopMenuHeight) && !embedSwap) {
          // Has scroll up
          setShowMenu(true);
        } else {
          // Has scroll down
          setShowMenu(false);
        }
      }
      refPrevOffset.current = currentOffset;
    };
    const throttledHandleScroll = throttle(handleScroll, 200);

    window.addEventListener("scroll", throttledHandleScroll);
    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
    };
  }, [totalTopMenuHeight, embedSwap]);

  // Find the home link if provided
  const homeLink = links.find((link) => link.label === "Home");

  const subLinksWithoutMobile = subLinks?.filter((subLink) => !subLink.isMobileOnly);
  const subLinksMobileOnly = subLinks?.filter((subLink) => subLink.isMobileOnly);
  const providerValue = useMemo(() => ({ linkComponent }), [linkComponent]);
  const open = () => setShow(true);
  const close = () => setShow(false);

  const openMore = () => setShowMore(true);
  const closeMore = () => setShowMore(false);

  const noop = () => {
    return true;
  };

  return (
    <MenuContext.Provider value={providerValue}>
      <AtomBox
        asChild
        minHeight={{
          xs: "auto",
          md: "100vh",
        }}
      >
        <Wrapper style={{ overflow: "hidden" }}>
          <FixedContainer showMenu={showMenu} height={MENU_HEIGHT}>
            {!embedSwap && <Navbar links={[]} rightSide={rightSide} /> }
            {/* {banner && isMounted && <TopBannerContainer height={topBannerHeight}>{banner}</TopBannerContainer>} */}
            {/* <StyledNav>
              <MenuContainer>
                <div className="logo-left">
                  <img src="/images/logo-egswap-light.png" alt="logo" style={{ width: "42px", height: "auto" }} />
                  <a href="/">EGSwap</a>
                </div>
                <MenuLinks>
                  <div
                    role="button"
                    tabIndex={0}
                    className="font-bold"
                    onMouseEnter={open}
                    onMouseLeave={close}
                    onClick={open}
                    onKeyDown={noop}
                  >
                    Trade
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 translate-y-1"
                      show={show}
                    >
                      <SubMenu>
                        <a href="/swap" onMouseEnter={open} onMouseLeave={close}>
                          {" "}
                          Swap{" "}
                        </a>
                        <a href="/liquidity" onMouseEnter={open} onMouseLeave={close}>
                          {" "}
                          Liquidity{" "}
                        </a>
                        <a href="/pools" onMouseEnter={open} onMouseLeave={close}>
                          {" "}
                          Earn{" "}
                        </a>
                      </SubMenu>
                    </Transition>
                  </div>
                  <a href="https://egtoken.io" target="_blank" rel="noreferrer">
                    {" "}
                    EG
                  </a>
                  <a href="https://gatorgang.cc" target="_blank" rel="noreferrer">
                    {" "}
                    NFT
                  </a>
                  <a href="https://burn.party" target="_blank" rel="noreferrer">
                    {" "}
                    Burn
                  </a>
                  <a href="https://headstails.xyz" target="_blank" rel="noreferrer">
                    {" "}
                    BetFi
                  </a>
                  <div
                    role="button"
                    tabIndex={0}
                    className="font-bold"
                    onMouseEnter={openMore}
                    onMouseLeave={closeMore}
                    onClick={openMore}
                    onKeyDown={noop}
                  >
                    More
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 translate-y-1"
                      show={showMore}
                    >
                      <SubMenu>
                        <a href="/info"> Info </a>
                        <a href="/tbd" onMouseEnter={openMore} onMouseLeave={closeMore}>
                          {" "}
                          Docs{" "}
                        </a>
                      </SubMenu>
                    </Transition>
                  </div>
                  {rightSide}
                </MenuLinks>
              </MenuContainer>
              <Flex>
                <AtomBox mr="12px" display={{ xs: "none", lg: "block" }}>
                  <CakePrice showSkeleton={false} cakePriceUsd={cakePriceUsd} />
                </AtomBox>
                <Box mt="4px">
                  <LangSelector
                    currentLang={currentLang}
                    langs={langs}
                    setLang={setLang}
                    buttonScale="xs"
                    color="textSubtle"
                    hideLanguage
                  />
                </Box>
                {rightSide}
              </Flex>
            </StyledNav> */}
          </FixedContainer>
          {/* {subLinks ? (
            <Flex justifyContent="space-around" overflow="hidden">
              <SubMenuItems
                items={subLinksWithoutMobile}
                mt={`${totalTopMenuHeight + 1}px`}
                activeItem={activeSubItem}
              />

              {subLinksMobileOnly && subLinksMobileOnly?.length > 0 && (
                <SubMenuItems
                  items={subLinksMobileOnly}
                  mt={`${totalTopMenuHeight + 1}px`}
                  activeItem={activeSubItem}
                  isMobileOnly
                />
              )}
            </Flex>
          ) : (
            <div />
          )} */}
          <BodyWrapper>
            <Inner>{children}</Inner>
          </BodyWrapper>
        </Wrapper>
      </AtomBox>
      {!embedSwap ? <NewFooter /> : <></>}
      {/* <Footer
        items={footerLinks}
        isDark={isDark}
        toggleTheme={toggleTheme}
        langs={langs}
        setLang={setLang}
        currentLang={currentLang}
        cakePriceUsd={cakePriceUsd}
        buyCakeLabel={buyCakeLabel}
        buyCakeLink={buyCakeLink}
        mb={[`${MOBILE_MENU_HEIGHT}px`, null, "0px"]}
      /> */}
      {/* <AtomBox display={{ xs: "block", md: "none" }}>
        <BottomNav items={links} activeItem={activeItem} activeSubItem={activeSubItem} />
      </AtomBox> */}
    </MenuContext.Provider>
  );
};

export default Menu;
``;
