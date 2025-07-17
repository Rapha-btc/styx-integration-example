import React from "react";
import { Box, Flex, Text, VStack, HStack, Image } from "@chakra-ui/react";

// Mock SimplifiedTradStyx component since we don't have the actual implementation
const SimplifiedTradStyx = ({ token }: { token: any }) => {
  return (
    <Box
      bg="gray.700"
      borderRadius="md"
      p={6}
      width="100%"
      maxWidth="400px"
      margin="0 auto"
    >
      <VStack spacing={4} align="stretch">
        <HStack spacing={3} justify="center">
          <Image
            src={token.logoUrl}
            alt={token.symbol}
            width="40px"
            height="40px"
            borderRadius="full"
            fallback={
              <Box
                width="40px"
                height="40px"
                bg="gray.600"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="sm" color="white">
                  {token.symbol.charAt(0)}
                </Text>
              </Box>
            }
          />
          <VStack spacing={0} align="start">
            <Text fontSize="lg" fontWeight="bold" color="white">
              {token.symbol}
            </Text>
            <Text fontSize="sm" color="gray.300">
              {token.name}
            </Text>
          </VStack>
        </HStack>

        <Box bg="gray.600" borderRadius="md" p={4}>
          <VStack spacing={2}>
            <HStack justify="space-between" width="100%">
              <Text fontSize="sm" color="gray.300">
                Price:
              </Text>
              <Text fontSize="sm" color="white">
                ${token.price.toFixed(12)}
              </Text>
            </HStack>
            <HStack justify="space-between" width="100%">
              <Text fontSize="sm" color="gray.300">
                24h Change:
              </Text>
              <Text
                fontSize="sm"
                color={token.price24hChanges >= 0 ? "green.400" : "red.400"}
              >
                {token.price24hChanges.toFixed(2)}%
              </Text>
            </HStack>
            <HStack justify="space-between" width="100%">
              <Text fontSize="sm" color="gray.300">
                Volume:
              </Text>
              <Text fontSize="sm" color="white">
                {token.tradingVolume.toLocaleString()} STX
              </Text>
            </HStack>
            <HStack justify="space-between" width="100%">
              <Text fontSize="sm" color="gray.300">
                Holders:
              </Text>
              <Text fontSize="sm" color="white">
                {token.holders}
              </Text>
            </HStack>
          </VStack>
        </Box>

        <Box bg="gray.600" borderRadius="md" p={4}>
          <VStack spacing={2}>
            <Text fontSize="sm" color="gray.300" textAlign="center">
              Progress to AMM
            </Text>
            <Box width="100%" bg="gray.800" borderRadius="full" height="8px">
              <Box
                width={`${(token.progress * 100).toFixed(1)}%`}
                bg="blue.400"
                height="100%"
                borderRadius="full"
                transition="width 0.3s ease"
              />
            </Box>
            <Text fontSize="xs" color="gray.400" textAlign="center">
              {(token.progress * 100).toFixed(1)}% Complete
            </Text>
          </VStack>
        </Box>

        <VStack spacing={2}>
          <Box
            as="button"
            bg="green.500"
            color="white"
            px={6}
            py={3}
            borderRadius="md"
            width="100%"
            _hover={{ bg: "green.600" }}
            _active={{ bg: "green.700" }}
            fontSize="sm"
            fontWeight="semibold"
          >
            BUY {token.symbol}
          </Box>
          <Box
            as="button"
            bg="red.500"
            color="white"
            px={6}
            py={3}
            borderRadius="md"
            width="100%"
            _hover={{ bg: "red.600" }}
            _active={{ bg: "red.700" }}
            fontSize="sm"
            fontWeight="semibold"
          >
            SELL {token.symbol}
          </Box>
        </VStack>

        <Box bg="gray.600" borderRadius="md" p={3}>
          <VStack spacing={1}>
            <Text fontSize="xs" color="gray.300">
              Contract Address
            </Text>
            <Text
              fontSize="xs"
              color="white"
              fontFamily="mono"
              textAlign="center"
            >
              {token.tokenContract}
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

const MinimalTradStyxPage = () => {
  // Raw API data
  const rawTokenData = {
    id: "312",
    name: "ai sbtc",
    symbol: "BEAST1",
    description: "totally with you David. Love you. RIP < 3",
    token_contract: "SP331D6T77PNS2YZXR03CDC4G3XN0SYBPV69D8JW5.beast1-faktory",
    dex_contract:
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
  const token = {
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
  };

  return (
    <Flex
      minHeight="100vh"
      bg="gray.900"
      color="white"
      direction="column"
      align="center"
      justify="center"
      p={4}
    >
      <Box mb={6}>
        <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={2}>
          SimplifiedTradStyx Demo
        </Text>
        <Text fontSize="md" color="gray.400" textAlign="center">
          {token.description}
        </Text>
      </Box>

      <SimplifiedTradStyx token={token} />

      <Box mt={6} textAlign="center">
        <Text fontSize="sm" color="gray.500">
          Deployed: {new Date(token.deployedAt).toLocaleDateString()}
        </Text>
        <Text fontSize="sm" color="gray.500">
          Phase: {token.phase} | Status: {token.status}
        </Text>
      </Box>
    </Flex>
  );
};

export default MinimalTradStyxPage;
