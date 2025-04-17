// components/BitcoinDeposit/TransactionConfirmation.tsx
import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  Table,
  Tbody,
  Tr,
  Td,
  Text,
  SimpleGrid,
  Card,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { hex } from "@scure/base";
import * as btc from "@scure/btc-signer";
import { styxSDK, TransactionPriority } from "@faktoryfun/styx-sdk";
import { useUserSession } from "../../context/UserSessionContext";
import { request as xverseRequest } from "sats-connect";
import { ConfirmationData } from "./index";

// Add this to fix the window.LeatherProvider type error
declare global {
  interface Window {
    LeatherProvider: any;
  }
}

interface TransactionConfirmationProps {
  confirmationData: ConfirmationData;
  isOpen: boolean;
  onClose: () => void;
  feePriority: TransactionPriority;
  setFeePriority: (priority: TransactionPriority) => void;
}

interface XverseSignPsbtResponse {
  status: "success" | "error";
  result?: {
    psbt: string;
    txid: string;
  };
  error?: {
    code?: string;
    message?: string;
  };
}

interface FeeEstimate {
  rate: number;
  fee: number;
  time: string;
}

interface FeeEstimates {
  low: FeeEstimate;
  medium: FeeEstimate;
  high: FeeEstimate;
}

const TransactionConfirmation: React.FC<TransactionConfirmationProps> = ({
  confirmationData,
  isOpen,
  onClose,
  feePriority,
  setFeePriority,
}) => {
  const { userAddress, btcAddress, activeWalletProvider } = useUserSession();
  const [btcTxStatus, setBtcTxStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [btcTxId, setBtcTxId] = useState<string>("");
  const [currentDepositId, setCurrentDepositId] = useState<string | null>(null);
  const toast = useToast();
  const [loadingFees, setLoadingFees] = useState(true);

  // Initialize with different rates but 0 fees
  const [feeEstimates, setFeeEstimates] = useState<FeeEstimates>({
    low: { rate: 1, fee: 0, time: "~30 min" },
    medium: { rate: 2, fee: 0, time: "~20 min" },
    high: { rate: 5, fee: 0, time: "~10 min" },
  });

  // Calculate fee estimate for a given transaction size (in vBytes)
  const calculateFeeEstimate = (rate: number, txSize: number = 148): number => {
    return Math.round(txSize * rate);
  };

  // Fetch fee rates as soon as the modal opens
  useEffect(() => {
    const fetchFeeEstimates = async () => {
      if (isOpen) {
        setLoadingFees(true);
        try {
          // Get fee rate estimates from SDK or API
          const feeRates = await styxSDK.getFeeEstimates();

          // Ensure proper separation between tiers
          const lowRate = feeRates.low || 1;
          const mediumRate = Math.max(lowRate + 1, feeRates.medium || 2);
          const highRate = Math.max(mediumRate + 1, feeRates.high || 5);

          // Calculate fees for a standard transaction (~148 vBytes)
          const txSize = 148;

          setFeeEstimates({
            low: {
              rate: lowRate,
              fee: calculateFeeEstimate(lowRate, txSize),
              time: "~30 min",
            },
            medium: {
              rate: mediumRate,
              fee: calculateFeeEstimate(mediumRate, txSize),
              time: "~20 min",
            },
            high: {
              rate: highRate,
              fee: calculateFeeEstimate(highRate, txSize),
              time: "~10 min",
            },
          });
        } catch (error) {
          console.error("Error fetching fee estimates:", error);
          // Fallback to default estimates with proper separation
          setFeeEstimates({
            low: { rate: 1, fee: 148, time: "~30 min" },
            medium: { rate: 2, fee: 296, time: "~20 min" },
            high: { rate: 5, fee: 740, time: "~10 min" },
          });
        } finally {
          setLoadingFees(false);
        }
      }
    };

    fetchFeeEstimates();
  }, [isOpen]);

  const isP2SHAddress = (address: string): boolean => {
    return address?.startsWith("3") || false;
  };

  const executeBitcoinTransaction = async (): Promise<void> => {
    console.log(
      "Starting transaction with activeWalletProvider:",
      activeWalletProvider
    );

    // Use the rate from our fee estimates based on selected priority
    const selectedFeeRate = feeEstimates[feePriority].rate;
    console.log(
      `Using ${feePriority} priority fee rate: ${selectedFeeRate} sat/vB`
    );

    if (!confirmationData) {
      toast({
        title: "Error",
        description: "Missing transaction data",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Begin Bitcoin transaction process
    setBtcTxStatus("pending");

    try {
      // Create deposit record
      console.log("Creating deposit with data:", {
        btcAmount: parseFloat(confirmationData.depositAmount),
        stxReceiver: userAddress || "",
        btcSender: btcAddress || "",
      });

      // Create deposit record which will update pool status (reduce estimated available)
      const depositId = await styxSDK.createDeposit({
        btcAmount: parseFloat(confirmationData.depositAmount),
        stxReceiver: userAddress || "",
        btcSender: btcAddress || "",
      });
      console.log("Create deposit depositId:", depositId);

      // Store deposit ID for later use
      setCurrentDepositId(depositId);

      try {
        if (!activeWalletProvider) {
          throw new Error("No wallet provider detected");
        }

        if (
          activeWalletProvider === "leather" &&
          (typeof window === "undefined" || !window.LeatherProvider)
        ) {
          throw new Error("Leather wallet is not installed or not accessible");
        }

        console.log(
          "Window object has LeatherProvider:",
          !!window.LeatherProvider
        );

        if (!userAddress) {
          throw new Error("STX address is missing or invalid");
        }

        // Use the BTC address from context
        if (!btcAddress) {
          throw new Error("Could not find a valid BTC address in wallet");
        }

        const senderBtcAddress = btcAddress;
        console.log("Using BTC address from context:", senderBtcAddress);

        // Get a transaction prepared for signing
        console.log("Getting prepared transaction from SDK...");
        const preparedTransaction = await styxSDK.prepareTransaction({
          amount: confirmationData.depositAmount,
          userAddress,
          btcAddress,
          feePriority,
          walletProvider: activeWalletProvider,
        });

        // Update fee estimates with actual values from prepared transaction
        // This step is important to show the actual fees that will be used
        // if (preparedTransaction.fee > 0) {
        //   setFeeEstimates((prevEstimates) => ({
        //     low: {
        //       ...prevEstimates.low,
        //       fee: preparedTransaction.fee,
        //     },
        //     medium: {
        //       ...prevEstimates.medium,
        //       fee: preparedTransaction.fee,
        //     },
        //     high: {
        //       ...prevEstimates.high,
        //       fee: preparedTransaction.fee,
        //     },
        //   }));
        // }

        // Execute transaction with prepared data
        console.log("Creating transaction with SDK...");
        const transactionData = await styxSDK.executeTransaction({
          depositId,
          preparedData: {
            utxos: preparedTransaction.utxos,
            opReturnData: preparedTransaction.opReturnData,
            depositAddress: preparedTransaction.depositAddress,
            fee: preparedTransaction.fee,
            changeAmount: preparedTransaction.changeAmount,
            amountInSatoshis: preparedTransaction.amountInSatoshis,
            feeRate: preparedTransaction.feeRate,
            inputCount: preparedTransaction.inputCount,
            outputCount: preparedTransaction.outputCount,
            inscriptionCount: preparedTransaction.inscriptionCount,
          },
          walletProvider: activeWalletProvider,
          btcAddress: senderBtcAddress,
        });

        console.log("Transaction execution prepared:", transactionData);

        // Create a transaction object from the PSBT
        let tx = new btc.Transaction({
          allowUnknownOutputs: true,
          allowUnknownInputs: true,
          disableScriptCheck: false,
        });

        // Load the base transaction from PSBT
        tx = btc.Transaction.fromPSBT(hex.decode(transactionData.txPsbtHex));

        // Handle P2SH for Xverse which requires frontend handling
        const isP2sh = isP2SHAddress(senderBtcAddress);
        if (
          isP2sh &&
          activeWalletProvider === "xverse" &&
          transactionData.needsFrontendInputHandling
        ) {
          console.log("Adding P2SH inputs specifically for Xverse");

          // Only for P2SH + Xverse, do we need to add inputs - in all other cases the backend handled it
          for (const utxo of preparedTransaction.utxos) {
            try {
              // First, try to get the account (which might fail if we don't have permission)
              console.log("Trying to get wallet account...");
              let walletAccount = await (xverseRequest as any)(
                "wallet_getAccount",
                null
              );

              // If we get an access denied error, we need to request permissions
              if (
                walletAccount.status === "error" &&
                walletAccount.error.code === -32002
              ) {
                console.log("Access denied. Requesting permissions...");

                // Request permissions using wallet_requestPermissions as shown in the docs
                const permissionResponse = await (xverseRequest as any)(
                  "wallet_requestPermissions",
                  null
                );
                console.log("Permission response:", permissionResponse);

                // If the user granted permission, try again to get the account
                if (permissionResponse.status === "success") {
                  console.log(
                    "Permission granted. Trying to get wallet account again..."
                  );
                  walletAccount = await (xverseRequest as any)(
                    "wallet_getAccount",
                    null
                  );
                } else {
                  throw new Error("User declined to grant permissions");
                }
              }

              console.log("Wallet account response:", walletAccount);

              if (
                walletAccount.status === "success" &&
                walletAccount.result.addresses
              ) {
                // Find the payment address that matches our sender address
                const paymentAddress = (
                  walletAccount.result as any
                ).addresses.find(
                  (addr: any) =>
                    addr.address === senderBtcAddress &&
                    addr.purpose === "payment"
                );

                if (paymentAddress && paymentAddress.publicKey) {
                  console.log(
                    "Found matching public key for P2SH address:",
                    paymentAddress.publicKey
                  );

                  // Create P2SH-P2WPKH from public key as shown in documentation
                  const publicKeyBytes = hex.decode(paymentAddress.publicKey);
                  const p2wpkh = btc.p2wpkh(publicKeyBytes, btc.NETWORK);
                  const p2sh = btc.p2sh(p2wpkh, btc.NETWORK);

                  // Add input with redeemScript
                  tx.addInput({
                    txid: utxo.txid,
                    index: utxo.vout,
                    witnessUtxo: {
                      script: p2sh.script,
                      amount: BigInt(utxo.value),
                    },
                    redeemScript: p2sh.redeemScript,
                  });
                } else {
                  throw new Error(
                    "Could not find payment address with public key"
                  );
                }
              } else {
                throw new Error("Failed to get wallet account info");
              }
            } catch (err) {
              console.error("Error getting wallet account info:", err);
              throw new Error(
                "P2SH address requires access to the public key. Please use a SegWit address (starting with 'bc1') or grant necessary permissions."
              );
            }
          }
        }

        // Extract transaction details from response
        const { transactionDetails } = transactionData;
        console.log("Transaction summary:", transactionDetails);

        // Generate PSBT and request signing
        const txPsbt = tx.toPSBT();
        const finalTxPsbtHex = hex.encode(txPsbt);
        const finalTxPsbtBase64 = Buffer.from(finalTxPsbtHex, "hex").toString(
          "base64"
        );

        let txid;

        console.log("Wallet-specific flow for:", activeWalletProvider);

        if (activeWalletProvider === "leather") {
          // Leather wallet flow
          const requestParams = {
            hex: finalTxPsbtHex,
            network: "mainnet",
            broadcast: false,
            allowedSighash: [btc.SigHash.ALL],
            allowUnknownOutputs: true,
          };

          if (!window.LeatherProvider) {
            throw new Error(
              "Leather wallet provider not found on window object"
            );
          }

          // Send the signing request to Leather
          const signResponse = await window.LeatherProvider.request(
            "signPsbt",
            requestParams
          );

          if (
            !signResponse ||
            !signResponse.result ||
            !signResponse.result.hex
          ) {
            throw new Error(
              "Leather wallet did not return a valid signed PSBT"
            );
          }

          // We get the hex of the signed PSBT back, finalize it
          const signedPsbtHex = signResponse.result.hex;
          const signedTx = btc.Transaction.fromPSBT(hex.decode(signedPsbtHex));
          signedTx.finalize();
          const finalTxHex = hex.encode(signedTx.extract());

          // Manually broadcast the transaction
          const broadcastResponse = await fetch(
            "https://mempool.space/api/tx",
            {
              method: "POST",
              headers: {
                "Content-Type": "text/plain",
              },
              body: finalTxHex,
            }
          );

          if (!broadcastResponse.ok) {
            const errorText = await broadcastResponse.text();
            throw new Error(`Failed to broadcast transaction: ${errorText}`);
          }

          txid = await broadcastResponse.text();
        } else if (activeWalletProvider === "xverse") {
          console.log("Executing Xverse transaction flow");
          // Xverse wallet flow
          try {
            console.log("Starting Xverse PSBT signing flow...");

            // Add all input addresses from our transaction
            const inputAddresses: Record<string, number[]> = {};
            inputAddresses[senderBtcAddress] = Array.from(
              { length: preparedTransaction.utxos.length },
              (_, i) => i
            );

            console.log("Input addresses for Xverse:", inputAddresses);

            // Prepare request params
            const xverseParams = {
              psbt: finalTxPsbtBase64,
              signInputs: inputAddresses,
              broadcast: true, // Let Xverse handle broadcasting
              allowedSighash: [
                btc.SigHash.ALL,
                btc.SigHash.NONE,
                btc.SigHash.SINGLE,
                btc.SigHash.DEFAULT_ANYONECANPAY,
              ],
              options: {
                allowUnknownInputs: true,
                allowUnknownOutputs: true,
              },
            };

            // For P2SH addresses with Xverse, we need to add a special note in the logs
            if (isP2SHAddress(senderBtcAddress)) {
              console.log("Using P2SH-specific params for Xverse");
              console.log(
                "P2SH address detected, relying on Xverse's internal handling"
              );
            }

            const response = (await xverseRequest(
              "signPsbt",
              xverseParams
            )) as XverseSignPsbtResponse;

            if (response.status !== "success") {
              console.error(
                "Xverse signing failed with status:",
                response.status
              );
              console.error("Xverse error details:", response.error);
              throw new Error(
                `Xverse signing failed: ${
                  response.error?.message || "Unknown error"
                }`
              );
            }

            // Fix the txid property access
            if (!response.result?.txid) {
              console.error("No txid in successful Xverse response:", response);
              throw new Error("No transaction ID returned from Xverse");
            }

            txid = response.result.txid;
            console.log("Successfully got txid from Xverse:", txid);
          } catch (err) {
            console.error("Detailed error with Xverse signing:", err);
            console.error("Error type:", typeof err);
            if (err instanceof Error) {
              console.error("Error name:", err.name);
              console.error("Error message:", err.message);
              console.error("Error stack:", err.stack);
            }
            throw err;
          }
        } else {
          throw new Error("No compatible wallet provider detected");
        }

        console.log("Transaction successfully broadcast with txid:", txid);

        // Update the deposit record with the transaction ID
        try {
          const updateResult = await styxSDK.updateDepositStatus({
            id: depositId,
            data: {
              btcTxId: txid,
              status: "broadcast",
            },
          });

          console.log("Successfully updated deposit:", updateResult);
        } catch (error) {
          console.error("Error updating deposit with ID:", depositId);
          console.error("Update error details:", error);
          if (error instanceof Error) {
            console.error("Error name:", error.name);
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
          }
        }

        // Update state with success
        setBtcTxStatus("success");
        setBtcTxId(txid);

        // Show success message
        toast({
          title: "Deposit Initiated",
          description: `Your Bitcoin transaction has been sent successfully with txid: ${txid.substring(
            0,
            10
          )}...`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        // Close confirmation dialog
        onClose();
      } catch (err: any) {
        const error = err as Error;
        console.error("Error in Bitcoin transaction process:", error);
        setBtcTxStatus("error");

        // Update deposit as canceled if wallet interaction failed
        await styxSDK.updateDepositStatus({
          id: depositId,
          data: {
            status: "canceled",
          },
        });
        onClose();
        toast({
          title: "Error",
          description:
            error.message ||
            "Failed to process Bitcoin transaction. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (err: any) {
      const error = err as Error;
      console.error("Error creating deposit record:", error);
      setBtcTxStatus("error");
      onClose();
      toast({
        title: "Error",
        description: "Failed to initiate deposit. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Render fee estimates with appropriate visual cues for loading state
  const renderFeeEstimates = () => {
    return (
      <SimpleGrid columns={3} spacing={3}>
        <Card
          bg={feePriority === "low" ? "#665500" : "#1A1A2F"}
          borderRadius="lg"
          overflow="hidden"
          border="1px solid rgba(255, 255, 255, 0.1)"
          _hover={{ borderColor: "yellow.300", cursor: "pointer" }}
          onClick={() => setFeePriority(TransactionPriority.Low)}
        >
          <Box p={3} textAlign="center">
            <Text color="white" fontSize="sm" fontWeight="medium" mb={1}>
              Low
            </Text>
            <Text color="gray.300" fontSize="xs">
              {loadingFees ? (
                <Spinner size="xs" />
              ) : (
                `${feeEstimates.low.fee} sats`
              )}
            </Text>
            <Text color="gray.400" fontSize="xs">
              ({feeEstimates.low.rate} sat/vB)
            </Text>
            <Text color="gray.400" fontSize="xs">
              {feeEstimates.low.time}
            </Text>
          </Box>
        </Card>

        <Card
          bg={feePriority === "medium" ? "#665500" : "#1A1A2F"}
          borderRadius="lg"
          overflow="hidden"
          border="1px solid rgba(255, 255, 255, 0.1)"
          _hover={{ borderColor: "yellow.300", cursor: "pointer" }}
          onClick={() => setFeePriority(TransactionPriority.Medium)}
        >
          <Box p={3} textAlign="center">
            <Text color="white" fontSize="sm" fontWeight="medium" mb={1}>
              Medium
            </Text>
            <Text color="gray.300" fontSize="xs">
              {loadingFees ? (
                <Spinner size="xs" />
              ) : (
                `${feeEstimates.medium.fee} sats`
              )}
            </Text>
            <Text color="gray.400" fontSize="xs">
              ({feeEstimates.medium.rate} sat/vB)
            </Text>
            <Text color="gray.400" fontSize="xs">
              {feeEstimates.medium.time}
            </Text>
          </Box>
        </Card>

        <Card
          bg={feePriority === "high" ? "#665500" : "#1A1A2F"}
          borderRadius="lg"
          overflow="hidden"
          border="1px solid rgba(255, 255, 255, 0.1)"
          _hover={{ borderColor: "yellow.300", cursor: "pointer" }}
          onClick={() => setFeePriority(TransactionPriority.High)}
        >
          <Box p={3} textAlign="center">
            <Text color="white" fontSize="sm" fontWeight="medium" mb={1}>
              High
            </Text>
            <Text color="gray.300" fontSize="xs">
              {loadingFees ? (
                <Spinner size="xs" />
              ) : (
                `${feeEstimates.high.fee} sats`
              )}
            </Text>
            <Text color="gray.400" fontSize="xs">
              ({feeEstimates.high.rate} sat/vB)
            </Text>
            <Text color="gray.400" fontSize="xs">
              {feeEstimates.high.time}
            </Text>
          </Box>
        </Card>
      </SimpleGrid>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent bg="blue.700" color="white">
        <ModalHeader>Confirm Transaction Data</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={0}>
          <Box bg="blue.800" p={4} borderRadius="md" mb={4}>
            <Table variant="unstyled" size="sm">
              <Tbody>
                <Tr>
                  <Td width="40%" fontSize="xs" fontWeight="medium" pr={0}>
                    Amount:
                  </Td>
                  <Td>
                    <Text fontFamily="mono" fontSize="xs">
                      {confirmationData.depositAmount} BTC
                    </Text>
                  </Td>
                </Tr>
                <Tr>
                  <Td width="40%" fontSize="xs" fontWeight="medium" pr={0}>
                    STX Address:
                  </Td>
                  <Td>
                    <Text
                      fontFamily="mono"
                      fontSize="2xs"
                      wordBreak="break-all"
                    >
                      {confirmationData.stxAddress}
                    </Text>
                  </Td>
                </Tr>
                <Tr>
                  <Td
                    width="40%"
                    fontSize="xs"
                    fontWeight="medium"
                    pr={0}
                    verticalAlign="top"
                  >
                    OP_RETURN:
                  </Td>
                  <Td>
                    <Box position="relative">
                      <Box
                        bg="gray.700"
                        p={2}
                        borderRadius="md"
                        maxWidth="100%"
                        maxHeight="60px"
                        overflowY="auto"
                        overflowX="hidden"
                        sx={{
                          "::-webkit-scrollbar": {
                            width: "4px",
                            height: "4px",
                          },
                          "::-webkit-scrollbar-thumb": {
                            backgroundColor: "rgba(255, 255, 255, 0.2)",
                            borderRadius: "4px",
                          },
                        }}
                      >
                        <Text
                          fontFamily="mono"
                          fontSize="xs"
                          wordBreak="break-all"
                          whiteSpace="normal"
                          lineHeight="1.2"
                        >
                          {confirmationData.opReturnHex}
                        </Text>
                      </Box>
                      <Button
                        position="absolute"
                        top="2px"
                        right="2px"
                        size="xs"
                        bg="gray.600"
                        _hover={{ bg: "gray.500" }}
                        color="white"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            confirmationData.opReturnHex
                          );
                          toast({
                            title: "Copied",
                            description: "OP_RETURN data copied to clipboard",
                            status: "success",
                            duration: 2000,
                            isClosable: true,
                          });
                        }}
                      >
                        Copy
                      </Button>
                    </Box>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>

          <Box bg="blue.800" p={4} borderRadius="md" mb={4}>
            <Text fontSize="sm" mb={3} fontWeight="medium">
              Select priority
            </Text>

            {renderFeeEstimates()}

            <Text fontSize="xs" color="gray.300" mt={4} textAlign="left">
              Fees are estimated based on current network conditions.
            </Text>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={executeBitcoinTransaction}
            isLoading={btcTxStatus === "pending"}
            loadingText="Processing"
          >
            Proceed to Wallet
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TransactionConfirmation;
