// utils/addressUtils.ts
import { formatDistanceToNow } from "date-fns";

export const getBackgroundColor = (address: string) => {
  const colors = [
    "rgba(187, 222, 251, 0.2)", // Light Blue
    "rgba(200, 230, 201, 0.2)", // Light Green
    "rgba(255, 224, 178, 0.2)", // Light Orange
    "rgba(225, 190, 231, 0.2)", // Light Purple
    "rgba(255, 205, 210, 0.2)", // Light Red
    "rgba(207, 216, 220, 0.2)", // Light Blue Grey
    "rgba(255, 249, 196, 0.2)", // Light Yellow
    "rgba(215, 204, 200, 0.2)", // Light Brown
  ];

  const sum = address
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[sum % colors.length];
};

export const formatAddress = (address: string): string => {
  // Handle contract addresses (containing a dot)
  if (address.includes(".")) {
    const [stxAddress] = address.split(".");
    const result = stxAddress.slice(0, 6);

    return result;
  }

  // Handle regular addresses
  if (
    (address.startsWith("SP") ||
      address.startsWith("SM") ||
      address.startsWith("ST")) &&
    !address.includes(".")
  ) {
    const result = address.slice(0, 6);

    return result;
  }

  return address;
};

export const formatAddress2 = (address: string): string => {
  // Handle contract addresses (containing a dot)
  if (address.includes(".")) {
    const [stxAddress] = address.split(".");
    return `${stxAddress.slice(0, 4)}...${stxAddress.slice(-4)}`;
  }

  // Handle regular addresses
  if (
    (address.startsWith("SP") ||
      address.startsWith("SM") ||
      address.startsWith("ST")) &&
    !address.includes(".")
  ) {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  }

  // Return unchanged for non-Stacks addresses (like BNS names)
  return address;
};

export const formatTimeAgo = (timestamp: number | null): string => {
  if (!timestamp) return "N/A";

  const distance = formatDistanceToNow(new Date(timestamp), {
    addSuffix: true,
  });

  return (
    distance
      .replace("less than a minute", "<1m")
      .replace("about ", "")
      .replace(" ago", "")
      .replace(" hours", "h")
      .replace(" hour", "h")
      .replace(" minutes", "m")
      .replace(" minute", "m")
      .replace(" months", "mo")
      .replace(" month", "mo")
      .replace(" days", "d")
      .replace(" day", "d")
      .replace(" years", "y")
      .replace(" year", "y")
      .replace(" weeks", "w")
      .replace(" week", "w")
      .replace("almost ", "~")
      .replace("over ", ">") + " ago"
  );
};
