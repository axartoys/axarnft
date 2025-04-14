'use client';

import { createConfig, http } from 'wagmi';
import { sepolia, mainnet } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider as WagmiProviderCore } from 'wagmi';
import { metaMask, coinbaseWallet } from 'wagmi/connectors';

// Create a client
const queryClient = new QueryClient();

// Configure chains & providers - prioritize Sepolia for testing
const config = createConfig({
  chains: [sepolia, mainnet],
  transports: {
    [sepolia.id]: http(),
    [mainnet.id]: http(),
  },
  connectors: [
    metaMask(),
    coinbaseWallet({
      appName: 'Axar NFT',
    }),
  ],
});

export function WagmiProvider({ children }) {
  return (
    <WagmiProviderCore config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProviderCore>
  );
}
