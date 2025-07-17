// hooks/useSdkPoolStatus.ts
import { useQuery } from "@tanstack/react-query";
import { styxSDK } from "@faktoryfun/styx-sdk";

const useSdkPoolStatus = (poolId?: string) => {
  return useQuery({
    queryKey: ["poolStatus", poolId], // Include poolId in query key
    queryFn: async () => {
      console.log(
        `Fetching pool status from SDK for pool: ${poolId || "main"}...`
      );
      const data = await styxSDK.getPoolStatus(poolId);
      console.log("Received pool status:", data);
      return data;
    },
    staleTime: 60000, // 1 minute
  });
};

export default useSdkPoolStatus;
