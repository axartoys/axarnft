'use client';

import { useState } from 'react';
import { Providers } from '../providers/Providers';
import { WagmiMintWizard } from '../components/WagmiMintWizard';
import { GradientButton } from '../components/GradientButton';
import Link from 'next/link';

export default function MintNFTPage() {
  const [wizardOpen, setWizardOpen] = useState(false);

  return (
    <Providers>
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Mint Your AI Persona NFT</h1>
          <Link href="/" className="text-purple-400 hover:text-purple-300">
            Back to Home
          </Link>
        </div>
        
        <div className="max-w-3xl mx-auto bg-gray-900 rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Create Your Own AI Persona</h2>
          <p className="text-gray-300 mb-6">
            Mint a unique AI persona NFT with encrypted prompts that only you can access. 
            Your persona's prompt will be securely encrypted using your wallet signature 
            and stored on IPFS, ensuring that only you can decrypt and access it.
          </p>
          
          <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 mb-6">
            <h3 className="font-bold text-purple-300 mb-2">How It Works</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>Select your AI persona type</li>
              <li>Customize its traits and characteristics</li>
              <li>Preview your generated NFT</li>
              <li>Mint it to the blockchain with encrypted prompts</li>
            </ol>
          </div>
          
          <GradientButton 
            onClick={() => setWizardOpen(true)}
            className="w-full py-4 text-lg"
          >
            Start Minting Process
          </GradientButton>
        </div>
      </div>
      
      {wizardOpen && (
        <WagmiMintWizard 
          isOpen={wizardOpen} 
          onClose={() => setWizardOpen(false)} 
        />
      )}
    </Providers>
  );
}
