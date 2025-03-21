import { AnchorHTMLAttributes } from "react";
import { TextProps } from "../Text";

export interface LinkProps extends TextProps, AnchorHTMLAttributes<HTMLAnchorElement> {
  external?: boolean;
  isBscScan?: boolean;
  isAptosScan?: boolean;
  isContract?: boolean;
}
