import { AppConfig, UserSession, connect } from "@stacks/connect";

const appConfig = new AppConfig(["store_write", "publish_data"]);
export const userSession = new UserSession({ appConfig });

export const authenticate = async () => {
  try {
    console.log("=== AUTHENTICATION START ===");
    console.log("Starting authentication...");

    const existingAddresses = localStorage.getItem("addresses");
    console.log("Existing addresses in localStorage:", existingAddresses);

    const isUserSessionSignedIn = userSession.isUserSignedIn();
    console.log("UserSession isUserSignedIn:", isUserSessionSignedIn);

    console.log("Available wallet providers:");
    console.log("- Xverse:", !!(window as any).XverseProviders);
    console.log("- Leather:", !!(window as any).LeatherProvider);
    console.log("- Asigna:", !!(window as any).AsignaProvider);
    console.log("- Stacks Connect:", typeof connect === "function");

    console.log("Calling connect()...");

    const result = await connect();
    console.log("=== CONNECTION RESULT ===");
    console.log("Full result:", result);
    console.log("Result type:", typeof result);
    console.log("Result keys:", Object.keys(result || {}));

    if (result && result.addresses) {
      console.log("Addresses received:", result.addresses);
      console.log("Number of addresses:", result.addresses.length);

      result.addresses.forEach((addr: any, index: number) => {
        console.log(`Address ${index}:`, addr);
      });

      localStorage.setItem("addresses", JSON.stringify(result.addresses));
      console.log("Addresses stored in localStorage");

      const storedAddresses = localStorage.getItem("addresses");
      console.log("Verification - stored addresses:", storedAddresses);

      const mainnetAddress = result.addresses[2]?.address;
      console.log("Mainnet address (index 2):", mainnetAddress);

      if (mainnetAddress) {
        console.log("✅ Connected successfully to address:", mainnetAddress);
        console.log("Reloading page to update UI...");
        window.location.reload();
      } else {
        console.error("❌ No mainnet address found at index 2");
        console.log("Available addresses:", result.addresses);

        if (result.addresses.length > 0) {
          const firstAddress = result.addresses[0]?.address;
          console.log("Fallback: Using first available address:", firstAddress);
          if (firstAddress) {
            window.location.reload();
          }
        }
      }
    } else {
      console.error("❌ No addresses in connection result");
      console.log("Result structure:", result);
    }

    console.log("=== AUTHENTICATION END ===");
  } catch (error) {
    console.error("=== AUTHENTICATION ERROR ===");
    console.error("Wallet connection failed:", error);
    console.error("Error type:", typeof error);
    console.error(
      "Error message:",
      error instanceof Error ? error.message : "Unknown error"
    );
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );

    if (error instanceof Error) {
      if (
        error.message.includes("User denied") ||
        error.message.includes("cancelled")
      ) {
        console.log("User cancelled connection");
      } else {
        console.error("Actual connection error occurred");
      }
    }

    console.error("=== ERROR END ===");
  }
};
