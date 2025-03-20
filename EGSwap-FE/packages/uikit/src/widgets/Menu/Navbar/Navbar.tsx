import { Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import styled from "styled-components";
import MobileMenu from "./MobileMenu";

const Container = styled.div`
  background-color: #242424;
  padding: 0px 20px;
  display: flex;
  flex-wrap: nowrap;
  color: white;
  font-family: Poppins, sans-serif;
  font-weight: bold;
  z-index: 100;
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

const MenuLinks = styled.div`
  font-family: Poppins, sans-serif;
  display: flex;
  font-size: 14px;
  font-weight: bold;
  flex-wrap: nowrap;
  justify-content: right;
  align-items: center;
  position: relative;
  margin-left: auto;
  & div:nth-child(1),
  & div:nth-child(2),
  & div:last-child,
  & > a {
    font-family: Poppins, sans-serif;
    margin: 0px 20px;
    padding: 20px 0px;
    position: relative;
  }

  @media (max-width: 1024px) {
    display: none;
  }
`;

const SubMenu = styled.div`
  position: absolute !important;
  display: flex;
  flex-wrap: wrap;
  background-color: #242424 !important;
  z-index: 2;
  left: -21px;
  top: 50px;
  padding: 0px !important;
  margin: 0px !important;

  & a {
    font-family: Poppins, sans-serif;
    padding: 10px 20px;
    white-space: nowrap;
    width: 100%;
    &:hover {
      text-shadow: 0 0 4px #fff;
    }
  }
`;

const MainMenu = styled.a`
  &:hover {
    text-shadow: 0 0 4px #fff;
  }
`;

const Navbar: React.FC<{ links: string[]; rightSide: any }> = ({ links, rightSide }) => {
  const [show, setShow] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showEarn, setShowEarn] = useState(false);

  const open = () => setShow(true);
  const close = () => setShow(false);

  const openMore = () => setShowMore(true);
  const closeMore = () => setShowMore(false);

  const openEarn = () => setShowEarn(true);
  const closeEarn = () => setShowEarn(false);

  const noop = () => {
    return true;
  };

  return (
    <Container id="navbar">
      <div className="logo-left">
        <a href="/">
          <img src="/images/logo-egswap-light.png" alt="logo" style={{ width: "42px", height: "auto" }} />
        </a>
        <a href="/" className="md:hidden">
          EGSwap
        </a>
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
                Swap
              </a>
              {/* <a href="/egspectre" onMouseEnter={open} onMouseLeave={close}>
                Anon Swap
              </a> */}
              <a href="/perp" onMouseEnter={open} onMouseLeave={close}>
                Perpetual
              </a>
              <a href="/liquidity" onMouseEnter={open} onMouseLeave={close}>
                Liquidity
              </a>
            </SubMenu>
          </Transition>
        </div>
        <div
          role="button"
          tabIndex={0}
          className="font-bold"
          onMouseEnter={openEarn}
          onMouseLeave={closeEarn}
          onClick={openEarn}
          onKeyDown={noop}
        >
          Earn
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
            show={showEarn}
          >
            <SubMenu>
              <a href="/pools" onMouseEnter={openEarn} onMouseLeave={closeEarn}>
                {" "}
                Pools
              </a>
            </SubMenu>
          </Transition>
        </div>
        <MainMenu href="https://gatorgang.cc" target="_blank" rel="noreferrer">
          {" "}
          NFT
        </MainMenu>
        <MainMenu href="/ramp">
          {" "}
          EGRamp
        </MainMenu>
        <MainMenu href="/egspectre">
          {" "}
          EGSpectre
        </MainMenu>
        <MainMenu href="/crypto-news">
          {" "}
          Crypto News
        </MainMenu>
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
              {/* <a href="/info" target="_blank" rel="noreferrer" onMouseEnter={openMore} onMouseLeave={closeMore}>
                {" "}
                Info{" "}
              </a> */}
              <a href="https://docs.egswap.exchange/" onMouseEnter={openMore} onMouseLeave={closeMore}>
                {" "}
                Docs{" "}
              </a>
            </SubMenu>
          </Transition>
        </div>
      </MenuLinks>
      <div className="flex items-center md:ml-auto">{rightSide}</div>
      <MobileMenu />
    </Container>
  );
};

export default Navbar;
