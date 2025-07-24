// UserSessionContext.tsx - Updated with network support
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { AppConfig, UserSession } from "@stacks/connect";
import { stacksApiClient } from "../fak/services/stacks-api-client";
import {
  getCurrentNetworkConfig,
  isBitcoinAddress,
  NETWORK,
} from "../stxConnect/network";

// Define address interface for better type safety
interface WalletAddress {
  address: string;
  publicKey?: string;
  [key: string]: any;
}

const appConfig = new AppConfig(["store_write", "publish_data"]);
const userSession = new UserSession({ appConfig });

// sBTC contract info - adjust based on network
const SBTC_CONTRACTS = {
  mainnet: {
    address: "SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4",
    name: "sbtc-token",
    tokenName: "sbtc-token",
  },
  testnet: {
    address: "STV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RJ5XDY2", // Replace with actual testnet contract
    name: "sbtc-token",
    tokenName: "sbtc-token",
  },
  regtest: {
    address: "STV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RJ5XDY2", // Replace with actual regtest contract
    name: "sbtc-token",
    tokenName: "sbtc-token",
  },
};

const SBTC_CONTRACT = SBTC_CONTRACTS[NETWORK];

interface UserSessionContextType {
  userSession: UserSession;
  isSignedIn: boolean;
  userAddress: string | null;
  btcAddress: string | null;
  stxBalance: number | null;
  btcBalance: number | null;
  sbtcBalance: number | null;
  activeWalletProvider: "leather" | "xverse" | "asigna" | null;
  refreshBalances: () => void;
  setIsSignedIn: (value: boolean) => void;
}

const UserSessionContext = createContext<UserSessionContextType>({
  userSession,
  isSignedIn: false,
  userAddress: null,
  btcAddress: null,
  stxBalance: null,
  btcBalance: null,
  sbtcBalance: null,
  activeWalletProvider: null,
  refreshBalances: () => {},
  setIsSignedIn: () => {},
});

