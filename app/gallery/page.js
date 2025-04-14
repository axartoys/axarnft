"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from "next/link";
import { ethers } from 'ethers';
import { MetaMaskSDK } from '@metamask/sdk';
import { FaTwitter, FaDiscord, FaTelegram, FaMedium, FaGithub } from 'react-icons/fa';
import { GradientButton, GradientTextButton } from '../components/GradientButton';
import { GradientText, RadialGradient } from '../components/ui';
import { PersonaGallery } from '../components/PersonaGallery';

export default function Gallery() {
  // State for wallet connection
  const [account, setAccount] = useState('');
  const [connected, setConnected] = useState(false);
  const [metamaskSDK, setMetamaskSDK] = useState(null);

  // Connect wallet function using MetaMask SDK
  const connectWallet = async () => {
    try {
      if (!metamaskSDK) {
        console.log("MetaMask SDK not initialized yet");
        return;
      }
      
      console.log("Connecting with MetaMask SDK...");
      
      try {
        const accounts = await metamaskSDK.connect();
        console.log("Connected accounts:", accounts);
        
        if (accounts && accounts.length > 0) {
          setAccount(accounts[0]);
          setConnected(true);
        }
      } catch (error) {
        console.error("Error connecting with MetaMask SDK:", error);
      }
    } catch (error) {
      console.error("Error in connectWallet:", error);
    }
  };

  // Initialize MetaMask SDK
  useEffect(() => {
    const initializeMetaMaskSDK = async () => {
      try {
        // Only initialize in browser environment
        if (typeof window !== 'undefined') {
          const MMSDK = new MetaMaskSDK({
            dappMetadata: {
              name: "Axar NFT",
              url: window.location.href,
            },
            // Use Infura as a fallback provider if needed
            infuraAPIKey: process.env.NEXT_PUBLIC_INFURA_API_KEY || '',
            // Recommended settings for better UX
            checkInstallationImmediately: false,
            enableDebug: true,
          });
          
          setMetamaskSDK(MMSDK);
          console.log("MetaMask SDK initialized");
          
          // Check if already connected
          const ethereum = MMSDK.getProvider();
          if (ethereum && ethereum.selectedAddress) {
            setAccount(ethereum.selectedAddress);
            setConnected(true);
          }
          
          // Set up event listeners
          if (ethereum) {
            ethereum.on('accountsChanged', (accounts) => {
              console.log("Accounts changed:", accounts);
              if (accounts && accounts.length > 0) {
                setAccount(accounts[0]);
                setConnected(true);
              } else {
                setAccount('');
                setConnected(false);
              }
            });
            
            ethereum.on('chainChanged', () => {
              console.log("Chain changed, reloading...");
              window.location.reload();
            });
          }
        }
      } catch (error) {
        console.error("Error initializing MetaMask SDK:", error);
      }
    };
    
    initializeMetaMaskSDK();
    
    // Cleanup event listeners on unmount
    return () => {
      if (metamaskSDK) {
        const ethereum = metamaskSDK.getProvider();
        if (ethereum) {
          ethereum.removeAllListeners('accountsChanged');
          ethereum.removeAllListeners('chainChanged');
        }
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Header with Logo and Connect Wallet Button */}
      <div className="container mx-auto px-6 py-6">
        <div className="flex justify-between items-center">
          <Link href="/">
            <div className="relative h-16 w-48">
              <Image 
                src="/logo.png" 
                alt="axartoys.ai" 
                fill 
                style={{ objectFit: 'contain' }}
                className="object-left"
              />
            </div>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link href="/">
              <span className="text-gray-300 hover:text-white">Home</span>
            </Link>
            <Link href="/gallery">
              <span className="text-purple-400 hover:text-purple-300 border-b-2 border-purple-500">My Personas</span>
            </Link>
            
            <GradientButton
              onClick={connectWallet}
              gradient={connected ? 'linear-gradient(90deg, #4CAF50, #8BC34A)' : 'linear-gradient(90deg, #FF5A7E 0%, #A056F7 100%)'}
            >
              {connected && account ? `Connected: ${account.substring(0, 6)}...${account.substring(account.length - 4)}` : 'Connect Wallet'}
            </GradientButton>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6 pb-20 relative">
        {/* Radial gradient decoration */}
        <RadialGradient position="top-80 left-3/5" size="w-[600px] h-[600px]" opacity={0.1} />
        
        {/* Gallery Content */}
        <PersonaGallery 
          isWalletConnected={connected}
          connectWallet={connectWallet}
        />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <div className="relative h-12 w-36 mb-4">
                <Image 
                  src="/logo.png" 
                  alt="axartoys.ai" 
                  fill 
                  style={{ objectFit: 'contain' }}
                  className="object-left"
                />
              </div>
              <p className="text-gray-400 text-sm">
                © 2025 Axar. All rights reserved.
              </p>
            </div>
            
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-white"><FaTwitter size={24} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><FaDiscord size={24} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><FaTelegram size={24} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><FaMedium size={24} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><FaGithub size={24} /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
