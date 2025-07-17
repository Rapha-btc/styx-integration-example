export const formatCompactCurrency = (value: number): string => {
  if (value >= 1_000_000_000_000) {
    return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
  }
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(2)}K`;
  }
  return `$${value.toFixed(2)}`;
};

export const formatCompactSTX = (value: number): string => {
  if (value >= 1_000_000_000_000) {
    return `${(value / 1_000_000_000_000).toFixed(2).replace(/\.00$/, "")}T`;
  }
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2).replace(/\.00$/, "")}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2).replace(/\.00$/, "")}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(2).replace(/\.00$/, "")}K`;
  }
  return `${value.toFixed(2).replace(/\.00$/, "")}`;
};

export const formatCompactBTC = (value: number): string => {
  // For BTC, typically we want to show more precision for smaller values
  if (value >= 1_000_000_000_000) {
    return `${(value / 1_000_000_000_000).toFixed(2).replace(/\.00$/, "")}T`;
  }
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2).replace(/\.00$/, "")}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2).replace(/\.00$/, "")}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(2).replace(/\.00$/, "")}K`;
  }
  if (value >= 1) {
    return `${value.toFixed(0).replace(/\.00$/, "")}`;
  }
  if (value >= 0.01) {
    return `${value.toFixed(4).replace(/\.0000$/, "")}`;
  }
  if (value >= 0.0001) {
    return `${value.toFixed(6).replace(/\.000000$/, "")}`;
  }
  // For very small BTC values, show scientific notation
  if (value < 0.0001) {
    return value.toExponential(4);
  }
  return `${value.toFixed(8).replace(/\.00000000$/, "")}`;
};

export const formatBtcAmount = (satoshis: number): string => {
  // 1 BTC = 100,000,000 satoshis
  if (satoshis >= 100_000_000) {
    // 1 BTC or more -> show in BTC
    const btc = satoshis / 100_000_000;
    return `${btc.toFixed(btc === Math.floor(btc) ? 0 : 2)} BTC`;
  } else if (satoshis >= 1_000_000) {
    // 1M+ satoshis -> show as M sats
    return `${(satoshis / 1_000_000).toFixed(1).replace(/\.0$/, "")}M sats`;
  } else if (satoshis >= 1_000) {
    // 1K+ satoshis -> show as K sats
    return `${(satoshis / 1_000).toFixed(1).replace(/\.0$/, "")}K sats`;
  }
  // Less than 1K satoshis -> show as sats
  return `${satoshis} sats`;
};

export const formatAmount = (microAmount: string, decimals: number): string => {
  const amount = parseFloat(microAmount) / Math.pow(10, decimals);
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const formatAmount2 = (ustxAmount: number): string => {
  const stxAmount = ustxAmount / 1000000; // Convert from microSTX to STX

  if (stxAmount >= 1000) {
    return `${(stxAmount / 1000).toFixed(2)}K`;
  }

  return Math.floor(stxAmount).toString();
};

export const formatAmountBtc = (satoshis: number): string => {
  // Working directly with satoshis (no need to divide first)

  if (satoshis >= 1000000) {
    return `${(satoshis / 1000000).toFixed(1)}M`; // 1M+ satoshis
  }

  if (satoshis >= 1000) {
    return `${(satoshis / 1000).toFixed(1)}`; // 1K-999K satoshis
  }

  // For values under 1000 satoshis, keep as is
  return (satoshis / 1000).toFixed(1);
};
