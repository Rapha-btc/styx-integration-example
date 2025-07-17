// import { useState, useEffect } from "react";
// import APIClient from "../services/api-client";

// const api = new APIClient<{ price: number }>("/fetchStxPrice");
// const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// export const usePriceSTX = () => {
//   const [price, setPrice] = useState<number | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const fetchPrice = async () => {
//     try {
//       const newPrice = await api.getStxPrice();
//       setPrice(newPrice);
//       setError(null);
//     } catch (error) {
//       console.error("Error fetching STX price:", error);
//       setError("Failed to fetch STX price");
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
