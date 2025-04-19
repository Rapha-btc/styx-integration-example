import React, { useState } from "react";
import { useUserSession } from "../context/UserSessionContext";
import { authenticate, requestLeatherBtcAddress } from "./auth";
import {
  Button,
  ButtonProps,
  Text,
  Box,
  Image,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useBreakpointValue,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import BnsResolver from "./BnsResolver";
import { LuLogOut } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

// Import wallet icons
import leatherIcon from "../assets/Leather.jpg";
import xverseIcon from "../assets/xverse.png";

// Define the ConnectWallet component props
interface ConnectWalletProps extends ButtonProps {
  walletProvider?: "leather" | "xverse";
  walletIconPath?: string;
  activeChain?: "bitcoin" | "stacks";
}

const ConnectWallet: React.FC<ConnectWalletProps> = ({
  walletProvider = "leather",
  walletIconPath,
  activeChain = "bitcoin",
  ...props
}) => {
  const {
    isSignedIn,
    userAddress,
    btcAddress,
    stxBalance,
    btcBalance,
    sbtcBalance, // Using sBTC balance from context
    userSession,
    activeWalletProvider,
  } = useUserSession();
  const [bnsName, setBnsName] = useState<string | null>(null);
  const isMobile = useBreakpointValue({ base: true, md: false });

  const navigate = useNavigate();

  // Replace redirect function
  const handleDepositRedirect = () => {
    navigate("/deposit");
  };

  // In ConnectWallet.tsx - Updated handleClick with debugging

  // In ConnectWallet.tsx
  const handleClick = async () => {
    if (!isSignedIn) {
      // Not signed in, authenticate normally
      authenticate();
    } else if (!btcAddress) {
      // Connected to Stacks but no BTC address - connect Bitcoin
      try {
        console.log("Requesting BTC address from Leather...");

        // Request addresses through Leather API
        if (window.LeatherProvider) {
          const response = await window.LeatherProvider.request(
            "getAddresses",
            {
              currencies: ["BTC"],
            }
          );

          console.log("BTC address response:", response);

          // If we got a successful response with a BTC address
          if (response?.result?.addresses) {
            const btcAddressInfo = response.result.addresses.find(
              (addr: { symbol: string; address?: string }) =>
                addr.symbol === "BTC"
            );

            if (btcAddressInfo?.address) {
              console.log("Got BTC address:", btcAddressInfo.address);

              // Store the BTC address in local storage so it persists
              localStorage.setItem("btcAddress", btcAddressInfo.address);

              // Force a page reload to update the UI
              window.location.reload();
              return;
            }
          }
        }
      } catch (error) {
        console.error("Error connecting Bitcoin:", error);
      }
    } else {
      // Both Stacks and BTC connected - clicking should disconnect
      userSession.signUserOut();
      localStorage.removeItem("btcAddress"); // Clear the stored BTC address
      window.location.reload();
    }
  };

  // Format the BTC or sBTC balance to 8 decimal places
  const formatBtcBalance = (balance: number | null): string => {
    if (balance === null) return "0.00000000";
    return balance.toFixed(8);
  };

  // Get the appropriate address based on active chain and device
  const getDisplayAddress = () => {
    console.log("getDisplayAddress called with:", {
      isSignedIn,
      userAddress,
      btcAddress,
      bnsName,
      activeChain,
      isMobile,
    });

    if (!isSignedIn) return "";

    // Check if the bnsName is just the raw STX address (not a real BNS name)
    const isBnsActuallyRawAddress =
      bnsName &&
      userAddress &&
      (bnsName === userAddress ||
        bnsName.toLowerCase() === userAddress.toLowerCase());

    // Only consider bnsName valid if it's a real .btc name (not the raw address)
    const hasValidBns = bnsName && !isBnsActuallyRawAddress;

    // Mobile behavior - only prioritize BNS if it's a real .btc name
    if (isMobile) {
      if (hasValidBns) {
        console.log("Mobile view with valid BNS name, returning:", bnsName);
        return bnsName;
      }

      if (btcAddress) {
        console.log(
          "Mobile view without valid BNS, returning BTC address:",
          `${btcAddress.slice(0, 4)}...`
        );
        return `${btcAddress.slice(0, 4)}...`;
      }

      if (userAddress) {
        return `${userAddress.slice(0, 4)}...`;
      }

      return "No Address"; // Fallback if no address is available
    }

    // Desktop behavior - respect active chain
    if (activeChain === "bitcoin") {
      console.log("Desktop Bitcoin chain active");
      console.log("BTC Address value:", btcAddress);

      if (!btcAddress) {
        console.log("No BTC address detected, showing Connect BTC");
        return "Connect BTC";
      }

      const displayAddress = `${btcAddress.slice(0, 6)}...${btcAddress.slice(
        -4
      )}`;
      console.log("BTC address found, showing:", displayAddress);
      return displayAddress;
    } else {
      console.log("Desktop Stacks chain active");
      if (hasValidBns) return bnsName;
      if (!userAddress) return "No STX Address";
      return `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
    }
  };

  const handleNameResolved = (name: string | null) => {
    setBnsName(name);
  };

  // Get wallet icon
  const getWalletIcon = () => {
    if (walletIconPath) {
      return (
        <Box width="20px" height="20px" mr={1}>
          <Image
            src={walletIconPath}
            alt={`${activeWalletProvider || walletProvider} wallet`}
            width="100%"
            height="100%"
          />
        </Box>
      );
    }

    // Return a fallback with the correct icon based on detected wallet provider
    return (
      <Box
        width="20px"
        height="20px"
        mr={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Image
          src={activeWalletProvider === "xverse" ? xverseIcon : leatherIcon}
          alt={activeWalletProvider === "xverse" ? "Xverse" : "Leather"}
          width="100%"
          height="100%"
        />
      </Box>
    );
  };

  // Get Bitcoin icon for balance display
  const getBitcoinIcon = () => (
    <Box
      width="24px"
      height="24px"
      mr={1}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="12" fill="#F7931A" />
        <path
          d="M16.662 10.147c.225-1.505-.921-2.315-2.49-2.856l.509-2.039-1.242-.31-.495 1.986c-.326-.082-.661-.158-.994-.234l.498-1.996-1.241-.309-.509 2.038c-.27-.061-.535-.123-.791-.187l.001-.007-1.714-.428-.33 1.324s.921.212.902.225c.503.125.593.458.578.722l-.578 2.318c.034.009.079.021.128.041l-.13-.033-.81 3.247c-.061.152-.217.38-.566.293.012.018-.902-.225-.902-.225l-.616 1.424 1.618.404c.3.076.595.154.885.229l-.514 2.061 1.24.31.509-2.042c.339.092.668.177.99.258l-.507 2.032 1.242.31.514-2.059c2.12.401 3.715.24 4.387-1.676.544-1.542-.027-2.431-1.15-3.011.818-.189 1.435-.725 1.6-1.835zm-2.863 4.005c-.387 1.542-2.998.709-3.845.5l.686-2.749c.847.211 3.564.63 3.159 2.25zm.386-4.005c-.351 1.407-2.524.692-3.225.517l.622-2.493c.701.175 2.969.502 2.603 1.976z"
          fill="white"
        />
      </svg>
    </Box>
  );

  // Handle disconnect
  const handleDisconnect = () => {
    userSession.signUserOut();
    window.location.reload();
  };

  // Get the balance based on active chain
  const getBalance = () => {
    if (activeChain === "bitcoin") {
      return formatBtcBalance(btcBalance);
    } else {
      return formatBtcBalance(sbtcBalance);
    }
  };

  if (!isSignedIn) {
    return (
      <Button
        onClick={handleClick}
        borderRadius="md"
        bg="#FF6B00"
        color="white"
        size="md"
        height="38px"
        px={isMobile ? 2 : 6}
        _hover={{ bg: "#E05F00" }}
        fontWeight="semibold"
        {...props}
      >
        Connect wallet
      </Button>
    );
  }

  // Desktop view (unchanged)
  if (!isMobile) {
    return (
      <>
        <HStack spacing={3}>
          {/* Wallet Address Button */}
          <Button
            onClick={handleClick}
            borderRadius="xl"
            bg="#1E1E1E"
            color="white"
            size="md"
            height="44px"
            border="none"
            _hover={{ bg: "#2A2A2A" }}
            px={4}
            leftIcon={getWalletIcon()}
            {...props}
          >
            <Text fontSize="sm" fontWeight="medium">
              {getDisplayAddress()}
            </Text>
          </Button>

          {/* Balance Button */}
          <Button
            borderRadius="xl"
            bg="#1E1E1E"
            color="white"
            size="md"
            height="44px"
            border="none"
            _hover={{ bg: "#2A2A2A" }}
            px={4}
            leftIcon={getBitcoinIcon()}
            onClick={handleDepositRedirect}
            cursor="pointer"
          >
            <Text fontSize="sm" fontWeight="medium">
              {getBalance()}
            </Text>
          </Button>
        </HStack>

        {isSignedIn && userAddress && (
          <BnsResolver
            userAddress={userAddress}
            onNameResolved={handleNameResolved}
          />
        )}
      </>
    );
  }

  // Mobile view with dropdown
  return (
    <>
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          borderRadius="xl"
          bg="#1E1E1E"
          color="white"
          size="md"
          height="38px"
          border="none"
          _hover={{ bg: "#2A2A2A" }}
          px={4}
          leftIcon={getWalletIcon()}
          {...props}
        >
          <Text fontSize="sm" fontWeight="medium">
            {getDisplayAddress()}
          </Text>
        </MenuButton>

        <MenuList
          bg="gray.900"
          borderColor="gray.700"
          py={1} // Reduced from py={2}
          px={2} // Add horizontal padding
          shadow="xl"
          minW="auto" // This prevents extra width
          mt={1} // Reduce margin between button and menu
        >
          {" "}
          {/* BTC Balance Item */}
          <MenuItem
            bg="gray.900"
            _hover={{ bg: "gray.800" }}
            _focus={{ bg: "gray.800" }}
            height="36px"
            px={2}
            onClick={handleDepositRedirect}
          >
            <HStack>
              {getBitcoinIcon()}
              <Box>
                <Text fontSize="xs" color="gray.500" lineHeight="1">
                  BTC
                </Text>
                <Text fontSize="sm" fontWeight="medium">
                  {formatBtcBalance(btcBalance)}
                </Text>
              </Box>
            </HStack>
          </MenuItem>
          {/* sBTC Balance Item */}
          <MenuItem
            bg="gray.900"
            _hover={{ bg: "gray.800" }}
            _focus={{ bg: "gray.800" }}
            height="36px"
            px={2}
            onClick={handleDepositRedirect}
          >
            <HStack>
              {getBitcoinIcon()}
              <Box>
                <Text fontSize="xs" color="gray.500" lineHeight="1">
                  sBTC
                </Text>
                <Text fontSize="sm" fontWeight="medium">
                  {formatBtcBalance(sbtcBalance)}
                </Text>
              </Box>
            </HStack>
          </MenuItem>
          {/* Deposit Item */}
          <MenuItem
            onClick={handleDepositRedirect}
            bg="gray.900"
            _hover={{ bg: "gray.800" }}
            _focus={{ bg: "gray.800" }}
            height="40px"
          >
            <HStack spacing={2}>
              <Box
                width="14px"
                height="14px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 4V20M12 4L6 10M12 4L18 10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Box>
              <Text fontSize="xs" fontWeight="medium">
                Deposit
              </Text>
            </HStack>
          </MenuItem>
          {/* Disconnect Item */}
          <MenuItem
            onClick={handleDisconnect}
            bg="gray.900"
            _hover={{ bg: "gray.800" }}
            _focus={{ bg: "gray.800" }}
            height="40px"
          >
            <HStack spacing={2}>
              <LuLogOut size={14} />
              <Text fontSize="xs" fontWeight="medium">
                Disconnect
              </Text>
            </HStack>
          </MenuItem>
        </MenuList>
      </Menu>

      {isSignedIn && userAddress && (
        <BnsResolver
          userAddress={userAddress}
          onNameResolved={handleNameResolved}
        />
      )}
    </>
  );
};

export default ConnectWallet;
