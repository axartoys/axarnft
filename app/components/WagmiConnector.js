'use client';

import { useState } from 'react';
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
import { metaMask, walletConnect, coinbaseWallet } from 'wagmi/connectors';
import { GradientButton } from './GradientButton';
import CryptoJS from 'crypto-js';

export function WagmiConnector() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const [signature, setSignature] = useState('');
  const [encryptedMessage, setEncryptedMessage] = useState('');
  const [decryptedMessage, setDecryptedMessage] = useState('');
  const [timestamp, setTimestamp] = useState('');

  const handleConnect = async (connector) => {
    try {
      await connect({ connector });
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  const handleSignMessage = async () => {
    if (!isConnected) return;

    try {
      // Generate a timestamp
      const currentTimestamp = Date.now().toString();
      setTimestamp(currentTimestamp);
      
      // Create message to sign
      const message = `Sign this message to securely encrypt your AI persona prompt. This doesn't cost any gas and keeps your prompt secure.\n\nAddress: ${address}\nTimestamp: ${currentTimestamp}`;
      
      // Request signature
      const sig = await signMessageAsync({ message });
      setSignature(sig);
      
      // Demo encryption
      const testMessage = "This is a test message that would be your AI persona prompt";
      const encryptedData = await encryptWithSignature(testMessage, sig, currentTimestamp);
      setEncryptedMessage(JSON.stringify(encryptedData));
      
      // Demo decryption
      const decrypted = await decryptWithSignature(encryptedData.encryptedPrompt, encryptedData.encryptedKey, sig);
      setDecryptedMessage(decrypted);
      
    } catch (error) {
      console.error('Signing error:', error);
    }
  };

  // Example encryption function using the signature
  const encryptWithSignature = async (message, signature, timestamp) => {
    // Use the signature to derive an encryption key
    const signatureHash = CryptoJS.SHA256(signature).toString();
    
    // Generate a random key for AES encryption
    const randomKey = CryptoJS.lib.WordArray.random(16);
    const randomKeyHex = randomKey.toString();
    
    // Encrypt the message with the random key
    const encryptedPrompt = CryptoJS.AES.encrypt(message, randomKeyHex).toString();
    
    // Encrypt the random key with the signature hash
    const encryptedKey = CryptoJS.AES.encrypt(randomKeyHex, signatureHash).toString();
    
    return {
      encryptedPrompt,
      encryptedKey,
      timestamp
    };
  };

  // Example decryption function using the signature
  const decryptWithSignature = async (encryptedPrompt, encryptedKey, signature) => {
    // Use the signature to derive the same encryption key
    const signatureHash = CryptoJS.SHA256(signature).toString();
    
    // Decrypt the random key
    const decryptedKeyBytes = CryptoJS.AES.decrypt(encryptedKey, signatureHash);
    const randomKey = decryptedKeyBytes.toString(CryptoJS.enc.Utf8);
    
    // Decrypt the message with the random key
    const decryptedPromptBytes = CryptoJS.AES.decrypt(encryptedPrompt, randomKey);
    const decryptedPrompt = decryptedPromptBytes.toString(CryptoJS.enc.Utf8);
    
    return decryptedPrompt;
  };

  return (
    <div className="p-6 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Wagmi Wallet Connector</h2>
      
      {!isConnected ? (
        <div className="space-y-4">
          <p className="mb-4">Connect your wallet to test signature-based encryption:</p>
          <div className="flex flex-wrap gap-4">
            <GradientButton onClick={() => handleConnect(metaMask())}>
              Connect MetaMask
            </GradientButton>
            <GradientButton onClick={() => handleConnect(walletConnect())}>
              Connect WalletConnect
            </GradientButton>
            <GradientButton onClick={() => handleConnect(coinbaseWallet())}>
              Connect Coinbase
            </GradientButton>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p>Connected: {address}</p>
            <GradientButton onClick={() => disconnect()}>Disconnect</GradientButton>
          </div>
          
          <div className="mt-6">
            <GradientButton onClick={handleSignMessage}>
              Sign Message to Test Encryption
            </GradientButton>
          </div>
          
          {signature && (
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Timestamp:</h3>
                <p className="bg-gray-800 p-2 rounded overflow-auto text-sm">{timestamp}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold">Signature:</h3>
                <p className="bg-gray-800 p-2 rounded overflow-auto text-sm">{signature.substring(0, 30)}...{signature.substring(signature.length - 10)}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold">Encrypted Data:</h3>
                <p className="bg-gray-800 p-2 rounded overflow-auto text-sm">{encryptedMessage}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold">Decrypted Message:</h3>
                <p className="bg-gray-800 p-2 rounded overflow-auto text-sm">{decryptedMessage}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
