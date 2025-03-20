import clsx from "clsx";
import { memo, useEffect } from "react";
import { useTranslation } from "@pancakeswap/localization";
import { escapeRegExp } from "@pancakeswap/utils/escapeRegExp";
import { inputVariants } from "./SwapWidget.css";
import { useTheme } from "@pancakeswap/hooks";

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`); // match escaped "." characters via in a non-capturing group

export const NumericalInput = memo(function InnerInput({
  value,
  onUserInput,
  placeholder,
  error,
  align,
  className,
  id = "",
  label,
  ...rest
}: {
  value: string | number;
  onUserInput: (input: string) => void;
  error?: boolean;
  fontSize?: string;
  align?: "right" | "left";
} & Omit<React.HTMLProps<HTMLInputElement>, "ref" | "onChange" | "as">) {
  const enforcer = (nextUserInput: string) => {
    if (nextUserInput === "" || inputRegex.test(escapeRegExp(nextUserInput))) {
      onUserInput(nextUserInput);
    }
  };

  const { t } = useTranslation();
  const theme = useTheme();

  useEffect(() => {
    const inputElement = document.getElementById(`dark-theme-placeholder-${label}`);
    var isDarkTheme = theme.isDark;
    if (inputElement) {
      if (isDarkTheme) {
        // @ts-ignore
        inputElement.classList.add("dark-placeholder");
      } else {
        // @ts-ignore
        inputElement.classList.remove("dark-placeholder");
      }
    }
  }, [theme]);

  return (
    <input
      className={clsx(
        className,
        inputVariants({
          error,
          align,
        })
      )}
      {...rest}
      value={value}
      onChange={(event) => {
        // replace commas with periods, because we exclusively uses period as the decimal separator
        enforcer(event.target.value.replace(/,/g, "."));
      }}
      // universal input options
      inputMode="decimal"
      title={t("Token Amount")}
      autoComplete="off"
      autoCorrect="off"
      // text-specific options
      type="text"
      pattern="^[0-9]*[.,]?[0-9]*$"
      placeholder={placeholder || "0.0"}
      minLength={1}
      maxLength={79}
      spellCheck="false"
      id={id}
      style={{ fontSize: "1.375rem", fontWeight: "700", color: theme.isDark || theme.isBlue? "#ffffff" : "#2f2f2f" }}
    />
  );
});
