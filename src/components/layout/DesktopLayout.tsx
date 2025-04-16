// DesktopLayout.tsx
import React, { useState, useEffect } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { Outlet, useLocation } from "react-router-dom";

const DesktopLayout = () => {
  const location = useLocation();
  const isMarketDetailPage = location.pathname.startsWith("/markets/");

  const footerHeight = 200;

  useEffect(() => {
    const handleScroll = () => {
      if (!isMarketDetailPage) {
        const scrollPosition = window.innerHeight + window.pageYOffset;
        const bodyHeight = document.body.offsetHeight;
        const isNearBottom = scrollPosition >= bodyHeight - 20;
        const contentFitsViewport = bodyHeight <= window.innerHeight;
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMarketDetailPage]);

  return (
    <Flex flexDirection="column" minHeight="100vh" overflow="visible">
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
    </Flex>
  );
};

export default DesktopLayout;
