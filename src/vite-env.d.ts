/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NETWORK: "mainnet" | "testnet" | "regtest";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
