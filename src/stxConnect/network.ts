// config/network.ts
export type NetworkType = "mainnet" | "testnet" | "regtest";

// Debug the environment variable (Vite uses import.meta.env)
console.log("VITE_NETWORK env var:", import.meta.env.VITE_NETWORK);
console.log("All Vite env vars:", import.meta.env);

// Use Vite's import.meta.env instead of process.env
export const NETWORK: NetworkType =
  (import.meta.env.VITE_NETWORK as NetworkType) || "mainnet";

console.log("Current NETWORK setting:", NETWORK);

export const NETWORK_CONFIG = {
  mainnet: {
    btcPrefixes: ["bc1", "3", "1"],
    blockstreamUrl: "https://blockstream.info/api",
    mempoolUrl: "https://mempool.space/api",
    stacksNetwork: "mainnet",
  },
  testnet: {
    btcPrefixes: ["tb1", "2"],
    blockstreamUrl: "https://blockstream.info/testnet/api",
    mempoolUrl: "https://mempool.space/testnet/api",
    stacksNetwork: "testnet",
  },
  regtest: {
    btcPrefixes: ["bcrt1", "2", "m", "n"],
    blockstreamUrl: "https://mempool.bitcoin.regtest.hiro.so/api/v1",
    mempoolUrl: "https://mempool.bitcoin.regtest.hiro.so/api/v1",
    stacksNetwork: "regtest",
  },
};

export const getCurrentNetworkConfig = () => {
  const config = NETWORK_CONFIG[NETWORK];
  console.log("Using network config for:", NETWORK, config);
  return config;
};

// Helper function to detect if an address is a Bitcoin address for current network
export const isBitcoinAddress = (address: string): boolean => {
  const config = getCurrentNetworkConfig();
  const isMatch = config.btcPrefixes.some((prefix) =>
    address.startsWith(prefix)
  );
  console.log(
    `Checking if ${address} is Bitcoin address for ${NETWORK}:`,
    isMatch
  );
  return isMatch;
};
