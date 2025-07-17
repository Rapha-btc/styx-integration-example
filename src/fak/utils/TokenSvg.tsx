///Users/owner/alpha/frontend/frontend-fak/src/utils/TokenSvg.tsx
import { Box, Image } from "@chakra-ui/react";
import React from "react";

interface Props {
  token: string;
  width?: number;
  height?: number;
}
export const tokenIconMap: { [key: string]: string } = {
  MIA: "/icons/MIA.svg",
  NYC: "/icons/NYC.svg",
  USDA: "/icons/USDA.svg",
  sBTC: "/icons/sBTC.png",
  UASU: "/icons/UASU.svg",
  stSTX: "/icons/stSTX.svg",
  ALEX: "/icons/ALEX.svg",
  WELSH: "/icons/WELSH.svg",
  NOT: "/icons/NOT.svg",
  ARKADIKO: "/icons/DIKO.svg",
  DIKO: "/icons/DIKO.svg",
  sUSDT: "/icons/sUSDT.svg",
  aeUSDC: "/icons/aeUSDC.svg",
  s2sBTC: "/icons/s2sBTC.svg",
  BTC: "/icons/BTC.svg",
  VELAR: "/icons/VELAR.svg",
  LEO: "/icons/LEO.png",
  ROO: "/icons/ROO.svg",
  xBTC: "/icons/xBTC.svg",
  STX: "/icons/STX.svg",
  GOLF: "/icons/GOLF.svg",
  INV: "/icons/INV.svg",
  // PEPE: "/icons/PEPE.svg",
  // PEPE: "/icons/PEPE.jpg_small",
  PEPE: "/icons/PEPE.png",
  iQC: "/icons/iQC.png",
  sCHA: "/icons/SCHA.png",
  EDMUND: "/icons/EDMUND.png",
  aBTC: "/icons/aBTC.svg",
  MSCB: "/icons/MSCB.jpeg",
  CRE: "/icons/CRE.jpg",
  USDh: "/icons/USDh.svg",
  VIBES: "/icons/VIBES.png",
  FARI: "/icons/FARI.png",
  ZERO: "/icons/ZERO.png",
  STSW: "/icons/STSW.svg",
  LiSTX: "/icons/LiSTX.svg",
  LiALEX: "/icons/LiALEX.svg",
  MEGA: "/icons/MEGA.png",
  DMG: "/icons/DMG.png",
  CHA: "/icons/CHA.png",
  iouROO: "/icons/ROO.svg",
  DOG: "/icons/DOG.webp",
  ORDI: "/icons/ORDI.png",
  synSTX: "/icons/synSTX.png",
  UPDOG: "/icons/UPDOG.gif",
  iouWELSH: "/icons/WELSH.svg",
  STXSCAN: "/icons/STXSCAN.png",
  KANGA: "/icons/KANGA.jpg",
  Clive: "/icons/Clive.jpeg",
  WEN: "/icons/WEN.png",
  BAO: "/icons/BAO.png",
  TRUTH: "/icons/TRUTH.webp",
  HOAX: "/icons/HOAX.jpeg",
  FlatEarth: "/icons/FlatEarth.jpeg",
  BLEWY: "/icons/BLEWY.jpeg",
  DGAF: "/icons/DGAF.jpeg",
  MST: "/icons/MST.jpg",
  FRESH: "/icons/FRESH.jpg",
  SKULL: "/icons/SKULL.png",
  THCAM: "/icons/THCAM.png",
  FTC: "/icons/FTC.png",
  Moist: "/icons/Moist.jpg",
  GYAT: "/icons/GYAT.jpg",
  BOOSTER: "/icons/BOOSTER.jpg",
  STONE: "/icons/STONE.png",
  FAIR: "/icons/FAIR.jpeg",
  BFF: "/icons/BFF.png",
  BFFgreen: "/icons/BFFgreen.png",
  BFFRed: "/icons/BFFRed.png",
  GOAT: "/icons/GOAT.webp",
  Jing: "/icons/jing.png",
  BOB: "/icons/BOB.jpg",
  FAKFUN: "/icons/FAKFUN.jpg",
  SHARK: "/icons/shark.jpeg",
  // MIA: new URL("/icons/MIA.svg", import.meta.url).href,
  // NYC: new URL("/icons/NYC.svg", import.meta.url).href,
  // USDA: new URL("/icons/USDA.svg", import.meta.url).href,
  // sBTC: new URL("/icons/sBTC.svg", import.meta.url).href,
  // UASU: new URL("/icons/UASU.svg", import.meta.url).href,
  // stSTX: new URL("/icons/stSTX.svg", import.meta.url).href,
  // ALEX: new URL("/icons/ALEX.svg", import.meta.url).href,
  // WELSH: new URL("/icons/WELSH.svg", import.meta.url).href,
  // NOT: new URL("/icons/nothing_logo.webp", import.meta.url).href,
  // DIKO: new URL("/icons/DIKO.webp", import.meta.url).href,
  // sUSDT: new URL("/icons/sUSDT.svg", import.meta.url).href,
  // aeUSDC: new URL("/icons/aeUSDC.svg", import.meta.url).href,
  // s2sBTC: new URL("/icons/s2sBTC.svg", import.meta.url).href,
  // BTC: new URL("/icons/BTC.svg", import.meta.url).href,
  // VELAR: new URL("/icons/VELAR.svg", import.meta.url).href,
  // LEO: new URL("/icons/LEO.svg", import.meta.url).href,
  // ROO: new URL("/icons/ROO.svg", import.meta.url).href,
  // xBTC: new URL("/icons/xBTC.svg", import.meta.url).href,
  // STX: new URL("/icons/STX.svg", import.meta.url).href,
  // GOLF: new URL("/icons/GOLF.svg", import.meta.url).href,
  // INV: new URL("/icons/INV.svg", import.meta.url).href,
  // PEPE: new URL("/icons/PEPE.svg", import.meta.url).href,
  // iQC: new URL("/icons/iQC.png", import.meta.url).href,
  // sCHA: new URL("/icons/SCHA.png", import.meta.url).href,
  // EDMUND: new URL("/icons/EDMUND.png", import.meta.url).href,
  // aBTC: new URL("/icons/abtc.svg", import.meta.url).href,
  // MSCB: new URL("/icons/MSCB.jpeg", import.meta.url).href,
  // CRE: new URL("/icons/CRE.jpg", import.meta.url).href,
  // Jing: new URL("/icons/jing.png", import.meta.url).href,
};

