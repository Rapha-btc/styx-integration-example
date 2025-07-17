// UserSessionContext.tsx - DAO updated with Asigna support
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { AppConfig, UserSession } from "@stacks/connect";
import { stacksApiClient } from "../fak/services/stacks-api-client";

const appConfig = new AppConfig(["store_write", "publish_data"]);
const userSession = new UserSession({ appConfig });

// sBTC contract info - MAINNET ONLY (no testnet)
const SBTC_CONTRACT_ADDRESS = "SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4";
const SBTC_CONTRACT_NAME = "sbtc-token";
const SBTC_TOKEN_NAME = "sbtc-token";

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

  // PRESERVE: Your existing balance fetching logic
  const fetchBalances = useCallback(async () => {
    if (!isSignedIn) return;

    // Fetch STX and sBTC balances using your API client
    if (userAddress) {
      try {
        // Get all balances for the address (MAINNET ONLY)
        const balanceData = await stacksApiClient.getAddressBalance(
          userAddress
        );

        // Set STX balance
        const microStx = parseInt(balanceData.stx.balance);
        setStxBalance(microStx / 1000000);

        // Set sBTC balance if available
        const sbtcContract = `${SBTC_CONTRACT_ADDRESS}.${SBTC_CONTRACT_NAME}::${SBTC_TOKEN_NAME}`;
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

    // Fetch BTC balance (MAINNET ONLY)
    if (btcAddress) {
      try {
        const blockstreamUrl = `https://blockstream.info/api/address/${btcAddress}/utxo`;
        const response = await fetch(blockstreamUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const utxos = await response.json();
        const totalSats = utxos.reduce(
          (sum: number, utxo: any) => sum + utxo.value,
          0
        );
        setBtcBalance(totalSats / 100000000);
      } catch (error) {
        console.error("Error fetching BTC balance:", error);
      }
    }
  }, [isSignedIn, userAddress, btcAddress]);

  // PRESERVE: Manual refresh function
  const refreshBalances = useCallback(() => {
    if (isSignedIn && (userAddress || btcAddress)) {
      fetchBalances();
    }
  }, [isSignedIn, userAddress, btcAddress, fetchBalances]);

  // UPDATED: Check sign-in with Asigna support
  useEffect(() => {
    const checkSignIn = () => {
      try {
        // Simple check - just look for addresses array
        const addresses = JSON.parse(localStorage.getItem("addresses") || "[]");

        if (addresses.length) {
          // User is signed in
          if (!isSignedIn) {
            setIsSignedIn(true);
          }

          // UPDATED: Support both regular DAO pattern and Asigna pattern
          let mainnetAddress;

          if (addresses.length === 1) {
            // Single address = Asigna pattern (SM or SP address)
            const singleAddress = addresses[0]?.address;
            if (
              singleAddress &&
              (singleAddress.startsWith("SP") || singleAddress.startsWith("SM"))
            ) {
              mainnetAddress = singleAddress;
            }
          } else {
            // Multiple addresses = DAO pattern (find SP address or use index 2)
            mainnetAddress =
              addresses.find((addr: any) => addr.address?.startsWith("SP"))
                ?.address || addresses[2]?.address;
          }

          if (mainnetAddress && mainnetAddress !== userAddress) {
            setUserAddress(mainnetAddress);
          }

          // Find BTC address
          const btcAddr = addresses.find(
            (addr: any) =>
              addr.address &&
              (addr.address.startsWith("bc1") ||
                addr.address.startsWith("3") ||
                addr.address.startsWith("1"))
          )?.address;

          if (btcAddr && btcAddr !== btcAddress) {
            setBtcAddress(btcAddr);
          }

          // UPDATED: Wallet detection with Asigna support
          let detectedProvider: "leather" | "xverse" | "asigna" = "leather";

          if (addresses.length === 1) {
            // Single address = Asigna
            detectedProvider = "asigna";
          } else if (addresses.length <= 3 && btcAddr) {
            // Multiple addresses but small count + BTC = Xverse
            detectedProvider = "xverse";
          } else {
            // Default = Leather
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

  // PRESERVE: Balance fetching timer
  useEffect(() => {
    if (isSignedIn && (userAddress || btcAddress)) {
      fetchBalances();
    }

    const balanceTimer = setInterval(() => {
      if (isSignedIn && (userAddress || btcAddress)) {
        fetchBalances();
      }
    }, 60000); // 60000ms = 1 minute

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
