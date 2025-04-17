// auth.tsx
import { StacksNetwork } from "@stacks/network";
import {
  AppConfig,
  UserSession,
  showConnect,
  openContractCall,
  openContractDeploy,
  openSTXTransfer,
} from "@stacks/connect";
import { getProvider } from "./getProvider";

// Keep your existing configuration
const appConfig = new AppConfig(["store_write", "publish_data"]);
export const userSession = new UserSession({ appConfig });

export const authenticate = () => {
  const provider = getProvider(userSession);
  showConnect(
    {
      appDetails: {
        name: "faktory.fun",
        icon: "/FF_logo256.png",
      },
      redirectTo: "/",
      onFinish: async () => {
        // Check if we're using Leather wallet with a Ledger device
        // We'll detect this by checking the userData first
        if (userSession.isUserSignedIn()) {
          const userData = userSession.loadUserData();

          // Check if we're using Leather (no BTC address) and need to request it
          const isLeather =
            userData.profile.walletName?.toLowerCase()?.includes("leather") ||
            (userData.profile.appsMeta &&
              Object.keys(userData.profile.appsMeta).some((app) =>
                app.toLowerCase().includes("leather")
              ));

          const hasBtcAddress =
            typeof userData.profile.btcAddress === "string" ||
            userData.profile.btcAddress?.p2wpkh?.mainnet ||
            userData.profile.btcAddress?.p2tr?.mainnet;

          // If using Leather without BTC address, likely using Ledger
          // Request BTC address explicitly before page reload
          if (isLeather && !hasBtcAddress && window.LeatherProvider) {
            console.log(
              "Leather detected without BTC address, requesting BTC address..."
            );
            try {
              // Request Bitcoin address immediately after Stacks auth
              const btcResponse = await window.LeatherProvider.request(
                "getAddresses",
                {
                  currencies: ["BTC"],
                }
              );

              console.log("BTC address response:", btcResponse);

              // We don't need to save the address here as it will be
              // detected by the UserSessionContext on reload
            } catch (error) {
              console.error("Error requesting BTC address:", error);
              // Still reload even if BTC request fails
            }
          }
        }

        // Continue with normal page reload
        window.location.reload();
      },
      userSession,
    },
    provider
  );
};

// Helper function to explicitly request BTC address from Leather wallet
// Use this if the automatic detection fails
export const requestLeatherBtcAddress = async () => {
  if (!window.LeatherProvider) {
    throw new Error("Leather provider not available");
  }

  try {
    const response = await window.LeatherProvider.request("getAddresses", {
      currencies: ["BTC"],
    });

    if (response?.result?.addresses) {
      const btcAddressInfo = response.result.addresses.find(
        (addr: { symbol: string; address?: string }) => addr.symbol === "BTC"
      );

      if (btcAddressInfo?.address) {
        return btcAddressInfo.address;
      }
    }

    throw new Error("Could not retrieve BTC address from response");
  } catch (error) {
    console.error("Error requesting BTC address from Leather:", error);
    throw error;
  }
};

// Update your contract call functions to use the provider
export const contractCall = async (options: any) => {
  const provider = getProvider(userSession);
  return openContractCall({ ...options }, provider);
};

export const contractDeploy = async (options: any) => {
  const provider = getProvider(userSession);
  return openContractDeploy({ ...options }, provider);
};

export const stxTransfer = async (options: any) => {
  const provider = getProvider(userSession);
  return openSTXTransfer({ ...options }, provider);
};
