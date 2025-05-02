// hooks/useSdkAllDepositsHistory.ts
import { useQuery } from "@tanstack/react-query";
import { styxSDK } from "@faktoryfun/styx-sdk";

const useSdkAllDepositsHistory = (poolId?: string) => {
  return useQuery({
    queryKey: ["allDepositsHistory", poolId],
    queryFn: async () => {
      console.log(
        `Fetching all deposits history for pool ${poolId || "main"}...`
      );

      // Use optional chaining to conditionally pass the parameter only if it exists
      const data = await styxSDK.getAllDepositsHistory?.(poolId);

      console.log("Received all deposits history:", data);
      return (
        data || {
          aggregateData: {
            totalDeposits: 0,
            totalVolume: 0,
            uniqueUsers: 0,
          },
          recentDeposits: [],
        }
      );
    },
    staleTime: 60000, // 1 minute
  });
};

export default useSdkAllDepositsHistory;
