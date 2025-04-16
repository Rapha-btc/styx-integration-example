import React from "react";

interface Props {
  token: string;
  width?: number;
  height?: number;
}

const TokenSvg: React.FC<Props> = ({ token, width = 30, height = 30 }) => {
  // Define the SVG file paths for each token
  const tokenIconMap: { [key: string]: string } = {
    BTC: "/icons/BTC.svg",
  };

  const TokenIcon = tokenIconMap[token];

  if (!TokenIcon) return <span>{token.toUpperCase()}</span>;

  // For other tokens, return the image as before
  return <img src={TokenIcon} alt={token} style={{ width, height }} />;
};

export default TokenSvg;
