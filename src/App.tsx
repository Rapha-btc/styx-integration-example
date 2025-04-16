import { Box } from "@chakra-ui/react";
import Navbar from "./components/Layout/Navbar";
import BitcoinDeposit from "./components/BitcoinDeposit";
import UserSessionProvider from "./context/UserSessionContext";

function App() {
  return (
    <UserSessionProvider>
      <Box maxW="1200px" mx="auto" px={4}>
        <Navbar />
        <BitcoinDeposit />
      </Box>
    </UserSessionProvider>
  );
}

export default App;
