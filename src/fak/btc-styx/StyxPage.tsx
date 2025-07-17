import React from "react";
import { useParams } from "react-router-dom";
import SimplifiedTradStyx from "./SimplifiedTabStyx"; // Import the real component

const MinimalTradStyxPage = () => {
  const { id } = useParams(); // This will be the dexContract from the URL

  // Function to get token data based on dexContract
  const getTokenData = (dexContract: string) => {
    // For now, return the hardcoded data regardless of dexContract
    // In a real app, you'd fetch this data based on the dexContract
    const rawTokenData = {
      id: "312",
      name: "ai sbtc",
      symbol: "BEAST1",
      description: "totally with you David. Love you. RIP < 3",
      token_contract:
        "SP331D6T77PNS2YZXR03CDC4G3XN0SYBPV69D8JW5.beast1-faktory",
      dex_contract:
        dexContract ||
        "SP331D6T77PNS2YZXR03CDC4G3XN0SYBPV69D8JW5.beast1-faktory-dex",
      target_amm: "SM1793C4R5PZ4NS4VQ4WMP7SKKYVH8JZEWSZ9HCCR",
      supply: 1000000000,
      decimals: 8,
      target_stx: 0.05,
      progress: 0.05392,
      price: 8.096938775510178e-11,
      price_24h_changes: -19.030612244898222,
      trading_volume: 420000,
      holders: 13,
      token_to_dex: "16000000000000000",
      token_to_deployer: "0",
      stx_to_dex: 0,
      stx_buy_first_fee: 0,
      logo_url:
        "https://bncytzyfafclmdxrwpgq.supabase.co/storage/v1/object/public/tokens/60360b67-5f2e-4dfb-adc4-f8bf7c9aab85.png",
      media_url: "",
      uri: "https://bncytzyfafclmdxrwpgq.supabase.co/storage/v1/object/public/tokens/60360b67-5f2e-4dfb-adc4-f8bf7c9aab85.json",
      twitter: "https://x.com/historyinmemes/status/1783783324789416343",
      website: "https://x.com/historyinmemes/status/1783783324789416343",
      telegram: "https://x.com/historyinmemes/status/1783783324789416343",
      discord: "https://x.com/historyinmemes/status/1783783324789416343",
      chat_count: 0,
      txs_count: 15,
      creator_address: "SP331D6T77PNS2YZXR03CDC4G3XN0SYBPV69D8JW5",
      deployed_at: "2025-07-15T19:21:53.381Z",
      token_hash:
        "20bc0e5847264648ec8a53167629ecc747f1d5fab356880e089f77c0820185e3",
      token_verified: 1,
      dex_hash:
        "7db46596f901ed99bf17f6ee9fbb5261c28a501819286062ba786191d45bbab3",
      dex_verified: 1,
      token_verified_at: "2025-07-15T19:22:24.136Z",
      dex_verified_at: "2025-07-15T19:22:45.737Z",
      status: "verifiedRaphaTest",
      token_chainhook_uuid: null,
      trading_hook_uuid: "a37926b3-0138-4fa1-b206-aa7ae62cd3ea",
      last_buy_hash: null,
      dao_token: 1,
      tweet_origin: "1883607431143723149",
      denomination: "btc",
      pre_contract:
        "SP331D6T77PNS2YZXR03CDC4G3XN0SYBPV69D8JW5.beast1-pre-faktory",
      pre_hash:
        "0b0377edbb02ee2cbd3b63dd9d2d72dc6fd24692116b9af770f47f7c1b2187ec",
      pre_verified: 1,
      pre_hook_uuid: "930fab36-8341-4977-b5e8-7f9f1d4aa274",
      phase: "in-curve",
      deployment_height: 905852,
      last_airdrop_height: null,
      accumulated_fees: null,
    };

    // Transform to match Token interface (camelCase properties)
    return {
      id: rawTokenData.id,
      name: rawTokenData.name,
      symbol: rawTokenData.symbol,
      description: rawTokenData.description,
      tokenContract: rawTokenData.token_contract,
      dexContract: rawTokenData.dex_contract,
      txId: null,
      targetAmm: rawTokenData.target_amm,
      supply: rawTokenData.supply,
      decimals: rawTokenData.decimals,
      targetStx: rawTokenData.target_stx,
      progress: rawTokenData.progress,
      price: rawTokenData.price,
      price24hChanges: rawTokenData.price_24h_changes,
      tradingVolume: rawTokenData.trading_volume,
      holders: rawTokenData.holders,
      tokenToDex: rawTokenData.token_to_dex,
      tokenToDeployer: rawTokenData.token_to_deployer,
      stxToDex: rawTokenData.stx_to_dex,
      stxBuyFirstFee: rawTokenData.stx_buy_first_fee,
      logoUrl: rawTokenData.logo_url,
      mediaUrl: rawTokenData.media_url,
      uri: rawTokenData.uri,
      twitter: rawTokenData.twitter,
      website: rawTokenData.website,
      telegram: rawTokenData.telegram,
      discord: rawTokenData.discord,
      chatCount: rawTokenData.chat_count,
      txsCount: rawTokenData.txs_count,
      creatorAddress: rawTokenData.creator_address,
      deployedAt: rawTokenData.deployed_at,
      tokenHash: rawTokenData.token_hash,
      tokenVerified: rawTokenData.token_verified,
      dexHash: rawTokenData.dex_hash,
      dexVerified: rawTokenData.dex_verified,
      tokenVerifiedAt: rawTokenData.token_verified_at,
      dexVerifiedAt: rawTokenData.dex_verified_at,
      status: rawTokenData.status,
      tokenChainhookUuid: rawTokenData.token_chainhook_uuid,
      tradingHookUuid: rawTokenData.trading_hook_uuid,
      lastBuyHash: rawTokenData.last_buy_hash,
      daoToken: rawTokenData.dao_token,
      tweetOrigin: rawTokenData.tweet_origin,
      denomination: rawTokenData.denomination,
      preContract: rawTokenData.pre_contract,
      preHash: rawTokenData.pre_hash,
      preVerified: rawTokenData.pre_verified,
      preHookUuid: rawTokenData.pre_hook_uuid,
      phase: rawTokenData.phase,
      deploymentHeight: rawTokenData.deployment_height,
      lastAirdropHeight: rawTokenData.last_airdrop_height,
      accumulatedFees: rawTokenData.accumulated_fees,
      // Add missing properties to fix TypeScript error
      volumeUsd: rawTokenData.trading_volume * 110000, // trading_volume * btcUsdPrice
      marketCap: rawTokenData.supply * rawTokenData.price * 110000, // supply * price * btcUsdPrice
    };
  };

  const token = getTokenData(id!);

  // Just return the widget with minimal styling
  return <SimplifiedTradStyx token={token} />;
};

export default MinimalTradStyxPage;
