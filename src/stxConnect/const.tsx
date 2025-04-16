export const testnet = window.location.search.includes("chain=testnet");

export const localAuth = false;
export const beta = window.location.search.includes("authorigin=beta");
export const localMocknet =
  !testnet && window.location.search.includes("mocknet=local");
export const mocknet = localMocknet;
export const mainnet =
  (!testnet && !localMocknet) ||
  window.location.search.includes("chain=mainnet");

export const chains = mainnet ? ["stacks:1"] : ["stacks:2147483648"];
export const authOrigin = localAuth
  ? "http://localhost:5173/"
  : beta
  ? "https://pr-725.app.stacks.engineering/"
  : "https://app.blockstack.org";
