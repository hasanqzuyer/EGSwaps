import { useTranslation } from "@pancakeswap/localization";
import { useIsMounted, useTheme } from "@pancakeswap/hooks";
import { PropsWithChildren, ReactNode, useState, useEffect } from "react";
import styled from "styled-components";
import {
  AutoColumn,
  RowBetween,
  Text,
  TextProps,
  IconButton,
  PencilIcon,
  Box,
  InfoIcon,
  Button,
} from "../../components";

import { ethers } from "ethers";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import ProtectionIcon from "../../assets/ProtectionIcon";
import MevBotIcon from "../../assets/MevBotIcon";
import CloseIcon from "../../assets/CloseIcon";
import { useActiveChainId } from '../../hooks/useActiveChainId';

type SwapInfoType = {
  price: ReactNode;
  allowedSlippage: number;
  onSlippageClick?: () => void;
  allowedSlippageSlot?: React.ReactNode;
  userAutoSlippageTolerance?: boolean;
};

const MEVWrapper = styled.button<{ isBlue?: boolean }>`
  border-radius: 6px;
  padding: 1px;
  width: 207px;
  height: 36px;
  background-image: ${({ isBlue }) => isBlue ? "linear-gradient(180deg, #8B5FFF 0%, #7A33FF 100%)" : "linear-gradient(90deg, #2cf0d6 0%, #22ce77 100%)"};
  margin: 1em 0;
  &:hover {
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0px);
  }
`;

const MEVBody = styled.div<{ isDark: boolean, isBlue?: boolean }>`
  background-color: ${({ isDark, isBlue }) => isBlue ? "#3f3f3f" : (isDark ? "#181818" : "#f4f4f4")};
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const GradientText = styled.span<{ font?: number; mx?: number; isBlue?: boolean }>`
  background-image: ${({ isBlue }) => isBlue ? "linear-gradient(180deg, #8B5FFF 0%, #7A33FF 100%)" : "linear-gradient(90deg, #2cf0d6 0%, #22ce77 100%)"};
  background-clip: text;
  color: ${({ isBlue }) => isBlue ? "#6630FF" : "transparent"};
  -webkit-background-clip: text;
  font-size: ${({ font }) => font}px;
  margin: 0 ${({ mx }) => mx ?? 0}px;
