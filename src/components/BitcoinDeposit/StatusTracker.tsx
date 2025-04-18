// components/BitcoinDeposit/StatusTracker.tsx
import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  Divider,
  Spinner,
  Alert,
  AlertIcon,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
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

  const StatusBadge = ({ status }: { status: string }) => {
    let color;
    switch (status) {
      case "initiated":
        color = "yellow";
        break;
      case "broadcast":
        color = "orange";
        break;
      case "processing":
        color = "blue";
        break;
      case "confirmed":
        color = "green";
        break;
      case "refund-requested":
        color = "purple";
        break;
      case "canceled":
        color = "red";
        break;
      default:
        color = "gray";
    }
    return <Badge colorScheme={color}>{status}</Badge>;
  };

  const StatusDisplay = ({
    title,
    data,
    isLoading,
    error,
    refetch,
  }: {
    title: string;
    data: any;
    isLoading: boolean;
    error: any;
    refetch: () => void;
  }) => (
    <Box p={4} bg="#2D2D43" borderRadius="md" mt={4}>
      <Text fontWeight="bold" mb={2}>
        {title}
      </Text>
      {isLoading ? (
        <Box textAlign="center" py={4}>
          <Spinner />
          <Text mt={2}>Loading status...</Text>
        </Box>
      ) : error ? (
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          Error: {error.message}
        </Alert>
      ) : data ? (
        <VStack align="start" spacing={2}>
          <Box>
            <Text fontWeight="semibold">Status:</Text>
            <StatusBadge status={data.status} />
          </Box>
          <Box>
            <Text fontWeight="semibold">BTC Amount:</Text>
            <Text>{data.btcAmount} BTC</Text>
          </Box>
          <Box>
            <Text fontWeight="semibold">sBTC Amount:</Text>
            <Text>{data.sbtcAmount || "Pending"} sBTC</Text>
          </Box>
          {data.btcTxId && (
            <Box>
              <Text fontWeight="semibold">BTC Transaction:</Text>
              <Text fontSize="sm" isTruncated maxW="100%">
                {data.btcTxId}
              </Text>
            </Box>
          )}
          <Box>
            <Text fontWeight="semibold">Created:</Text>
            <Text>{new Date(data.createdAt).toLocaleString()}</Text>
          </Box>
          {data.updatedAt && (
            <Box>
              <Text fontWeight="semibold">Last Updated:</Text>
              <Text>{new Date(data.updatedAt).toLocaleString()}</Text>
            </Box>
          )}
          <Button size="sm" colorScheme="blue" onClick={() => refetch()}>
            Refresh
          </Button>
        </VStack>
      ) : (
        <Text>No data available</Text>
      )}
    </Box>
  );

  return (
    <Box>
      <Tabs isFitted colorScheme="teal" variant="enclosed">
        <TabList>
          <Tab>Track by Deposit ID</Tab>
          <Tab>Track by Transaction ID</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <form onSubmit={handleDepositIdSubmit}>
              <FormControl>
                <FormLabel>Deposit ID</FormLabel>
                <Input
                  placeholder="Enter your deposit ID"
                  value={depositIdInput}
                  onChange={(e) => setDepositIdInput(e.target.value)}
                />
              </FormControl>
              <Button
                mt={4}
                colorScheme="teal"
                type="submit"
                isDisabled={!depositIdInput.trim()}
              >
                Track Status
              </Button>
            </form>

            {depositId && (
              <StatusDisplay
                title={`Status for Deposit: ${depositId}`}
                data={depositStatus}
                isLoading={isDepositStatusLoading}
                error={depositStatusError}
                refetch={refetchDepositStatus}
              />
            )}
          </TabPanel>

          <TabPanel>
            <form onSubmit={handleBtcTxIdSubmit}>
              <FormControl>
                <FormLabel>Bitcoin Transaction ID</FormLabel>
                <Input
                  placeholder="Enter Bitcoin transaction ID"
                  value={btcTxIdInput}
                  onChange={(e) => setBtcTxIdInput(e.target.value)}
                />
              </FormControl>
              <Button
                mt={4}
                colorScheme="teal"
                type="submit"
                isDisabled={!btcTxIdInput.trim()}
              >
                Track Status
              </Button>
            </form>

            {btcTxId && (
              <StatusDisplay
                title={`Status for Transaction: ${btcTxId.substring(0, 10)}...`}
                data={txStatus}
                isLoading={isTxStatusLoading}
                error={txStatusError}
                refetch={refetchTxStatus}
              />
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default StatusTracker;
