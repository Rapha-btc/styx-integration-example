// hooks/useSdkDepositStatusByTxId.ts
import { useQuery } from "@tanstack/react-query";
import { styxSDK } from "@faktoryfun/styx-sdk";

const useSdkDepositStatusByTxId = (btcTxId: string | null) => {
  return useQuery({
    queryKey: ["depositStatusByTxId", btcTxId],
    queryFn: async () => {
      if (!btcTxId) return null;
      console.log(`Fetching status for transaction ${btcTxId}...`);
      const data = await styxSDK.getDepositStatusByTxId(btcTxId);
      console.log(`Received status for transaction ${btcTxId}:`, data);
      return data;
    },
    enabled: !!btcTxId,
    staleTime: 30000, // 30 seconds, as status may change frequently
  });
};

export default useSdkDepositStatusByTxId;
