// components/BitcoinDeposit/StatusTracker.tsx
import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Link,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import useSdkDepositStatus from "../../hooks/useSdkDepositStatus";
import useSdkDepositStatusByTxId from "../../hooks/useSdkDepositStatusByTxId";

const StatusTracker = () => {
  const [depositId, setDepositId] = useState<string | null>(null);
  const [depositIdInput, setDepositIdInput] = useState("");
  const [btcTxId, setBtcTxId] = useState<string | null>(null);
  const [btcTxIdInput, setBtcTxIdInput] = useState("");

  const {
    data: depositStatus,
    isLoading: isDepositStatusLoading,
    error: depositStatusError,
    refetch: refetchDepositStatus,
  } = useSdkDepositStatus(depositId);

  const {
    data: txStatus,
    isLoading: isTxStatusLoading,
    error: txStatusError,
    refetch: refetchTxStatus,
  } = useSdkDepositStatusByTxId(btcTxId);

  const handleDepositIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (depositIdInput.trim()) {
      setDepositId(depositIdInput.trim());
    }
  };

  const handleBtcTxIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (btcTxIdInput.trim()) {
      setBtcTxId(btcTxIdInput.trim());
    }
  };

  // Get status badge color - same as in MyHistory
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "broadcast":
        return "yellow";
      case "processing":
        return "blue";
      case "confirmed":
        return "green";
      case "refund-requested":
        return "purple";
      case "canceled":
        return "red";
      default:
        return "gray";
    }
  };

  // Get truncated tx id for display - same as in MyHistory
  const getTruncatedTxId = (txId: string | null): string => {
    if (!txId) return "N/A";
    return `${txId.substring(0, 6)}...${txId.substring(txId.length - 4)}`;
  };

  // Format BTC amount for display
  const formatBtcAmount = (amount: number | null): string => {
    if (amount === null || amount === undefined) return "0.00000000";
    return amount.toFixed(8);
  };

  const StatusDisplay = ({
    data,
    isLoading,
    error,
    refetch,
    idType,
  }: {
    data: any;
    isLoading: boolean;
    error: any;
    refetch: () => void;
    idType: "deposit" | "transaction";
  }) => (
    <Box p={4} bg="#2D2D43" borderRadius="md" mt={4}>
      <Text fontWeight="bold" mb={4}>
        Status for deposit #{depositId}
      </Text>

      {isLoading ? (
        <Box textAlign="center" py={4}>
          <Spinner color="teal.300" size="lg" />
          <Text mt={2} color="gray.400">
            Loading status...
          </Text>
        </Box>
      ) : error ? (
        <Box>
          <Alert
            status="error"
            borderRadius="md"
            mb={3}
            bg="#3A273A"
            color="white"
          >
            <AlertIcon />
            {error.response?.status === 404 ? (
              <Text>
                No deposit found with this identifier. Please check the ID and
                try again.
              </Text>
            ) : (
              <Text>Error: {error.message || "Unknown error occurred"}</Text>
            )}
          </Alert>
          <Button size="sm" colorScheme="blue" onClick={() => refetch()}>
            Try Again
          </Button>
        </Box>
      ) : data ? (
        <VStack align="start" spacing={4}>
          <Box w="100%">
            <Text color="gray.400" fontSize="sm">
              Status:
            </Text>
            <Badge
              colorScheme={getStatusColor(data.status)}
              px={2}
              py={1}
              borderRadius="md"
              fontSize="sm"
              textTransform="capitalize"
            >
              {data.status.toUpperCase()}
            </Badge>
          </Box>

          <Box w="100%">
            <Text color="gray.400" fontSize="sm">
              BTC Amount:
            </Text>
            <Text color="white">{formatBtcAmount(data.btcAmount)} BTC</Text>
          </Box>

          <Box w="100%">
            <Text color="gray.400" fontSize="sm">
              sBTC Amount:
            </Text>
            <Text color="white">
              {data.sbtcAmount ? formatBtcAmount(data.sbtcAmount) : "Pending"}{" "}
              sBTC
            </Text>
          </Box>

          <Box w="100%">
            <Text color="gray.400" fontSize="sm">
              BTC Transaction:
            </Text>
            {data.btcTxId ? (
              <Link
                href={`https://mempool.space/tx/${data.btcTxId}`}
                isExternal
                color="teal.300"
                fontSize="md"
                display="flex"
                alignItems="center"
              >
                {getTruncatedTxId(data.btcTxId)}
                <ExternalLinkIcon ml={1} boxSize={3} />
              </Link>
            ) : (
              <Text color="gray.400">N/A</Text>
            )}
          </Box>

          <Box w="100%">
            <Text color="gray.400" fontSize="sm">
              Created:
            </Text>
            <Text color="white">
              {new Date(data.createdAt).toLocaleString()}
            </Text>
          </Box>

          {data.updatedAt && (
            <Box w="100%">
              <Text color="gray.400" fontSize="sm">
                Last Updated:
              </Text>
              <Text color="white">
                {new Date(data.updatedAt).toLocaleString()}
              </Text>
            </Box>
          )}

          <Button
            size="sm"
            colorScheme="teal"
            onClick={() => refetch()}
            bg="#2FCCB0"
            color="black"
            _hover={{ bg: "#2AB79F" }}
            mt={2}
          >
            Refresh
          </Button>
        </VStack>
      ) : (
        <Text color="gray.400">No data available</Text>
      )}
    </Box>
  );

  return (
    <Box>
      <Tabs isFitted colorScheme="teal" variant="enclosed" bg="transparent">
        <TabList>
          <Tab
            _selected={{
              color: "white",
              bg: "#2D2D43",
              borderBottomColor: "transparent",
            }}
            color="gray.400"
          >
            Track by Deposit ID
          </Tab>
          <Tab
            _selected={{
              color: "white",
              bg: "#2D2D43",
              borderBottomColor: "transparent",
            }}
            color="gray.400"
          >
            Track by Transaction ID
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <form onSubmit={handleDepositIdSubmit}>
              <FormControl>
                <FormLabel color="gray.400">Deposit ID</FormLabel>
                <Input
                  placeholder="Enter your deposit ID"
                  value={depositIdInput}
                  onChange={(e) => setDepositIdInput(e.target.value)}
                  bg="#232830"
                  borderColor="rgba(255, 255, 255, 0.1)"
                  _hover={{ borderColor: "teal.300" }}
                  _focus={{ borderColor: "teal.300", boxShadow: "none" }}
                  color="white"
                />
              </FormControl>
              <Button
                mt={4}
                colorScheme="teal"
                type="submit"
                isDisabled={!depositIdInput.trim()}
                bg="#2FCCB0"
                color="black"
                _hover={{ bg: "#2AB79F" }}
              >
                Track Status
              </Button>
            </form>

            {depositId && (
              <StatusDisplay
                data={depositStatus}
                isLoading={isDepositStatusLoading}
                error={depositStatusError}
                refetch={refetchDepositStatus}
                idType="deposit"
              />
            )}
          </TabPanel>

          <TabPanel>
            <form onSubmit={handleBtcTxIdSubmit}>
              <FormControl>
                <FormLabel color="gray.400">Bitcoin Transaction ID</FormLabel>
                <Input
                  placeholder="Enter Bitcoin transaction ID"
                  value={btcTxIdInput}
                  onChange={(e) => setBtcTxIdInput(e.target.value)}
                  bg="#232830"
                  borderColor="rgba(255, 255, 255, 0.1)"
                  _hover={{ borderColor: "teal.300" }}
                  _focus={{ borderColor: "teal.300", boxShadow: "none" }}
                  color="white"
                />
              </FormControl>
              <Button
                mt={4}
                colorScheme="teal"
                type="submit"
                isDisabled={!btcTxIdInput.trim()}
                bg="#2FCCB0"
                color="black"
                _hover={{ bg: "#2AB79F" }}
              >
                Track Status
              </Button>
            </form>

            {btcTxId && (
              <StatusDisplay
                data={txStatus}
                isLoading={isTxStatusLoading}
                error={txStatusError}
                refetch={refetchTxStatus}
                idType="transaction"
              />
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default StatusTracker;
