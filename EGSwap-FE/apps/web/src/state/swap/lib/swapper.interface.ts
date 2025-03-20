import { DataApiResponse } from "./types";

export interface ISwapper{
    quote(tokenIn: string, tokenOut: string, amount: string, chainId: number): Promise<DataApiResponse>;
    swap(tokenIn: string, tokenOut: string, amount: string, chainId: number, slippage: number): Promise<string>;
}