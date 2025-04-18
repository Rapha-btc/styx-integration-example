// hooks/useSdkDepositStatus.ts
import { useQuery } from "@tanstack/react-query";
import { styxSDK } from "@faktoryfun/styx-sdk";

const useSdkDepositStatus = (depositId: string | null) => {
  return useQuery({
    queryKey: ["depositStatus", depositId],
    queryFn: async () => {
      if (!depositId) return null;
      console.log(`Fetching status for deposit ${depositId}...`);
      const data = await styxSDK.getDepositStatus(depositId);
      console.log(`Received status for deposit ${depositId}:`, data);
      return data;
    },
    enabled: !!depositId,
    staleTime: 30000, // 30 seconds, as status may change frequently
  });
};

export default useSdkDepositStatus;
