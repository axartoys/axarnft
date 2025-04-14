'use client';

import { WagmiProvider } from './WagmiProvider';

export function Providers({ children }) {
  return (
    <WagmiProvider>
      {children}
    </WagmiProvider>
  );
}
