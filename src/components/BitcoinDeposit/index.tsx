// Updated BitcoinDeposit/index.tsx
import { useState } from "react";
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  Text,
} from "@chakra-ui/react";
import DepositForm from "./DepositForm";
import MyHistory from "./MyHistory";
import AllDeposits from "./AllDeposits";
import StatusTracker from "./StatusTracker"; // Import the new component
import TransactionConfirmation from "./TransactionConfirmation";
import { useUserSession } from "../../context/UserSessionContext";
import { useFormattedBtcPrice } from "../../hooks/useSdkBtcPrice";
import useSdkPoolStatus from "../../hooks/useSdkPoolStatus";
import useSdkDepositHistory from "../../hooks/useSdkDepositHistory";
import useSdkAllDepositsHistory from "../../hooks/useSdkAllDepositsHistory";
import { TransactionPriority } from "@faktoryfun/styx-sdk";
import React from "react";

export type ConfirmationData = {
  depositAmount: string;
  depositAddress: string;
  stxAddress: string;
  opReturnHex: string;
};

const BitcoinDeposit = () => {
  const { userAddress } = useUserSession();
  const [activeTab, setActiveTab] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationData, setConfirmationData] =
    useState<ConfirmationData | null>(null);
  const [feePriority, setFeePriority] = useState<TransactionPriority>(
    TransactionPriority.Medium
  );
  const { price: btcUsdPrice } = useFormattedBtcPrice();
  const { data: poolStatus } = useSdkPoolStatus();
  const { data: depositHistory, isLoading: isDepositHistoryLoading } =
    useSdkDepositHistory(userAddress);
  const { data: allDepositsHistory, isLoading: isAllDepositsHistoryLoading } =
    useSdkAllDepositsHistory();

  return (
    <Box maxW="500px" mx="auto" mt={8}>
      <Box mb={6} textAlign="center">
        <Text fontSize="xl" color="white">
          Deposit BTC in just 1 Bitcoin block
        </Text>
        <Text fontSize="sm" color="gray.400">
          Fast, secure, and trustless
        </Text>
      </Box>

      <Tabs
        isFitted
        variant="enclosed"
        colorScheme="teal"
        bg="#191B20"
        borderRadius="xl"
        border="1px solid rgba(255, 255, 255, 0.1)"
        boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
        mt={4}
        onChange={(index) => setActiveTab(index)}
      >
        <TabList>
          <Tab
            _selected={{
              color: "white",
              bg: "#2D2D43",
              borderBottomColor: "transparent",
            }}
            color="gray.400"
            borderTopRadius="xl"
            borderBottomRadius="0"
          >
            Deposit
          </Tab>
          <Tab
            _selected={{
              color: "white",
              bg: "#2D2D43",
              borderBottomColor: "transparent",
            }}
            color="gray.400"
            borderTopRadius="xl"
            borderBottomRadius="0"
          >
            My History
          </Tab>
          <Tab
            _selected={{
              color: "white",
              bg: "#2D2D43",
              borderBottomColor: "transparent",
            }}
            color="gray.400"
            borderTopRadius="xl"
            borderBottomRadius="0"
          >
            All Deposits
          </Tab>
          {/* Add new tab for Status Tracker */}
          <Tab
            _selected={{
              color: "white",
              bg: "#2D2D43",
              borderBottomColor: "transparent",
            }}
            color="gray.400"
            borderTopRadius="xl"
            borderBottomRadius="0"
          >
            Track Status
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <DepositForm
              btcUsdPrice={btcUsdPrice || null}
              poolStatus={poolStatus}
              setConfirmationData={setConfirmationData}
              setShowConfirmation={setShowConfirmation}
            />
          </TabPanel>

          <TabPanel>
            <MyHistory
              depositHistory={depositHistory}
              isLoading={isDepositHistoryLoading}
              btcUsdPrice={btcUsdPrice || 100000}
            />
          </TabPanel>

          <TabPanel>
            <AllDeposits
              allDepositsHistory={allDepositsHistory}
              isLoading={isAllDepositsHistoryLoading}
              btcUsdPrice={btcUsdPrice || 100000}
            />
          </TabPanel>

          {/* Add new tab panel for Status Tracker */}
          <TabPanel>
            <StatusTracker />
          </TabPanel>
        </TabPanels>
      </Tabs>

      {showConfirmation && confirmationData && (
        <TransactionConfirmation
          confirmationData={confirmationData}
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          feePriority={feePriority}
          setFeePriority={setFeePriority}
        />
      )}
    </Box>
  );
};

export default BitcoinDeposit;
