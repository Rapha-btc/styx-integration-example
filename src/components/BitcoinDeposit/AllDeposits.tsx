// components/BitcoinDeposit/AllDeposits.tsx
import React from "react";
import {
  VStack,
  Box,
  Text,
  SimpleGrid,
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
import {
  formatTimeAgo,
  getBackgroundColor,
  formatAddress2,
} from "../../utils/addressUtils";
import useResolveBnsOrAddress from "../../hooks/useResolveBnsOrAddress";

interface AllDepositsProps {
  allDepositsHistory: Deposit[] | undefined;
  isLoading: boolean;
  btcUsdPrice: number | null;
}

// AddressCell Component
const AddressCell: React.FC<{ address: string }> = ({ address }) => {
  const { data } = useResolveBnsOrAddress(address);
  const displayAddress =
    data?.resolvedValue && !data.resolvedValue.startsWith("SP")
      ? data.resolvedValue // Show BNS names
      : formatAddress2(address);
  const bgColor = getBackgroundColor(address);

  const handleAddressClick = () => {
    window.open(
      `https://explorer.hiro.so/address/${address}?chain=mainnet`,
      "_blank"
    );
  };

  return (
    <Box
      display="inline-block"
      bg={bgColor}
      px={2}
      py={1}
      borderRadius="lg"
      fontSize="xs"
      _hover={{ opacity: 0.8, cursor: "pointer" }}
      onClick={handleAddressClick}
    >
      {displayAddress}
    </Box>
  );
};

const AllDeposits: React.FC<AllDepositsProps> = ({
  allDepositsHistory,
  isLoading,
  btcUsdPrice,
}) => {
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
      <Text color="white" fontSize="lg" fontWeight="medium" mb={2}>
        Recent Network Activity
      </Text>

      {/* Stats summary box at the top */}
      {!isLoading && allDepositsHistory && allDepositsHistory.length > 0 && (
        <Box
          bg="#1A1A2F"
          p={4}
          borderRadius="xl"
          border="1px solid rgba(255, 255, 255, 0.1)"
        >
          <SimpleGrid columns={3} spacing={4}>
            <Box textAlign="center">
              <Text color="gray.400" fontSize="xs">
                Total Deposits
              </Text>
              <Text color="teal.300" fontSize="xl" fontWeight="bold">
                {allDepositsHistory.length}
              </Text>
            </Box>
            <Box textAlign="center">
              <Text color="gray.400" fontSize="xs">
                Total Volume
              </Text>
              <Text color="teal.300" fontSize="xl" fontWeight="bold">
                {formatBtcAmount(
                  allDepositsHistory.reduce(
                    (sum: number, deposit: Deposit) => sum + deposit.btcAmount,
                    0
                  )
                )}
              </Text>
              <Text color="gray.500" fontSize="xs">
                BTC
              </Text>
            </Box>
            <Box textAlign="center">
              <Text color="gray.400" fontSize="xs">
                Unique Users
              </Text>
              <Text color="teal.300" fontSize="xl" fontWeight="bold">
                {
                  new Set(
                    allDepositsHistory.map(
                      (deposit: Deposit) => deposit.stxReceiver
                    )
                  ).size
                }
              </Text>
            </Box>
          </SimpleGrid>
        </Box>
      )}

      {isLoading ? (
        <Flex justify="center" py={8}>
          <Spinner color="teal.300" size="lg" />
        </Flex>
      ) : allDepositsHistory && allDepositsHistory.length > 0 ? (
        <Box
          bg="#242731"
          borderRadius="xl"
          overflow="hidden"
          border="1px solid rgba(255, 255, 255, 0.1)"
        >
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
                  User
                </Th>
                <Th color="gray.400" borderColor="rgba(255, 255, 255, 0.1)">
                  Tx ID
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {allDepositsHistory.map((deposit: Deposit) => (
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
                    <AddressCell address={deposit.stxReceiver} />
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
            Network activity will appear here once deposits are made
          </Text>
        </Box>
      )}
    </VStack>
  );
};

export default AllDeposits;
