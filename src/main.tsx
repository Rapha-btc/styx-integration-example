import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import theme from "./theme";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./route";
import { Connect } from "@stacks/connect-react";
import {
  UserSessionProvider,
  useUserSession,
} from "./context/UserSessionContext";
import { Analytics } from "@vercel/analytics/react";
import { Buffer } from "buffer";
globalThis.Buffer = Buffer;

const queryClient = new QueryClient();

const App = () => {
  const { userSession } = useUserSession();

  return (
    <Connect
      authOptions={{
        appDetails: {
          name: "faktory.fun",
          icon: window.location.origin + "/usefav.png",
        },
        redirectTo: "/",
        onFinish: () => {
          window.location.reload();
        },
        userSession,
      }}
    >
      <RouterProvider router={router} />
    </Connect>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <UserSessionProvider>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <QueryClientProvider client={queryClient}>
          <App />
          <ReactQueryDevtools />
          <Analytics />
        </QueryClientProvider>
      </ChakraProvider>
    </UserSessionProvider>
  </React.StrictMode>
);
