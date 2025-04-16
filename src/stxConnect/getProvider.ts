export function getProvider(userSession: any) {
  if (!userSession.isUserSignedIn()) return null;

  const profile = userSession.loadUserData().profile;
  const providerKey = profile.walletProvider;
  const address = profile.stxAddress.mainnet;

  // Check for Asigna wallet (SM addresses)
  if (address.startsWith("SM")) {
    return (window as any).AsignaProvider;
  }

  // Check for Leather wallet
  if (providerKey === "leather") {
    return (window as any).LeatherProvider;
  }

  // Check for Xverse or default provider
  if (!providerKey) {
    return (
      (window as any).XverseProviders?.StacksProvider ||
      (window as any).XverseProvider ||
      (window as any).StacksProvider
    );
  }

  return (window as any).StacksProvider;
}
