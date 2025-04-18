// hooks/useSdkDepositStatus.ts
import { useQuery } from "@tanstack/react-query";
import { styxSDK } from "@faktoryfun/styx-sdk";

const useSdkDepositStatus = (depositId: string | null) => {
  return useQuery({
    queryKey: ["depositStatus", depositId],
    queryFn: async () => {
      if (!depositId) return null;
      try {
        console.log(`Fetching status for deposit ${depositId}...`);
        const data = await styxSDK.getDepositStatus(depositId);
        console.log(`Received status for deposit ${depositId}:`, data);
        return data;
      } catch (error) {
        console.error(`Error fetching deposit status:`, error);
        // Re-throw to be caught by React Query's error handling
        throw error;
      }
    },
    enabled: !!depositId,
    staleTime: 30000, // 30 seconds, as status may change frequently
    retry: false, // Don't retry 404 errors
  });
};

export default useSdkDepositStatus;
