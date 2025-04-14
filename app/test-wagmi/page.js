'use client';

import { Providers } from '../providers/Providers';
import { WagmiConnector } from '../components/WagmiConnector';

export default function TestWagmiPage() {
  return (
    <Providers>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Test Wagmi Wallet Connection</h1>
        <p className="mb-8">
          This page demonstrates the new wallet connection and signature-based encryption using wagmi.
          Connect your wallet and test the encryption/decryption process.
        </p>
        
        <WagmiConnector />
        
        <div className="mt-8">
          <p className="text-sm text-gray-400">
            Note: This implementation uses wagmi hooks for wallet connection and signatures,
            which provides better compatibility with different wallet providers.
          </p>
        </div>
      </div>
    </Providers>
  );
}
