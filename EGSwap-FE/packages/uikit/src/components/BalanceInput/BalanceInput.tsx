import React from "react";
import { Flex, Box } from "../Box";
import { SwapVertIcon } from "../Svg";
import Text from "../Text/Text";
import { StyledBalanceInput, StyledInput, UnitContainer, SwitchUnitsButton } from "./styles";
import { BalanceInputProps } from "./types";
import { fixedFloat } from "../../util/digitHelper";
import useGetEGPrice from "../../hooks/useGetEGPrice";

const BalanceInput: React.FC<React.PropsWithChildren<BalanceInputProps>> = ({
  value,
  placeholder = "0.0",
  onUserInput,
  currencyValue,
  inputProps,
  innerRef,
  isWarning = false,
  decimals = 18,
  unit,
  switchEditingUnits,
  ...props
}) => {
  const { egPrice } = useGetEGPrice();

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.validity.valid) {
      onUserInput(e.currentTarget.value.replace(/,/g, "."));
    }
  };

  const priceInUSD = fixedFloat(egPrice * Number(value));

  return (
    <StyledBalanceInput isWarning={isWarning} {...props}>
      <Flex justifyContent="flex-end">
        <Box>
          <Flex alignItems="center">
            <StyledInput
              pattern={`^[0-9]*[.,]?[0-9]{0,${decimals}}$`}
              inputMode="decimal"
              min="0"
              value={value}
              onChange={handleOnChange}
              placeholder={placeholder}
              ref={innerRef}
              {...inputProps}
            />
            {unit && <UnitContainer>{unit}</UnitContainer>}
          </Flex>
          {currencyValue && (
            <Text fontSize="12px" textAlign="right" color="textSubtle">
              ~{priceInUSD} USD
            </Text>
          )}
        </Box>
        {switchEditingUnits && (
          <Flex alignItems="center" pl="12px">
            <SwitchUnitsButton scale="sm" variant="text" onClick={switchEditingUnits}>
              <SwapVertIcon color="textSubtle" />
            </SwitchUnitsButton>
          </Flex>
        )}
      </Flex>
    </StyledBalanceInput>
  );
};

export default BalanceInput;
