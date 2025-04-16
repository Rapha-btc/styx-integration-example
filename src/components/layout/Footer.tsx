import React from "react";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Link,
  Image,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaTwitter, FaDiscord, FaTelegram, FaEnvelope } from "react-icons/fa";
import ColorModeSwitch from "./ColorModeSwitch";
import logo from "../../assets/Fak.png";

const Footer = () => {
  const { colorMode } = useColorMode();
  const bgColor = useColorModeValue("gray.100", "gray.800");
  const titleColor = useColorModeValue("gray.800", "white");
  const linkColor = useColorModeValue("gray.600", "gray.400");

  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const email = "fak@faktory.fun";
    const subject = "Contact from Faktory Fun Website";
    const body = "Hello, I would like to get in touch regarding...";

    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`,
      "_blank"
    );
  };

  return (
    <Box as="footer" width="100%" py={8} bg={bgColor} color={titleColor}>
      <Flex
        maxWidth="1200px"
        margin="0 auto"
        justifyContent="space-between"
        alignItems="flex-start"
        flexDirection={{ base: "column", md: "row" }}
        gap={8}
      >
        <HStack spacing={4} align="center">
          <Link href="https://faktory.fun/" isExternal>
            <Image src={logo} alt="Fak Logo" boxSize="80px" />
          </Link>
          <Text
            fontSize="1.5em"
            fontWeight="bold"
            color={colorMode === "light" ? "black" : "white"}
          >
            faktory.fun
          </Text>
        </HStack>

        <Box
          width="1px"
          height="80px"
          bg="gray.600"
          display={{ base: "none", md: "block" }}
        />

        <Flex gap={8} flexWrap="wrap" justifyContent="center">
          <VStack align="flex-start" spacing={2}>
            <Text fontWeight="bold">About</Text>
            {/* <Link href="https://docs.jing.cash/" isExternal color={linkColor}>
              Docs
            </Link> */}
            {/* <Link href="/token-whitelist" color={linkColor}>
              Token list
            </Link> */}

            <Link href="/create" color={linkColor}>
              Create Token
            </Link>
            <Link href="/airdrop" color={linkColor}>
              Airdrop
            </Link>
            <Link
              href="https://www.npmjs.com/package/@faktoryfun/core-sdk"
              color={linkColor}
              target="_blank"
              rel="noopener noreferrer"
            >
              SDK
            </Link>
            <Link
              href="/Faktory-audit.pdf"
              color={linkColor}
              target="_blank"
              rel="noopener noreferrer"
            >
              Audit Report
            </Link>
            {/* <Link href="/dashboard" color={linkColor}>
              Dashboard
            </Link> */}
          </VStack>

          <VStack align="flex-start" spacing={2}>
            <Text fontWeight="bold">Legal</Text>
            <Link href="/disclaimer-and-terms-of-use" color={linkColor}>
              Disclaimer & Terms of Use
            </Link>
            {/* <Link href="#" color={linkColor}>
              Privacy Policy
            </Link> */}
          </VStack>

          <VStack align="flex-start" spacing={2}>
            <Text fontWeight="bold">Socials</Text>
            <Link
              href="https://discord.gg/Tq6yykqbtS"
              isExternal
              color={linkColor}
            >
              <FaDiscord size={24} />
            </Link>
            <Link href="https://x.com/fakdotfun" isExternal color={linkColor}>
              <FaTwitter size={24} />
            </Link>
            <Link
              href="https://t.me/+tMuIKWzmvr01MmQx"
              isExternal
              color={linkColor}
            >
              <FaTelegram size={24} />
            </Link>
            <Link href="#" onClick={handleEmailClick} color={linkColor}>
              <FaEnvelope size={24} />
            </Link>
          </VStack>

          <HStack align="flex-start" spacing={2}>
            <ColorModeSwitch />
          </HStack>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Footer;