const TokenSvg: React.FC<Props> = ({ token, width = 30, height = 30 }) => {
  // Define the SVG file paths for each token

  const TokenIcon = tokenIconMap[token];

  if (!TokenIcon) return <span>{token.toUpperCase()}</span>;

  // Check if the token is iQC or sCHA
  const isCircularToken =
    token === "iQC" ||
    token === "sCHA" ||
    token === "NOT" ||
    token === "EDMUND" ||
    token === "MSCB" ||
    token === "DIKO" ||
    token === "CRE" ||
    token === "CHA" ||
    token === "DMG" ||
    token === "Jing" ||
    token === "KANGA" ||
    token === "Clive" ||
    token === "WEN" ||
    token === "BAO" ||
    token === "TRUTH" ||
    token === "HOAX" ||
    token === "FlatEarth" ||
    token === "BLEWY" ||
    token === "DGAF" ||
    token === "MST" ||
    token === "FRESH" ||
    token === "SKULL" ||
    token === "THCAM" ||
    token === "FTC" ||
    token === "Moist" ||
    token === "GYAT" ||
    token === "BOOSTER" ||
    token === "STONE" ||
    token === "BOB" ||
    token === "FAIR" ||
    token === "FAKFUN" ||
    token === "SMOKE"; // ||
  // token === "GOAT";

  if (isCircularToken) {
    return (
      <Box
        width={`${width}px`}
        height={`${height}px`}
        borderRadius="50%"
        overflow="hidden"
      >
        <Image
          src={TokenIcon}
          alt={token}
          width="100%"
          height="100%"
          objectFit="cover"
        />
      </Box>
    );
  }

  // For other tokens, return the image as before
  return <img src={TokenIcon} alt={token} style={{ width, height }} />;
};

export default TokenSvg;
