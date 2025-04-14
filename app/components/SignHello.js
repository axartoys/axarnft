'use client';

import { useState } from 'react';
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
import { metaMask } from 'wagmi/connectors';
import { GradientButton } from './GradientButton';

export function SignHello() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: signature, error: signError, isPending, signMessage } = useSignMessage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // If not connected, connect first
      if (!isConnected) {
        connect({ connector: metaMask() });
      }
      
      // Simple message to sign
      const message = "Hello, World!";
      
      // Request signature
      signMessage({ message });
    } catch (error) {
      console.error('Connection error:', error);
      setError(`Connection error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle sign error
  if (signError) {
    console.error('Signature error:', signError);
    setError(`Failed to sign message: ${signError.message}`);
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gradient">Sign Hello World</h2>
      <p className="text-gray-300 mb-6">
        This is a simple test of wallet signature functionality. Click the button below to connect your wallet and sign a "Hello, World!" message.
      </p>
      
      <GradientButton 
        onClick={handleAuth}
        disabled={isPending || isLoading}
        className="w-full py-3"
      >
        {isPending ? 'Waiting for signature...' : 
         isLoading ? 'Connecting...' : 
         isConnected ? 'Sign Message' : 'Connect & Sign'}
      </GradientButton>
      
      {error && (
        <div className="mt-4 bg-red-900/30 text-red-200 p-4 rounded-lg">
          <p>{error}</p>
        </div>
      )}
      
      {signature && (
        <div className="mt-4 bg-green-900/30 text-green-200 p-4 rounded-lg">
          <p className="font-semibold mb-2">Message signed successfully!</p>
          <p className="text-sm mb-2">Signature:</p>
          <p className="bg-black/30 p-2 rounded text-xs font-mono break-all">
            {signature}
          </p>
        </div>
      )}
      
      {isConnected && (
        <div className="mt-4 text-sm text-gray-400">
          Connected as: {address?.substring(0, 6)}...{address?.substring(address.length - 4)}
        </div>
      )}
    </div>
  );
}
