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
      onFinish: () => {
        window.location.reload();
      },
      userSession,
    },
    provider
  );
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
