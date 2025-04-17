// UserSessionContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { AppConfig, UserSession } from "@stacks/connect";
import { StacksMainnet } from "@stacks/network";
import { stacksApiClient } from "../services/stacks-api-client"; // Import your API client

const appConfig = new AppConfig(["store_write", "publish_data"]);
const userSession = new UserSession({ appConfig });

// sBTC contract info
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
  activeWalletProvider: "leather" | "xverse" | null;
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
  const [sbtcBalance, setSbtcBalance] = useState<number | null>(null); // Added sBTC balance state
  const [activeWalletProvider, setActiveWalletProvider] = useState<
    "leather" | "xverse" | null
  >(null);
  const [isBalancesLoading, setIsBalancesLoading] = useState(false);

  // Define attemptBtcRetrieval at component level (not inside fetchBalances)
  const attemptBtcRetrieval = useCallback(async () => {
    // Only try this if:
    // 1. We're signed in
    // 2. We have a Stacks address
    // 3. We don't have a BTC address
    // 4. We're using Leather wallet
    if (
      isSignedIn &&
      userAddress &&
      !btcAddress &&
      activeWalletProvider === "leather"
    ) {
      try {
        // Check if we can access the Leather provider
        if (window.LeatherProvider) {
          console.log(
            "Attempting to retrieve BTC address for Leather+Ledger user..."
          );

          // Request BTC address
          const response = await window.LeatherProvider.request(
            "getAddresses",
            {
              currencies: ["BTC"],
            }
          );

          if (response?.result?.addresses) {
            const btcAddrInfo = response.result.addresses.find(
              (addr: { symbol: string; address?: string }) =>
                addr.symbol === "BTC"
            );

            if (btcAddrInfo?.address) {
              console.log(
                "Successfully retrieved BTC address:",
                btcAddrInfo.address
              );
              setBtcAddress(btcAddrInfo.address);
              return btcAddrInfo.address;
            }
          }
        }
      } catch (error) {
        console.error("Error in BTC address auto-retrieval:", error);
        // Just log the error, don't interrupt the flow
      }
    }

    return null;
  }, [isSignedIn, userAddress, btcAddress, activeWalletProvider]);

  // Function to fetch balances
  const fetchBalances = useCallback(async () => {
    if (!isSignedIn) return;

    setIsBalancesLoading(true);

    // Fetch STX and sBTC balances using your API client
    if (userAddress) {
      try {
        // Get all balances for the address
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
          setSbtcBalance(sbtcMicroBalance / 100000000); // Convert to sBTC (assuming 8 decimal places)
        } else {
          setSbtcBalance(0);
        }
      } catch (error) {
        console.error("Error fetching STX/sBTC balances:", error);
        // Don't reset the balances on error to avoid UI flicker
      }
    }

    // Fetch BTC balance
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
        setBtcBalance(totalSats / 100000000); // Convert satoshis to BTC
      } catch (error) {
        console.error("Error fetching BTC balance:", error);
        // Don't reset the balance on error to avoid UI flicker
      }
    }

    setIsBalancesLoading(false);
  }, [isSignedIn, userAddress, btcAddress]);

  // Manual refresh function
  const refreshBalances = useCallback(() => {
    if (isSignedIn && (userAddress || btcAddress)) {
      fetchBalances();
    }
  }, [isSignedIn, userAddress, btcAddress, fetchBalances]);

  // Check sign-in status frequently
  useEffect(() => {
    const checkSignIn = () => {
      const signedIn = userSession.isUserSignedIn();

      if (signedIn !== isSignedIn) {
        setIsSignedIn(signedIn);
      }

      if (signedIn) {
        const userData = userSession.loadUserData();
        const stxAddr = userData.profile.stxAddress.mainnet;

        // Only update if changed
        if (stxAddr !== userAddress) {
          setUserAddress(stxAddr);
        }

        // Detect wallet type and get BTC address based on structure
        let btcAddr = null;
        let detectedWalletProvider: "xverse" | "leather" | null = null;

        // Check structure of btcAddress to determine wallet type
        if (typeof userData.profile.btcAddress === "string") {
          // Xverse stores btcAddress as a direct string
          btcAddr = userData.profile.btcAddress;
          detectedWalletProvider = "xverse";
        } else if (
          userData.profile.btcAddress?.p2wpkh?.mainnet ||
          userData.profile.btcAddress?.p2tr?.mainnet
        ) {
          // Leather stores addresses in a structured object
          btcAddr =
            userData.profile.btcAddress?.p2wpkh?.mainnet ||
            userData.profile.btcAddress?.p2tr?.mainnet;
          detectedWalletProvider = "leather";
        }

        // Update the btcAddress state if it changed
        if (btcAddr !== btcAddress) {
          setBtcAddress(btcAddr);
        }

        // Update the wallet provider if needed
        if (detectedWalletProvider !== activeWalletProvider) {
          setActiveWalletProvider(detectedWalletProvider);
        }
      } else if (isSignedIn) {
        // User logged out
        setUserAddress(null);
        setBtcAddress(null);
        setStxBalance(null);
        setBtcBalance(null);
        setSbtcBalance(null); // Reset sBTC balance on logout
      }
    };

    checkSignIn();
    const signInCheckInterval = setInterval(checkSignIn, 1000);

    return () => clearInterval(signInCheckInterval);
  }, [isSignedIn, userAddress, btcAddress, activeWalletProvider]);

  // Add a separate useEffect for BTC address retrieval
  useEffect(() => {
    // Attempt to retrieve BTC address for Leather+Ledger users
    if (
      isSignedIn &&
      userAddress &&
      !btcAddress &&
      activeWalletProvider === "leather"
    ) {
      attemptBtcRetrieval();
    }
  }, [
    isSignedIn,
    userAddress,
    btcAddress,
    activeWalletProvider,
    attemptBtcRetrieval,
  ]);

  // Fetch balances when addresses change and then once every minute
  useEffect(() => {
    // Initial fetch when user signs in or addresses change
    if (isSignedIn && (userAddress || btcAddress)) {
      fetchBalances();
    }

    // Set up a timer to refresh every minute
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
