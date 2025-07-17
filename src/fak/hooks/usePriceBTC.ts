// // hooks/usePriceBTC.ts

// import { useState, useEffect } from "react";
// import APIClient from "../services/api-client";

// const api = new APIClient<{ price: number }>("/fetchBtcPrice");
// const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// export const usePriceBTC = () => {
//   const [price, setPrice] = useState<number | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const fetchPrice = async () => {
//     try {
//       const newPrice = await api.getBtcPrice();
//       setPrice(newPrice);
//       setError(null);
//     } catch (error) {
//       console.error("Error fetching BTC price:", error);
//       setError("Failed to fetch BTC price");
//       setPrice(null); // Reset price on error
//     }
//   };

//   useEffect(() => {
//     fetchPrice();
//     const intervalId = setInterval(fetchPrice, CACHE_DURATION);
//     return () => clearInterval(intervalId);
//   }, []);

//   return { price, error, refreshPrice: fetchPrice };
// };
