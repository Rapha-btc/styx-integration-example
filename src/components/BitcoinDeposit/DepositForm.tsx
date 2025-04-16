// components/BitcoinDeposit/DepositForm.tsx
import React, { useState, ChangeEvent } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  HStack,
  Input,
  VStack,
  useToast,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/react";
import { useUserSession } from "../../context/UserSessionContext";
import TokenSvg from "../../utils/TokenSvg";
import { styxSDK } from "@faktoryfun/styx-sdk";
import { MIN_DEPOSIT_SATS, MAX_DEPOSIT_SATS } from "@faktoryfun/styx-sdk";
import { authenticate } from "../../stxConnect/auth";
import { ConfirmationData } from "./index";

interface DepositFormProps {
  btcUsdPrice: number | null;
  poolStatus: any;
  setConfirmationData: (data: ConfirmationData) => void;
  setShowConfirmation: (show: boolean) => void;
}

const DepositForm: React.FC<DepositFormProps> = ({
  btcUsdPrice,
  poolStatus,
  setConfirmationData,
  setShowConfirmation,
}) => {
  const {
    userAddress,
    isSignedIn,
    btcAddress,
    btcBalance,
    activeWalletProvider,
  } = useUserSession();
  const [amount, setAmount] = useState<string>("0.0001");
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const toast = useToast();
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const formatUsdValue = (amount: number): string => {
    if (!amount || amount <= 0) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const calculateUsdValue = (btcAmount: string): number => {
    if (!btcAmount || !btcUsdPrice) return 0;
    const numAmount = parseFloat(btcAmount);
    return isNaN(numAmount) ? 0 : numAmount * btcUsdPrice;
  };

  const calculateFee = (btcAmount: string): string => {
    if (!btcAmount || parseFloat(btcAmount) <= 0) return "0.00000000";
    const numAmount = parseFloat(btcAmount);
    if (isNaN(numAmount)) return "0.00000600";

    return numAmount <= 0.002 ? "0.00003000" : "0.00006000";
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      setSelectedPreset(null);
    }
  };

  const handlePresetClick = (presetAmount: string): void => {
    setAmount(presetAmount);
    setSelectedPreset(presetAmount);
  };

  const handleMaxClick = async (): Promise<void> => {
    if (btcBalance !== null) {
      try {
        const feeRates = await styxSDK.getFeeEstimates();
        const selectedRate = feeRates.medium;
        const estimatedSize = 1 * 70 + 2 * 33 + 12;
        const networkFeeSats = estimatedSize * selectedRate;
        const networkFee = networkFeeSats / 100000000;
        const maxAmount = Math.max(0, btcBalance - networkFee);
        const formattedMaxAmount = maxAmount.toFixed(8);

        setAmount(formattedMaxAmount);
        setSelectedPreset("max");
      } catch (error) {
        console.error("Error calculating max amount:", error);
        const networkFee = 0.000006;
        const maxAmount = Math.max(0, btcBalance - networkFee);
        setAmount(maxAmount.toFixed(8));
        setSelectedPreset("max");
      }
    }
  };

  const handleDepositConfirm = async (): Promise<void> => {
    if (maintenanceMode) {
      toast({
        title: "Scheduled Maintenance",
        description:
          "We know you're eager to test this feature! We're working diligently to implement support for both legacy and segwit addresses ahead of schedule. Deposits will be back online in just a few hours. Thank you for your patience.",
        status: "warning",
        duration: 8000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid BTC amount greater than 0",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!isSignedIn || !userAddress) {
      toast({
        title: "Not connected",
        description: "Please connect your wallet first",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      if (!btcAddress) {
        throw new Error("No Bitcoin address found in your wallet");
      }

      const amountInSats = Math.round(parseFloat(amount) * 100000000);

      if (amountInSats < MIN_DEPOSIT_SATS) {
        toast({
          title: "Minimum deposit required",
          description: `Please deposit at least ${
            MIN_DEPOSIT_SATS / 100000000
          } BTC`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      if (amountInSats > MAX_DEPOSIT_SATS) {
        toast({
          title: "Beta limitation",
          description: `During beta, the maximum deposit amount is ${
            MAX_DEPOSIT_SATS / 100000000
          } BTC. Thank you for your understanding.`,
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      if (poolStatus && amountInSats > poolStatus.estimatedAvailable) {
        toast({
          title: "Insufficient liquidity",
          description: `The pool currently has ${
            poolStatus.estimatedAvailable / 100000000
          } BTC available. Please try a smaller amount.`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      const amountInBTC = parseFloat(amount);
      const networkFeeInBTC = 0.000006;
      const totalRequiredBTC = amountInBTC + networkFeeInBTC;

      if ((btcBalance || 0) < totalRequiredBTC) {
        const shortfallBTC = totalRequiredBTC - (btcBalance || 0);
        throw new Error(
          `Insufficient funds. You need ${shortfallBTC.toFixed(
            8
          )} BTC more to complete this transaction.`
        );
      }

      try {
        console.log("Preparing transaction with SDK...");

        const transactionData = await styxSDK.prepareTransaction({
          amount,
          userAddress,
          btcAddress,
          feePriority: "medium",
          walletProvider: activeWalletProvider,
        });

        console.log("Transaction prepared:", transactionData);

        setConfirmationData({
          depositAmount: amount,
          depositAddress: transactionData.depositAddress,
          stxAddress: userAddress,
          opReturnHex: transactionData.opReturnData,
        });

        setShowConfirmation(true);
      } catch (err: any) {
        console.error("Error preparing transaction:", err);

        if (isInscriptionError(err)) {
          handleInscriptionError(err, toast);
        } else if (isUtxoCountError(err)) {
          handleUtxoCountError(err, toast);
        } else if (isAddressTypeError(err)) {
          handleAddressTypeError(err, activeWalletProvider, toast);
        } else {
          toast({
            title: "Error",
            description:
              err.message || "Failed to prepare transaction. Please try again.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      }
    } catch (err: any) {
      console.error("Error preparing Bitcoin transaction:", err);

      toast({
        title: "Error",
        description:
          err.message ||
          "Failed to prepare Bitcoin transaction. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const presetAmounts: string[] = ["0.001", "0.005", "0.01"];
  const presetLabels: string[] = ["0.001 BTC", "0.005 BTC", "0.01 BTC"];

  return (
    <VStack spacing={{ base: 3, md: 6 }} align="stretch" p={{ base: 2, md: 4 }}>
      {/* From: Bitcoin */}
      <Box>
        <Flex justifyContent="space-between" alignItems="center" mb={2}>
          <HStack>
            <TokenSvg token="BTC" width={20} height={20} />
            <Text color="white" fontWeight="medium">
              Bitcoin
            </Text>
          </HStack>
          <Text color="gray.400" fontSize="sm">
            {formatUsdValue(calculateUsdValue(amount))}
          </Text>
        </Flex>

        <Box position="relative">
          <Input
            value={amount}
            onChange={handleAmountChange}
            placeholder="0.00000000"
            textAlign="right"
            pr="5rem"
            pl="5rem"
            height="60px"
            fontSize="xl"
            bg="#242731"
            border="1px solid rgba(255, 255, 255, 0.1)"
            borderRadius="xl"
            _focus={{
              borderColor: "teal.300",
              boxShadow: "0 0 0 1px teal.300",
            }}
          />
          <Text
            position="absolute"
            right="16px"
            top="50%"
            transform="translateY(-50%)"
            fontSize="md"
            color="white"
            pointerEvents="none"
          >
            BTC
          </Text>
        </Box>

        {/* Preset amounts */}
        <HStack spacing={2} mt={3} mb={0}>
          {presetAmounts.map((presetAmount, index) => (
            <Button
              key={presetAmount}
              size="sm"
              variant={selectedPreset === presetAmount ? "solid" : "outline"}
              color={selectedPreset === presetAmount ? "black" : "gray.200"}
              bg={selectedPreset === presetAmount ? "#FF6B00" : "#1A1A2F"}
              borderColor={
                selectedPreset === presetAmount ? "#FF6B00" : "#3D3D53"
              }
              _hover={{
                bg: selectedPreset === presetAmount ? "#E05F00" : "#2D2D43",
                borderColor:
                  selectedPreset === presetAmount ? "#E05F00" : "#3D3D53",
              }}
              onClick={() => handlePresetClick(presetAmount)}
            >
              {presetLabels[index]}
            </Button>
          ))}
          <Button
            size="sm"
            variant={selectedPreset === "max" ? "solid" : "outline"}
            color={selectedPreset === "max" ? "black" : "gray.200"}
            bg={selectedPreset === "max" ? "#FF6B00" : "#1A1A2F"}
            borderColor={selectedPreset === "max" ? "#FF6B00" : "#3D3D53"}
            _hover={{
              bg: selectedPreset === "max" ? "#E05F00" : "#2D2D43",
              borderColor: selectedPreset === "max" ? "#E05F00" : "#3D3D53",
            }}
            onClick={handleMaxClick}
          >
            MAX
          </Button>
        </HStack>
      </Box>

      {/* Fee Information Box */}
      <Box
        bg="#242731"
        p={4}
        borderRadius="xl"
        mt={0}
        border="1px solid rgba(255, 255, 255, 0.1)"
      >
        <Flex justify="space-between" align="center">
          <Text color="gray.400" fontSize="xs">
            Estimated time
          </Text>
          <Text color="gray.400" fontSize="xs">
            1 Block ~ 10 min
          </Text>
        </Flex>
        <Flex justify="space-between" align="center" mt={2}>
          <Text color="gray.400" fontSize="xs">
            Service fee
          </Text>
          <Text color="gray.400" fontSize="xs">
            {amount && parseFloat(amount) > 0 && btcUsdPrice
              ? formatUsdValue(parseFloat(calculateFee(amount)) * btcUsdPrice)
              : "$0.00"}{" "}
            ~ {calculateFee(amount)} BTC
          </Text>
        </Flex>

        {/* Add Pool Liquidity information */}
        {poolStatus && (
          <Flex justify="space-between" align="center" mt={2}>
            <Text color="gray.400" fontSize="xs">
              Pool liquidity
            </Text>
            <Text color="gray.400" fontSize="xs">
              {formatUsdValue(
                (poolStatus.estimatedAvailable / 100000000) * (btcUsdPrice || 0)
              )}{" "}
              ~ {(poolStatus.estimatedAvailable / 100000000).toFixed(8)} BTC
            </Text>
          </Flex>
        )}
      </Box>

      {/* Accordion with Additional Info */}
      <Box mt={0}>
        <Accordion allowToggle>
          <AccordionItem border="none">
            <h2>
              <AccordionButton
                py={0}
                _hover={{ bg: "transparent" }}
                _focus={{ boxShadow: "none" }}
                justifyContent="flex-end"
              >
                <Text fontSize="xs" color="gray.400" mr={1}>
                  How it works
                </Text>
                <AccordionIcon color="gray.400" fontSize="12px" />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} px={4}>
              <Text
                color="gray.400"
                fontSize="xs"
                lineHeight="1.4"
                maxWidth="100%"
                whiteSpace="normal"
              >
                Your BTC deposit unlocks sBTC via Clarity's direct Bitcoin state
                reading. No intermediaries or multi-signature scheme needed.
                Trustless. Fast. Secure.
              </Text>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>

      {/* Action Button */}
      <Button
        colorScheme="teal"
        size="lg"
        height="60px"
        fontSize="xl"
        onClick={
          isSignedIn
            ? handleDepositConfirm
            : () => {
                authenticate();
              }
        }
        bg="#2FCCB0"
        color="black"
        _hover={{ bg: "#2AB79F" }}
        _active={{ bg: "#249E8B" }}
        boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
      >
        {isSignedIn ? "Confirm Deposit" : "Connect Wallet"}
      </Button>
    </VStack>
  );
};

// Helper functions
function isAddressTypeError(error: Error): boolean {
  return (
    error.message.includes("inputType: sh without redeemScript") ||
    error.message.includes("P2SH") ||
    error.message.includes("redeem script")
  );
}

function handleAddressTypeError(
  error: Error,
  walletProvider: string | null,
  toast: any
): void {
  if (walletProvider === "leather") {
    toast({
      title: "Unsupported Address Type",
      description:
        "Leather wallet does not support P2SH addresses (starting with '3'). Please use a SegWit address (starting with 'bc1') instead.",
      status: "error",
      duration: 8000,
      isClosable: true,
    });
  } else if (walletProvider === "xverse") {
    toast({
      title: "P2SH Address Error",
      description:
        "There was an issue with the P2SH address. This might be due to wallet limitations. Try using a SegWit address (starting with 'bc1') instead.",
      status: "error",
      duration: 8000,
      isClosable: true,
    });
  } else {
    toast({
      title: "P2SH Address Not Supported",
      description:
        "Your wallet doesn't provide the necessary information for your P2SH address. Please try using a SegWit address (starting with bc1) instead.",
      status: "error",
      duration: 8000,
      isClosable: true,
    });
  }
}

function isInscriptionError(error: Error): boolean {
  return error.message.includes("with inscriptions");
}

function handleInscriptionError(error: Error, toast: any): void {
  toast({
    title: "Inscriptions Detected",
    description: error.message,
    status: "warning",
    duration: 8000,
    isClosable: true,
  });
}

function isUtxoCountError(error: Error): boolean {
  return error.message.includes("small UTXOs");
}

function handleUtxoCountError(error: Error, toast: any): void {
  toast({
    title: "Too Many UTXOs",
    description: error.message,
    status: "warning",
    duration: 8000,
    isClosable: true,
  });
}

export default DepositForm;
