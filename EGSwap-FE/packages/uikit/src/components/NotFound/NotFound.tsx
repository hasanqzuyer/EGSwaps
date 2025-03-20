import styled from "styled-components";
import { NextSeo } from "next-seo";
import { Button, Heading, Text, LogoIcon } from "@pancakeswap/uikit";
import { useTranslation } from "@pancakeswap/localization";
import Link from "next/link";
import { useEffect, useState } from "react";

const StyledNotFound = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  padding: 100px 32px;
  justify-content: center;
  background-color: #0e1951;
  position: relative;
  text-align: center;

  @media screen and (min-width: 1200px) {
    flex-direction: row;
    text-align: left;
  }
`;

const NotFound = ({ statusCode = 404 }: { statusCode?: number }) => {
  const { t } = useTranslation();

  const [isInIframe, setIsInIframe] = useState(false);

  useEffect(() => {
    setIsInIframe(window.self !== window.top);
  }, []);


  return (
    <>
      <NextSeo title="404" />
      <StyledNotFound>
        <div>
          <Heading scale="xxl" mb="2rem" color="white">
            {statusCode}{" "}
            <span
              style={{
                backgroundImage: "linear-gradient(90deg, #2CF0D6 0%, #22CE77 100%)",
                backgroundClip: "text",
                color: "transparent",
                WebkitBackgroundClip: "text",
              }}
            >
              Page not found
            </span>
          </Heading>
          <Text color="#79cfff" mb="1rem">
            We couldn't find the page you are looking for
          </Text>
          <Link href={!isInIframe ? "/" : "/egspectre/supernova-widget"} passHref>
            <Button
              as="a"
              scale="md"
              style={{
                background: "linear-gradient(90deg, #2CF0D6 0%, #22CE77 100%)",
                color: "#fff",
                margin: "0",
                borderRadius: "1.75rem",
              }}
            >
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="pointer-events-none max-w-full">
          <img src="/images/not-found-image.webp" width={640} height={640} alt="Under construction" />
        </div>
      </StyledNotFound>
    </>
  );
};

export default NotFound;
