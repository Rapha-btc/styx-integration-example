import React, { useState, useEffect } from "react";
import {
  HStack,
  Image,
  Box,
  Button,
  ButtonGroup,
  useBreakpointValue,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/Fak.png";
import ConnectWallet from "../../stxConnect/ConnectWallet";

import TokenSvg from "../../utils/TokenSvg";
import { useUserSession } from "../../context/UserSessionContext";

// Import wallet icons
import leatherIcon from "../assets/Leather.jpg";
import xverseIcon from "../assets/xverse.png";

interface ChainButtonProps {
  isActive: boolean;
  chain: "bitcoin" | "stacks";
  onClick?: () => void;
}

const ChainButton: React.FC<ChainButtonProps> = ({
  isActive,
  chain,
  onClick,
}) => {
  const tokenSymbol = chain === "bitcoin" ? "BTC" : "STX";
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Button
      size="md"
      bg={
        isActive ? (chain === "bitcoin" ? "#1E2123" : "#142B4B") : "transparent"
      }
      color="white"
      borderRadius="xl"
      px={isMobile ? 3 : 6}
      py={2}
      height={isMobile ? "40px" : "50px"}
      _hover={{
        bg: isActive
          ? chain === "bitcoin"
            ? "#282B2D"
            : "#1A3256"
          : chain === "bitcoin"
          ? "#1E2123"
          : "#142B4B",
        "& > *": {
          opacity: isActive ? 0.8 : 0.5,
        },
      }}
      _active={{
        bg: isActive
          ? chain === "bitcoin"
            ? "#282B2D"
            : "#1A3256"
          : chain === "bitcoin"
          ? "#1E2123"
          : "#142B4B",
        "& > *": {
          opacity: isActive ? 0.8 : 0.5,
        },
      }}
      transition="all 0.2s ease"
      fontWeight="bold"
      fontSize="16px"
      letterSpacing="0.3px"
      onClick={onClick}
      display="flex"
      alignItems="center"
      gap={3}
      border={
        isActive
          ? chain === "bitcoin"
            ? "1px solid #3F4142"
            : "1px solid #2A5699"
          : "1px solid transparent"
      }
      boxShadow={isActive ? "0px 2px 4px rgba(0, 0, 0, 0.3)" : "none"}
    >
      <Box opacity={isActive ? 1 : 0.5} transition="opacity 0.2s ease">
        <TokenSvg
          token={tokenSymbol}
          width={isMobile ? 20 : 24}
          height={isMobile ? 20 : 24}
        />
      </Box>
      <Box
        display="flex"
        alignItems="center"
        gap={2}
        opacity={isActive ? 1 : 0.5}
        transition="opacity 0.2s ease"
      >
        <Box>{chain === "bitcoin" ? "Bitcoin" : "Stacks"}</Box>
        {isActive && (
          <Box
            width="8px"
            height="8px"
            borderRadius="full"
            bg="#4CAF50"
            boxShadow="0 0 5px #4CAF50"
          />
        )}
      </Box>
    </Button>
  );
};