`;

export const SwapInfoLabel = (props: PropsWithChildren<TextProps>) => (
  <Text fontSize="16px" bold color="secondary" {...props} />
);

export const SwapInfo = ({ allowedSlippage, price, onSlippageClick, allowedSlippageSlot, userAutoSlippageTolerance }: SwapInfoType) => {
  const { t } = useTranslation();
  const isMounted = useIsMounted();
  const { isDark, isBlue } = useTheme();
  const { chainId } = useActiveChainId()

  const switchFlashbotRpcNetwork = async () => {
    let flashbotChain: any = {
      chainId: 1,
      chainName: "EGSwap MEV Protect (Ethereum Mainnet)",
      nativeCurrency: {
        name: "Ethereum",
        symbol: "ETH",
        decimals: 18,
      },
      rpcUrls: ["https://rpc.flashbots.net/fast"],
      blockExplorerUrls: ["https://etherscan.io/"],
    };
    if (chainId == 5) {
      flashbotChain = {
        chainId: 5,
        chainName: "Goerli Flashbots Protect",
        nativeCurrency: {
          name: "Ethereum",
          symbol: "ETH",
          decimals: 18,
        },
        rpcUrls: ["https://rpc-goerli.flashbots.net/fast"],
        blockExplorerUrls: ["https://goerli.etherscan.io/"],
      };
    }

    if ((chainId === 1) || (chainId === 5)) {
      //Only Flashbot works on Ethereum and Goerli testnet
      try {
        const provider = (window as any)?.ethereum;
        if (provider) {
          await provider?.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${flashbotChain.chainId.toString(16)}`,
                chainName: flashbotChain.chainName,
                nativeCurrency: flashbotChain.nativeCurrency,
                rpcUrls: flashbotChain.rpcUrls,
                blockExplorerUrls: flashbotChain.blockExplorers,
              },
            ],
          });
        }
      } catch (error) {
        console.error("Failed to setup the network", error);
      }
    }
  };

  const confirmFunc = async () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div
            className={`max-w-[410px] w-full p-7 border border-solid rounded-[20px] 
            ${isBlue ? "bg-[#3f3f3f]" : !isDark ? "border-[#181818]" : "border-[#f4f4f4]"} 
            ${isBlue ? "bg-[#3f3f3f]" : (isDark ? "bg-[#181818]" : "bg-[#f4f4f4]")}`}
          >
            <div className="flex flex-row items-start justify-between mb-3">
              <GradientText font={22} isBlue={isBlue}>{t("Add Custom RPC Endpoint")}</GradientText>
              <div onClick={onClose} className="cursor-pointer hover:scale-110 active:scale-100">
                <CloseIcon isBlue={isBlue} />
              </div>
            </div>
            <div className={`text-sm text-[${isDark || isBlue ? "#fff" : "#2f2f2f"}]`}>
              EGSwap recommends using the RPC endpoint of trusted third-parties like Flashbots to protect you from MEV
              Bots and Front Running attacks. <br />
              <br /> Please note that adding a RPC endpoint automatically is only supported via the MetaMask wallet. If
              you wish to add the RPC endpoint to your wallet manually, refer to
              <a href="https://docs.egswap.exchange/get-started/adding-mev-protection-rpc-manually" target="_blank">
                <GradientText mx={5} isBlue={isBlue}>this guide.</GradientText>
              </a>
              <br />
              <br /> To Stop using MEV Protecion or to use another Chain, change your Network manually.
            </div>
            <div className={`w-full h-10 flex flex-row my-[18px] rounded-full items-center justify-center border border-solid ${isBlue ? 'border-[#6630FF]' : 'border-[#22CE77]'}`}>
              <MevBotIcon />
              <GradientText font={16} mx={10} isBlue={isBlue}>
                {t("Use Flashbots")}
              </GradientText>
            </div>
            <div className="flex flex-row gap-2">
              <button
                onClick={onClose}
                className="bg-[#2f2f2f] text-white max-w-[257px] w-full h-10 rounded-full text-base transform hover:-translate-y-[1px] active:translate-y-0"
              >
                {t("No, go back")}
              </button>
              <button
                onClick={async () => {
                  await switchFlashbotRpcNetwork();
                  onClose();
                }}
                className={`${isBlue ? 'bg-[#6630FF]' : 'bg-gradient-to-r from-teal-400 to-emerald-500'} text-white text-base rounded-full w-[86px] h-10 transform hover:-translate-y-[1px] active:translate-y-0`}
              >
                {t("Yes")}
              </button>
            </div>
          </div>
        );
      },
    });
  };

  return (
    <AutoColumn gap="sm" py="0">
      <Box>{price}</Box>
      {chainId === 1 || chainId === 5 ? (
        <RowBetween alignItems="center">
          <MEVWrapper name="confirmFunc" onClick={async () => confirmFunc()} isBlue={isBlue}>
            <MEVBody isDark={isDark} isBlue={isBlue}>
              <ProtectionIcon />
              <Text
                style={{
                  backgroundImage: isBlue ? "linear-gradient(180deg, #6630FF 0%, #5900C9 100%)" : "linear-gradient(90deg, #2CF0D6 0%, #22CE77 100%)",
                  backgroundClip: "text",
                  color: isBlue ? "#fff" : "transparent",
                  WebkitBackgroundClip: "text",
                  marginLeft: "8px",
                }}
              >
                {t("Add MEV Protection")}
              </Text>
            </MEVBody>
          </MEVWrapper>
        </RowBetween>
      ) : (
        <></>
      )}
      <RowBetween alignItems="center">
        <div className={`font-medium text-base text-[${isDark || isBlue ? "#8c8c8c" : "#2f2f2f"}]`}>
          {t("Slippage Tolerance")}
          {onSlippageClick ? (
            <IconButton scale="sm" variant="text" onClick={onSlippageClick}>
              <PencilIcon color="primary" width="14px" isBlue={isBlue}/>
            </IconButton>
          ) : null}
        </div>
        {isMounted && (allowedSlippageSlot ?? (userAutoSlippageTolerance ? <GradientText font={16} isBlue={isBlue}>Auto</GradientText> : <GradientText font={16} isBlue={isBlue}>{allowedSlippage / 100}%</GradientText>))}
      </RowBetween>
    </AutoColumn>
  );
};
