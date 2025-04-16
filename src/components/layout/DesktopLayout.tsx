// DesktopLayout.tsx
import React, { useState, useEffect } from "react";
import { Box, Flex } from "@chakra-ui/react";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";

const DesktopLayout = () => {
  const location = useLocation();
  const isMarketDetailPage = location.pathname.startsWith("/markets/");
  const isMarketListPage = location.pathname === "/markets";
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  const navbarHeight = 60;
  const footerHeight = 200;

  useEffect(() => {
    const handleScroll = () => {
      if (!isMarketDetailPage && !isMarketListPage) {
        const scrollPosition = window.innerHeight + window.pageYOffset;
        const bodyHeight = document.body.offsetHeight;
        const isNearBottom = scrollPosition >= bodyHeight - 20;
        const contentFitsViewport = bodyHeight <= window.innerHeight;
        setIsFooterVisible(isNearBottom);
      }
    };

    // Always show footer on market list page
    if (isMarketListPage || document.body.offsetHeight <= window.innerHeight) {
      setIsFooterVisible(true);
    }

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMarketDetailPage, isMarketListPage]);

  return (
    <Flex flexDirection="column" minHeight="100vh" overflow="visible">
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={1000}
        bg="gray.900"
      >
        <NavBar />
      </Box>

      <Box
        flexGrow={1}
        display="flex"
        flexDirection="column"
        padding={isMarketDetailPage ? 0 : 2}
        paddingTop={isMarketDetailPage ? "50px" : "60px"}
        marginBottom={!isMarketDetailPage ? `${footerHeight}px` : "0"}
      >
        <Outlet />
      </Box>

      {!isMarketDetailPage && (
        <Box
          position="fixed"
          bottom={0}
          left={0}
          right={0}
          zIndex={1000}
          height={`${footerHeight}px`}
          transform={
            isFooterVisible || isMarketListPage
              ? "translateY(0)"
              : `translateY(${footerHeight}px)`
          }
          transition={
            isFooterVisible ? "transform 0.5s ease-in" : "transform 3s ease-out"
          }
          style={{ willChange: "transform" }}
          bg="gray.900"
        >
          <Footer />
        </Box>
      )}
    </Flex>
  );
};

export default DesktopLayout;
