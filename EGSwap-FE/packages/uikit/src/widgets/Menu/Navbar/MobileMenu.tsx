import React, { Fragment, useState } from "react";
import styled from "styled-components";

import { Transition } from "@headlessui/react";
import { ChevronDownIcon, ChevronUpIcon } from "../../../components";

const Menu = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  @media (min-width: 1024px) {
    display: none;
  }
`;
const DropdownDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Links = styled.div`
  position: absolute;
  padding-top: 20px;
  background-color: #242424;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-flex-wrap: wrap;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  top: 49px;
  z-index: 500;
  text-align: center;
  width: 100%;
  left: 0px;
  height: 100vh;
  flex-grow: 0.6;
  flex-direction: column;
  font-family: Poppins, sans-serif;
  font-weight: bold;

  > div {
    padding: 0px 0px;
    margin-bottom: 40px;
    width: 100%;
    cursor: pointer;

    &:hover {
      background-color: transparent;
    }
  }
`;

const SubMenu = styled.div`
  display: flex;
  flex-wrap: wrap;
  background-color: #242424 !important;
  z-index: 2;
  flex-wrap: wrap;
  margin-top: 10px;

  & a {
    padding: 20px 30px;
    width: 100%;
    font-family: Poppins, sans-serif;
  }
`;

const MainMenu = styled.a`
  &:hover {
    text-shadow: 0 0 4px #fff;
  }
`;

const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [showEarn, setShowEarn] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const open = () => {
    if (show) {
      setShow(false);
    } else {
      setShow(true);
      setShowMore(false);
      setShowEarn(false);
    }
  };

  const openEarn = () => {
    if (showEarn) {
      setShowEarn(false);
    } else {
      setShowEarn(true);
      setShowMore(false);
      setShow(false);
    }
  };

  const openMore = () => {
    if (showMore) {
      setShowMore(false);
    } else {
      setShowMore(true);
      setShowEarn(false);
      setShow(false);
    }
  };

  function noop() {
    return true;
  }

  return (
    <Menu>
      <img
        src="/images/2/hamburger-menu.svg"
        style={{ cursor: "pointer", display: isOpen ? "none" : "block" }}
        onClick={() => setIsOpen(true)}
      />
      <img
        src="/images/2/hamburger-menu-close.svg"
        style={{ cursor: "pointer", display: isOpen ? "block" : "none" }}
        onClick={() => setIsOpen(false)}
      />
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
        show={isOpen}
      >
        <Links>
          <div>
            <DropdownDiv role="button" onClick={() => open()} onKeyDown={noop} tabIndex={0}>
              Trade
              {show ? <ChevronUpIcon color="#fff" width="24px" /> : <ChevronDownIcon color="#fff" width="24px" />}
            </DropdownDiv>
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
                <a href="/swap">Swap</a>
                {/* <a href="/egspectre">
                  Anon Swap
                </a> */}
                <a href="/perp">Perpetual</a>
                <a href="/liquidity">Liquidity</a>
              </SubMenu>
            </Transition>
          </div>
          <div>
            <DropdownDiv role="button" onClick={() => openEarn()} onKeyDown={noop} tabIndex={0}>
              Earn
              {showEarn ? <ChevronUpIcon color="#fff" width="24px" /> : <ChevronDownIcon color="#fff" width="24px" />}
            </DropdownDiv>
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
                <a href="/pools">Pools</a>
              </SubMenu>
            </Transition>
          </div>
          <div>
            <MainMenu href="https://gatorgang.cc" target="_blank" rel="noreferrer">
              {" "}
              NFT
            </MainMenu>
          </div>
          <div>
            <MainMenu href="/ramp"> EGRamp</MainMenu>
          </div>
          <div>
            <MainMenu href="/egspectre"> EGSpectre</MainMenu>
          </div>
          <div>
            <MainMenu href="/crypto-news"> Crypto News</MainMenu>
          </div>
          <div>
            <DropdownDiv role="button" onClick={() => openMore()} onKeyDown={noop} tabIndex={0}>
              More
              {showMore ? <ChevronUpIcon color="#fff" width="24px" /> : <ChevronDownIcon color="#fff" width="24px" />}
            </DropdownDiv>
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
                {/* <a href="/info" target="_blank" rel="noreferrer" style={{ marginTop: "20px" }}>
                  {" "}
                  Info{" "}
                </a> */}
                <a href="https://docs.egswap.exchange"> Docs </a>
              </SubMenu>
            </Transition>
          </div>
        </Links>
      </Transition>
    </Menu>
  );
};

export default MobileMenu;
