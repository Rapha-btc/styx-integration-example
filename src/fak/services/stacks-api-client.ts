// stacks-api-client.ts
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export interface ReadOnlyFunctionSuccessResponse {
  okay: boolean;
  result?: string;
  cause?: string;
}

export interface TokenHoldersResponse {
  totalHolders: number;
  totalSupply: string;
}

class StacksAPIClient {
  constructor(private endpoint: string) {}

  private headers = {
    "X-API-KEY": API_KEY,
  };

  callReadOnly = (data: {
    contractAddress: string;
    contractName: string;
    functionName: string;
    functionArgs: any[];
    senderAddress?: string;
  }) => {
    const sanitizedArgs = data.functionArgs.map((arg) =>
      typeof arg === "bigint" ? arg.toString() : arg
    );

    return axios
      .post<ReadOnlyFunctionSuccessResponse>(
        `${this.endpoint}stacks/call-read`,
        {
          contractAddress: data.contractAddress,
          contractName: data.contractName,
          functionName: data.functionName,
          sender: data.senderAddress,
          arguments: sanitizedArgs,
        },
        {
          headers: this.headers,
        }
      )
      .then((res) => res.data);
  };

  callReadOnlySwapQuote = (data: {
    contractAddress: string;
    contractName: string;
    functionName: string;
    functionArgs: any[]; // [amount, opcode]
    senderAddress?: string;
  }) => {
    return axios
      .post<ReadOnlyFunctionSuccessResponse>(
        `${this.endpoint}stacks/call-read-swap-quote`,
        {
          contractAddress: data.contractAddress,
          contractName: data.contractName,
          functionName: data.functionName,
          sender: data.senderAddress,
          arguments: data.functionArgs, // [amount, opcode]
        },
        {
          headers: this.headers,
        }
      )
      .then((res) => res.data);
  };

  getAddressBalance = (address: string) => {
    return axios
      .get(`${this.endpoint}stacks/address/${address}/balances`, {
        headers: this.headers,
      })
      .then((res) => res.data);
  };

  getTokenHolders = (tokenContract: string) => {
    return axios
      .get<TokenHoldersResponse>(
        `${this.endpoint}stacks/token-holders/${tokenContract}`,
        {
          headers: this.headers,
        }
      )
      .then((res) => res.data);
  };
}

export const stacksApiClient = new StacksAPIClient(API_URL);
