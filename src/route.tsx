import { createBrowserRouter } from "react-router-dom";
import DesktopLayout from "./components/layout/DesktopLayout";
import BitcoinDeposit from "./components/BitcoinDeposit";
import MinimalTradStyxPage from "./fak/btc-styx/StyxPage"; // Update this path to match your actual file location

const router = createBrowserRouter([
  {
    path: "/",
    element: <DesktopLayout />,
    children: [
      {
        index: true,
        element: <BitcoinDeposit />,
      },
      {
        path: "buy/:id",
        element: <MinimalTradStyxPage />,
      },
    ],
  },
]);

export default router;
