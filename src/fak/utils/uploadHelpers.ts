// utils/uploadHelpers.ts
import { TokenFormData } from "../validation";
import { supabase } from "./supabase";

export const uploadFile = async (
  file: File,
  bucket: "token_logo" | "uri" | "chat_media"
) => {
  if (!file) return "";

  // Create unique filename - using same pattern as trending data
  const fileId = Math.random().toString(36).substring(2, 10); // e.g. "EbiHiquy"
  const fileName = `${fileId}-${file.name}`;

  // Upload file
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file);

  if (error) throw error;

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(fileName);

  return publicUrl;
};

export const uploadGif = async (gifUrl: string, bucket: "chat_media") => {
  try {
    // Download the GIF
    const response = await fetch(gifUrl);
    const blob = await response.blob();

    const sizeInMB = (blob.size / (1024 * 1024)).toFixed(2);
    console.log(`GIF size: ${sizeInMB}MB`);

    const SIZE_LIMIT_MB = 12;

    if (blob.size > SIZE_LIMIT_MB * 1024 * 1024) {
      throw new Error(
        `Selected GIF is ${sizeInMB}MB. Please choose a GIF smaller than ${SIZE_LIMIT_MB}MB`
      );
    }

    // Create unique filename with timestamp
    const uniqueId = Math.random().toString(36).substring(2, 15);
    const timestamp = Date.now();
    const fileName = `giphy-${uniqueId}-${timestamp}.gif`;

    const file = new File([blob], fileName, { type: "image/gif" });

    // Use existing uploadFile function
    const publicUrl = await uploadFile(file, bucket);
    console.log("Successfully uploaded GIF:", publicUrl);
    return publicUrl;
  } catch (error) {
    if (error instanceof Error) {
      console.error("GIF upload error details:", {
        error,
        errorMessage: error.message,
        errorStack: error.stack,
      });
    } else {
      console.error("Unknown error occurred:", error);
    }
    throw error;
  }
};

// Helper for generating metadata JSON
export const generateTokenUri = async (
  data: TokenFormData,
  logoUrl: string
) => {
  const metadata = {
    name: data.name,
    symbol: data.ticker,
    description: data.description,
    decimals: 6,
    image: logoUrl,
    properties: {
      supply: data.supply,
    },
  };

  const metadataBlob = new Blob([JSON.stringify(metadata)], {
    type: "application/json",
  });

  const fileName = `${data.ticker.toLowerCase()}-0-decimals.json`;
  // Explicitly set MIME type to "application/json"
  const jsonFile = new File([metadataBlob], fileName, {
    type: "application/json",
  });
  const uri = await uploadFile(jsonFile, "uri");

  return uri;
};

// fak/utils/uploadHelpers
export const SUPABASE_URL =
  "https://szigdtxfspmofhxoytra.supabase.co/storage/v1/object/public";

export const getImageUrl = (logoUrl: string | null, tokenSymbol?: string) => {
  // Case 1: If we have a logo URL
  if (logoUrl) {
    if (logoUrl.startsWith("https://")) return logoUrl;
    return `${SUPABASE_URL}/token_logo/${logoUrl}`;
  }

  // Case 2: No logo URL but we have a token symbol to check in the map
  if (tokenSymbol && tokenIconMap[tokenSymbol]) {
    return tokenIconMap[tokenSymbol];
  }

  // Case 3: Fallback to default
  console.log("Falling back to default UASU");
  return "/icons/UASU.svg";
};

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
  rock: "/icons/rock.png",
  stxAI: "/icons/stxAI.jpeg",
  POS: "/icons/POS.png",
  welshcorgicoin: "/icons/welshcorgicoin.png",
  FROGGY: "/icons/FROGGY.gif",
  PEGGY: "/icons/PEGGY3.webp",
  DROID: "/icons/DROID.png",
  PLAY: "/icons/PLAY.png",
  NASTY: "/icons/NASTY.png",
  RAPHA: "/icons/RAPHA.webp",
  SMOKE: "/icons/Smoke.png",
  Smoke: "/icons/Smoke.png",
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
