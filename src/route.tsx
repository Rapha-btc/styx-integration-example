import { createBrowserRouter } from "react-router-dom";
import DesktopLayout from "./components/layout/DesktopLayout";
import HomePage from "./fak/home/HomePage";
import MarketDetailPage from "./pages/MarketDetailPage";

import BitcoinDeposit from "./components/BitcoinDeposit";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DesktopLayout />,
    children: [{ index: true, element: <BitcoinDeposit /> }],
  },
]);

export default router;
