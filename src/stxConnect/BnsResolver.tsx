// /Users/owner/alpha/frontend/frontend-dao/src/stxConnect/BnsResolver.tsx
// BnsResolver.tsx - Updated to use your backend API
import React, { useEffect } from "react";
import { stacksApiClient } from "../services/stacks-api-client"; // Adjust path as needed

// Function to decode hex to ASCII - keep this as is
const hexToAscii = (hex: string) => {
  let str = "";
  for (let i = 0; i < hex.length; i += 2) {
    const code = parseInt(hex.substr(i, 2), 16);
    if (code !== 0) {
      str += String.fromCharCode(code);
    }
  }
  return str;
};

export const fetchAndDecodeBnsData = async (userAddress: string) => {
  try {
    // Use the new direct BNS resolution endpoint
    const result = await stacksApiClient.resolveBns(userAddress);
    return result.bnsName;
  } catch (error) {
    console.error("Error resolving BNS name:", error);
    return null;
  }
};

interface BnsResolverProps {
  userAddress: string | null;
  onNameResolved: (name: string | null) => void;
}

const BnsResolver: React.FC<BnsResolverProps> = ({
  userAddress,
  onNameResolved,
}) => {
  useEffect(() => {
    const resolveName = async () => {
      if (userAddress) {
        const bnsName = await fetchAndDecodeBnsData(userAddress);
        onNameResolved(bnsName);
      } else {
        onNameResolved(null);
      }
    };

    resolveName();
    // Add a cleanup function to handle component unmounting
    return () => {
      // Any cleanup if needed
    };
  }, [userAddress, onNameResolved]);

  return null;
};

export default BnsResolver;