const NavBar = () => {
  const location = useLocation();
  const [activeChain, setActiveChain] = useState<"bitcoin" | "stacks">(
    "bitcoin"
  );
  const { userSession } = useUserSession();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = "/";
  };

  // Determine wallet provider - you would have this info from your authentication
  const getWalletProvider = () => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      return (
        (userData.profile?.walletProvider as "leather" | "xverse") || "leather"
      );
    }
    return "leather"; // Default
  };

  // Select the appropriate icon based on the provider
  const getWalletIconPath = () => {
    const provider = getWalletProvider();
    return provider === "leather" ? leatherIcon : xverseIcon;
  };

  // handleAiDAOClick
  const handleAiDAOClick = () => {
    window.open("https://faktory.fun/", "_blank");
  };

  const buttonSection = (
    <HStack spacing={useBreakpointValue({ base: 0, md: 4 })}>
      <ButtonGroup
        spacing={2}
        bg="transparent"
        p={1}
        borderRadius="xl"
        display={{ base: "none", md: "flex" }}
      >
        <ChainButton
          isActive={activeChain === "bitcoin"}
          chain="bitcoin"
          onClick={() => setActiveChain("bitcoin")}
        />
        <ChainButton
          isActive={activeChain === "stacks"}
          chain="stacks"
          onClick={() => setActiveChain("stacks")}
        />
      </ButtonGroup>
      <Menu isLazy>
        {({ isOpen }) => (
          <>
            <MenuButton
              as={Button}
              size="sm"
              colorScheme="teal"
              variant="ghost"
              onMouseEnter={(e) => e.currentTarget.click()} // Opens menu on hover
            >
              Discover
            </MenuButton>
            <MenuList bg="gray.900" borderColor="gray.700" py={2} shadow="xl">
              <MenuItem
                as={Link}
                to="/leaderboard"
                bg="gray.900"
                _hover={{
                  bg: "teal.800",
                  color: "teal.200",
                  shadow: "md",
                }}
                _focus={{
                  bg: "teal.800",
                  color: "teal.200",
                }}
                height="40px"
              >
                <Text color="teal.200" fontWeight="medium">
                  leaderboard
                </Text>
              </MenuItem>
              <MenuItem
                as={Link}
                to="/airdrop"
                bg="gray.900"
                _hover={{
                  bg: "teal.800",
                  color: "teal.200",
                  shadow: "md",
                }}
                _focus={{
                  bg: "teal.800",
                  color: "teal.200",
                }}
                height="40px"
              >
                <Text color="teal.200" fontWeight="medium">
                  airdrops
                </Text>
              </MenuItem>
              <MenuItem
                as={Link}
                to="/promo-airdrop"
                bg="gray.900"
                _hover={{
                  bg: "teal.800",
                  color: "teal.200",
                  shadow: "md",
                }}
                _focus={{
                  bg: "teal.800",
                  color: "teal.200",
                }}
                height="40px"
              >
                <HStack spacing={2}>
                  <Text color="teal.200" fontWeight="medium">
                    1% airdrop
                  </Text>
                  <Text
                    color="red.400"
                    fontSize="xs"
                    fontWeight="bold"
                    transform="rotate(-10deg)"
                    px={1}
                  >
                    ⏰ ENDING SOON
                  </Text>
                </HStack>
              </MenuItem>
            </MenuList>
          </>
        )}
      </Menu>
      <Button
        size="sm"
        colorScheme="teal"
        variant="ghost"
        onClick={handleAiDAOClick}
        display={{ base: "none", md: "block" }}
      >
        aiDAO
      </Button>
    </HStack>
  );

  return (
    <Box>
      {/* Mobile Layout: Two rows */}
      <Box display={{ base: "block", md: "none" }}>
        <HStack
          w="full"
          p={2}
          spacing={2}
          align="center"
          justify="space-between"
        >
          <HStack spacing={2}>
            <Link to="/" onClick={handleLogoClick}>
              <Box width="40px" height="auto">
                <Image
                  src={logo}
                  objectFit="contain"
                  width="100%"
                  height="100%"
                  alt="Logo"
                />
              </Box>
            </Link>
            {buttonSection}
          </HStack>
          <HStack spacing={2}>
            <ConnectWallet
              walletProvider={getWalletProvider()}
              walletIconPath={getWalletIconPath()}
              activeChain={activeChain}
            />
          </HStack>
        </HStack>
      </Box>

      {/* Desktop Layout: Single row */}
      <HStack
        display={{ base: "none", md: "flex" }}
        padding="10px"
        spacing={4}
        align="center"
        justify="space-between"
      >
        <HStack spacing={4}>
          <Link to="/" onClick={handleLogoClick}>
            <Box width="50px" height="auto">
              <Image
                src={logo}
                objectFit="contain"
                width="100%"
                height="100%"
                alt="Logo"
              />
            </Box>
          </Link>
          {buttonSection}
        </HStack>

        <HStack spacing={4}>
          <Box flexShrink={0}>
            <ConnectWallet
              walletProvider={getWalletProvider()}
              walletIconPath={getWalletIconPath()}
              activeChain={activeChain}
            />
          </Box>
        </HStack>
      </HStack>
    </Box>
  );
};

export default NavBar;
