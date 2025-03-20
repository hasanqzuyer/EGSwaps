import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { ThemeSwitcher } from "@pancakeswap/uikit";
import { useTheme } from "@pancakeswap/hooks";
import useGetEGPrice from "../../hooks/useGetEGPrice";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 54px 20%;
  background-color: #242424;
  border-top: 10px solid #2cf0d6;
  position: relative;
  z-index: 10;

  .blank-line {
    margin-top: 5px;
    width: 100%;
    height: 2px;
    background-color: white;
  }

  .social-media {
    display: flex;
    gap: 20px;
    margin-bottom: 10px;
  }

  .balance {
    width: 100%;
    display: flex;
    margin: 10px 0px;
    gap: 20px;
    flex-direction: column;
    justify-content: left;
    align-items: flex-start;

    ${({ theme }) => theme.mediaQueries.lg} {
      flex-direction: row;
      justify-content: right;
      align-items: center;
    }

    span {
      font-family: "Poppins";
      font-style: normal;
      font-weight: 400;
      font-size: 18px;
      line-height: 27px;
      color: #ffffff;
    }

    .buy {
      border: 1px solid #ffffff;
      border-radius: 12px;
      padding: 5px 10px;
      font-family: "Poppins";
      font-style: normal;
      font-weight: 700;
      font-size: 18px;
      line-height: 27px;
      text-align: center;
      display: flex;
      align-items: center;
      color: #ffffff;
      gap: 50px;
    }
  }
`;

const Footer = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: nowrap;
  justify-content: space-around;
  font-family: "Poppins";

  @media (max-width: 1050px) {
    flex-wrap: wrap;
    justify-content: flex-start;
    flex-direction: column;
    gap: 25px;
  }
`;

const Section = styled.div`
  color: #ffffff;
  font-family: "Poppins";
  font-style: normal;

  &.logo {
    font-weight: 1050;
    font-size: 20px;
    line-height: 18px;
    display: flex;
    justify-content: center;
    align-self: flex-start;
    gap: 10px;
    align-items: center;
  }

  .title {
    font-weight: 700;
    font-size: 18px;
    line-height: 27px;
  }
  .links {
    cursor: pointer;
    font-weight: 400;
    font-size: 18px;
    line-height: 27px;
  }

  div {
    padding: 8px 0px;
  }
`;

const NewFooter: FC = () => {
  const { isDark, setTheme } = useTheme();
  const { egPrice } = useGetEGPrice();

  const footerGroups = [
    {
      title: "About",
      links: [
        {
          title: "Contact",
          url: "https://docs.egswap.exchange/contact-us",
          external: true,
        },
        {
          title: "Advertise",
          url: "https://docs.egswap.exchange/advertise",
          external: true,
        },
        {
          title: "Terms of service",
          url: "/terms-of-service",
          external: false,
        },
      ],
    },
    {
      title: "Help",
      links: [
        {
          title: "Customer Support",
          url: "https://docs.egswap.exchange/contact-us/customer-support",
          external: true,
        },
        {
          title: "Troubleshooting",
          url: "https://docs.egswap.exchange/help/troubleshooting-errors",
          external: true,
        },
        {
          title: "Guides",
          url: "https://docs.egswap.exchange/get-started",
          external: true,
        },
        {
          title: "Submit A Bug",
          url: "https://docs.egswap.exchange/developers/bugs",
          external: true,
        },
      ],
    },
    {
      title: "Developers",
      links: [
        {
          title: "Documentation",
          url: "https://docs.egswap.exchange/developers/smart-contracts",
          external: true,
        },
        {
          title: "Analytics",
          url: "/analytics",
          external: true,
        },
      ],
    },
  ];

  const socialMedia = [
    { url: "https://twitter.com/EGSwap", logo: "/images/home/new/twitter-white.png" },
    { url: "https://t.me/egtokenchat", logo: "/images/home/new/telegram-white.png" },
  ];

  const isRampPage = window.location.pathname?.includes("/ramp");
  const isHomePage = window.location.pathname === "/";
  return (
    <Container>
      <Footer>
        <Section className="logo">
          <img src="/images/logo-egswap-light.png" alt="logo" style={{ width: "42px", height: "auto" }} />
          EGSwap
        </Section>
        {footerGroups.map((group, idx) => (
          <Section key={idx}>
            <div className="title">{group.title}</div>
            {group.links.map((link, idx2) => (
              <div className="links" key={idx2}>
                <a href={link.url} target={link.external ? "_blank" : "_self"}>
                  {link.title}
                </a>
              </div>
            ))}
          </Section>
        ))}
      </Footer>
      <div className="social-media mt-5">
        {socialMedia.map((sm, idx) => (
          <a href={sm.url} target="_blank" rel="noreferrer" key={idx}>
            <img src={sm.logo} alt="logo" style={{ width: "30px", height: "auto" }} />
          </a>
        ))}
      </div>
      <div className="blank-line" />
      <div className="balance">
        {!isRampPage && !isHomePage && (
          <ThemeSwitcher isDark={isDark} toggleTheme={() => setTheme(isDark ? "light" : "dark")} />
        )}
      </div>
    </Container>
  );
};

export default NewFooter;
