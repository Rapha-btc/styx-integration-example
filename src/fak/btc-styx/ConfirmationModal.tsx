import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  VStack,
  Text,
  Box,
  Link,
  Flex,
  HStack,
} from "@chakra-ui/react";
import { CheckIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import ConfettiOverlay from "../utils/ConfettiOverlay";
import { getImageUrl } from "../utils/uploadHelpers";
import MediaDisplay from "../utils/MediaDisplay";
import { formatCompactSTX } from "../utils/numberUtils";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionType: "Buy" | "Sell" | "Claim" | "Refund" | "Airdrop";
  amount: string;
  token: {
    symbol: string;
    logoUrl: string;
    name: string;
    decimals: number;
  };
  txId: string;
  isSponsorTransaction?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  transactionType,
  amount,
  token,
  txId,
  isSponsorTransaction,
}) => {
  let formattedAmount = "";
  if (amount && token.symbol) {
    try {
      const parsedAmount = parseFloat(amount);
      const convertedAmount = parsedAmount / Math.pow(10, token.decimals);

      // Special formatting for BTC to show 8 decimals
      if (token.symbol === "BTC" || token.symbol === "sBTC") {
        formattedAmount = convertedAmount.toFixed(8);
      } else {
        formattedAmount = formatCompactSTX(convertedAmount);
      }
    } catch (error) {
      console.error("Error formatting amount:", error);
      formattedAmount = amount;
    }
  }

  if (!isOpen || !token.symbol || !amount) {
    return null;
  }

  return (
    <>
      <ConfettiOverlay isActive={isOpen} />
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalBody py={8}>
            <VStack spacing={6}>
              <HStack spacing={4} alignItems="center">
                <Box
                  bg="green.500"
                  borderRadius="full"
                  p={3}
                  color="white"
                  fontSize="3xl"
                >
                  <CheckIcon w={8} h={8} />
                </Box>

                <Box flex="none">
                  <MediaDisplay
                    src={getImageUrl(token.logoUrl, token.symbol)}
                    alt={token.name}
                    fallbackSrc="/icons/UASU.svg"
                    width={24}
                    height={24}
                  />
                </Box>
              </HStack>

              <Text fontSize="2xl" fontWeight="bold">
                {transactionType} {formattedAmount} {token.symbol}
              </Text>
              {!isSponsorTransaction && (
                <Link
                  href={`https://explorer.hiro.so/txid/${txId}?chain=mainnet`}
                  isExternal
                  color="blue.500"
                >
                  <Flex align="center">
                    <Text mr={1}>View transaction</Text>
                    <ExternalLinkIcon mx="2px" />
                  </Flex>
                </Link>
              )}
              {isSponsorTransaction ? (
                <Text textAlign="center" fontSize="sm" color="gray.500">
                  A sponsor pays your transaction fees. You'll receive a
                  transaction ID in a few seconds.
                </Text>
              ) : (
                <Text textAlign="center" fontSize="sm" color="gray.500">
                  Your transaction takes at least 1 Stacks block to confirm.
                </Text>
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConfirmationModal;
