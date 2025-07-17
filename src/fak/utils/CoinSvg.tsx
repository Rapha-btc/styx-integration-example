import { Box, Image } from "@chakra-ui/react";
import React from "react";
import { getImageUrl } from "./uploadHelpers";

interface Props {
  logoUrl: string | null;
  symbol: string;
  width?: number;
  height?: number;
}

const CoinSvg: React.FC<Props> = ({
  logoUrl,
  symbol,
  width = 30,
  height = 30,
}) => {
  return (
    <Box
      width={`${width}px`}
      height={`${height}px`}
      borderRadius="50%"
      overflow="hidden"
      bg="gray.800"
    >
      <Image
        src={getImageUrl(logoUrl)}
        alt={symbol}
        width="100%"
        height="100%"
        objectFit="cover"
        onError={(e) => {
          e.currentTarget.src = "/icons/UASU.svg";
        }}
      />
    </Box>
  );
};

export default CoinSvg;