export const UserSessionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [btcAddress, setBtcAddress] = useState<string | null>(null);
  const [stxBalance, setStxBalance] = useState<number | null>(null);
  const [btcBalance, setBtcBalance] = useState<number | null>(null);
  const [sbtcBalance, setSbtcBalance] = useState<number | null>(null);
  const [activeWalletProvider, setActiveWalletProvider] = useState<
    "leather" | "xverse" | "asigna" | null
  >(null);

  const fetchBalances = useCallback(async () => {
    if (!isSignedIn) return;

    // Fetch STX and sBTC balances
    if (userAddress) {
      try {
        const balanceData = await stacksApiClient.getAddressBalance(
          userAddress
        );

        // Set STX balance
        const microStx = parseInt(balanceData.stx.balance);
        setStxBalance(microStx / 1000000);

        // Set sBTC balance if available
        const sbtcContract = `${SBTC_CONTRACT.address}.${SBTC_CONTRACT.name}::${SBTC_CONTRACT.tokenName}`;
        if (
          balanceData.fungible_tokens &&
          balanceData.fungible_tokens[sbtcContract]
        ) {
          const sbtcMicroBalance = parseInt(
            balanceData.fungible_tokens[sbtcContract].balance
          );
          setSbtcBalance(sbtcMicroBalance / 100000000);
        } else {
          setSbtcBalance(0);
        }
      } catch (error) {
        console.error("Error fetching STX/sBTC balances:", error);
      }
    }

    // Fetch BTC balance using network-appropriate API
    if (btcAddress) {
      try {
        const config = getCurrentNetworkConfig();
        const apiUrl = `${config.blockstreamUrl}/address/${btcAddress}/utxo`;

        console.log(`Fetching BTC balance from: ${apiUrl}`);
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const utxos = await response.json();
        const totalSats = utxos.reduce(
          (sum: number, utxo: any) => sum + utxo.value,
          0
        );
        setBtcBalance(totalSats / 100000000);
        console.log(`BTC balance fetched: ${totalSats / 100000000} BTC`);
      } catch (error) {
        console.error("Error fetching BTC balance:", error);
        setBtcBalance(0);
      }
    }
  }, [isSignedIn, userAddress, btcAddress]);

  const refreshBalances = useCallback(() => {
    if (isSignedIn && (userAddress || btcAddress)) {
      fetchBalances();
    }
  }, [isSignedIn, userAddress, btcAddress, fetchBalances]);

  // Check sign-in with network-aware address detection
  useEffect(() => {
    const checkSignIn = () => {
      try {
        const addresses: WalletAddress[] = JSON.parse(
          localStorage.getItem("addresses") || "[]"
        );

        if (addresses.length) {
          if (!isSignedIn) {
            setIsSignedIn(true);
          }

          // Find STX address (SP/SM prefixes work across networks)
          let mainnetAddress;
          if (addresses.length === 1) {
            // Single address = Asigna pattern
            const singleAddress = addresses[0]?.address;
            if (
              singleAddress &&
              (singleAddress.startsWith("SP") || singleAddress.startsWith("SM"))
            ) {
              mainnetAddress = singleAddress;
            }
          } else {
            // Multiple addresses = find STX address
            mainnetAddress =
              addresses.find(
                (addr: WalletAddress) =>
                  addr.address?.startsWith("SP") ||
                  addr.address?.startsWith("SM")
              )?.address || addresses[2]?.address;
          }

          if (mainnetAddress && mainnetAddress !== userAddress) {
            console.log(`Setting STX address: ${mainnetAddress}`);
            setUserAddress(mainnetAddress);
          }

          // Find BTC address using network-aware detection
          const btcAddr = addresses.find(
            (addr: WalletAddress) =>
              addr.address && isBitcoinAddress(addr.address)
          )?.address;

          if (btcAddr && btcAddr !== btcAddress) {
            console.log(
              `Setting BTC address: ${btcAddr} (network: ${NETWORK})`
            );
            setBtcAddress(btcAddr);
          } else if (!btcAddr) {
            console.log("No Bitcoin address found for network:", NETWORK);
            console.log(
              "Available addresses:",
              addresses.map((a: WalletAddress) => a.address)
            );
            console.log(
              "Looking for prefixes:",
              getCurrentNetworkConfig().btcPrefixes
            );
          }

          // Wallet detection logic remains the same
          let detectedProvider: "leather" | "xverse" | "asigna" = "leather";
          if (addresses.length === 1) {
            detectedProvider = "asigna";
          } else if (addresses.length <= 3 && btcAddr) {
            detectedProvider = "xverse";
          } else {
            detectedProvider = "leather";
          }

          if (detectedProvider !== activeWalletProvider) {
            setActiveWalletProvider(detectedProvider);
          }
        } else {
          // No addresses - user is not signed in
          if (isSignedIn) {
            setIsSignedIn(false);
            setUserAddress(null);
            setBtcAddress(null);
            setStxBalance(null);
            setBtcBalance(null);
            setSbtcBalance(null);
            setActiveWalletProvider(null);
          }
        }
      } catch (error) {
        console.error("Error checking wallet state:", error);
      }
    };

    checkSignIn();
    const signInCheckInterval = setInterval(checkSignIn, 1000);

    return () => clearInterval(signInCheckInterval);
  }, [isSignedIn, userAddress, btcAddress, activeWalletProvider]);

  // Balance fetching timer
  useEffect(() => {
    if (isSignedIn && (userAddress || btcAddress)) {
      fetchBalances();
    }

    const balanceTimer = setInterval(() => {
      if (isSignedIn && (userAddress || btcAddress)) {
        fetchBalances();
      }
    }, 60000);

    return () => clearInterval(balanceTimer);
  }, [isSignedIn, userAddress, btcAddress, fetchBalances]);

  return (
    <UserSessionContext.Provider
      value={{
        userSession,
        isSignedIn,
        userAddress,
        btcAddress,
        stxBalance,
        btcBalance,
        sbtcBalance,
        activeWalletProvider,
        refreshBalances,
        setIsSignedIn,
      }}
    >
      {children}
    </UserSessionContext.Provider>
  );
};

export const useUserSession = () => useContext(UserSessionContext);
