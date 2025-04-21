// components/BitcoinDeposit/MyHistory.tsx
import React from "react";
import {
  VStack,
  Box,
  Text,
  Button,
  Flex,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Link,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Deposit } from "@faktoryfun/styx-sdk";
import { authenticate } from "../../stxConnect/auth";
import { formatTimeAgo } from "../../utils/addressUtils";
import { useUserSession } from "../../context/UserSessionContext";

interface MyHistoryProps {
  depositHistory: Deposit[] | undefined;
  isLoading: boolean;
  btcUsdPrice: number | null;
  isRefetching?: boolean;
}

const MyHistory: React.FC<MyHistoryProps> = ({
  depositHistory,
  isLoading,
  btcUsdPrice,
  isRefetching = false,
}) => {
  const { isSignedIn } = useUserSession();

  // Format BTC amount for display
  const formatBtcAmount = (amount: number | null): string => {
    if (amount === null || amount === undefined) return "0.00000000";
    return amount.toFixed(8);
  };

  // Format USD value
  const formatUsdValue = (amount: number): string => {
    if (!amount || amount <= 0) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Get status badge color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "broadcast":
        return "yellow";
      case "processing":
        return "blue";
      case "confirmed":
        return "green";
      default:
        return "gray";
    }
  };

  // Get truncated tx id for display
  const getTruncatedTxId = (txId: string | null): string => {
    if (!txId) return "N/A";
    return `${txId.substring(0, 6)}...${txId.substring(txId.length - 4)}`;
  };

  return (
    <VStack spacing={4} align="stretch" p={4}>
      {!isSignedIn ? (
        <Box textAlign="center" py={8}>
          <Text color="gray.400" mb={4}>
            Connect your wallet to view your deposit history
          </Text>
          <Button
            colorScheme="teal"
            onClick={() => authenticate()}
            bg="#2FCCB0"
            color="black"
            _hover={{ bg: "#2AB79F" }}
          >
            Connect Wallet
          </Button>
        </Box>
      ) : isLoading ? (
        <Flex justify="center" py={8}>
          <Spinner color="teal.300" size="lg" />
        </Flex>
      ) : depositHistory && depositHistory.length > 0 ? (
        <Box
          bg="#242731"
          borderRadius="xl"
          overflow="hidden"
          border="1px solid rgba(255, 255, 255, 0.1)"
          position="relative"
        >
          {/* Add refetching overlay */}
          {isRefetching && (
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              bg="rgba(0, 0, 0, 0.6)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              zIndex="10"
              borderRadius="xl"
            >
              <VStack>
                <Spinner color="teal.300" size="md" />
                <Text color="white" fontSize="sm">
                  Updating history...
                </Text>
              </VStack>
            </Box>
          )}
          <Table variant="simple" size="sm">
            <Thead bg="#1A1A2F">
              <Tr>
                <Th color="gray.400" borderColor="rgba(255, 255, 255, 0.1)">
                  Time
                </Th>
                <Th color="gray.400" borderColor="rgba(255, 255, 255, 0.1)">
                  Amount
                </Th>
                <Th color="gray.400" borderColor="rgba(255, 255, 255, 0.1)">
                  Status
                </Th>
                <Th color="gray.400" borderColor="rgba(255, 255, 255, 0.1)">
                  Tx ID
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {depositHistory.map((deposit: Deposit) => (
                <Tr key={deposit.id}>
                  <Td borderColor="rgba(255, 255, 255, 0.1)" py={3}>
                    <Text color="white" fontSize="xs">
                      {formatTimeAgo(deposit.createdAt)}
                    </Text>
                  </Td>
                  <Td borderColor="rgba(255, 255, 255, 0.1)" py={3}>
                    <Text color="white" fontSize="xs">
                      {formatBtcAmount(deposit.btcAmount)}
                    </Text>
                    <Text color="gray.400" fontSize="xx-small">
                      {formatUsdValue(deposit.btcAmount * (btcUsdPrice || 0))}
                    </Text>
                  </Td>
                  <Td borderColor="rgba(255, 255, 255, 0.1)" py={3}>
                    <Badge
                      colorScheme={getStatusColor(deposit.status)}
                      px={2}
                      py={1}
                      borderRadius="md"
                      fontSize="2xs"
                      textTransform="capitalize"
                    >
                      {deposit.status}
                    </Badge>
                  </Td>
                  <Td borderColor="rgba(255, 255, 255, 0.1)" py={3}>
                    {deposit.btcTxId ? (
                      <Link
                        href={`https://mempool.space/tx/${deposit.btcTxId}`}
                        isExternal
                        color="teal.300"
                        fontSize="xs"
                        display="flex"
                        alignItems="center"
                      >
                        {getTruncatedTxId(deposit.btcTxId)}
                        <ExternalLinkIcon ml={1} boxSize={3} />
                      </Link>
                    ) : (
                      <Text color="gray.400" fontSize="xs">
                        N/A
                      </Text>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      ) : (
        <Box
          textAlign="center"
          py={8}
          bg="#242731"
          borderRadius="xl"
          border="1px solid rgba(255, 255, 255, 0.1)"
        >
          <Text color="gray.400">No deposit history found</Text>
          <Text color="gray.500" fontSize="sm" mt={2}>
            Make your first deposit to see it here
          </Text>
        </Box>
      )}
    </VStack>
  );
};

export default MyHistory;
