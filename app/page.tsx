"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from "next/link";
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { FaTwitter, FaDiscord, FaTelegram, FaMedium, FaGithub } from 'react-icons/fa';

export default function Home() {
  // State for wallet connection
  const [account, setAccount] = useState('');
  const [connected, setConnected] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  // Connect wallet function
  const connectWallet = async () => {
    try {
      const web3Modal = new Web3Modal({
        cacheProvider: true,
        providerOptions: {}
      });
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const accounts = await provider.listAccounts();
      
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setConnected(true);
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  // Wallet options
  const wallets = [
    { name: "MetaMask", logo: "/metamask.png" },
    { name: "WalletConnect", logo: "/walletconnect.png" },
    { name: "Coinbase Wallet", logo: "/coinbase-wallet.png" },
  ];



  // Effect to check if wallet is already connected
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum && window.ethereum.selectedAddress) {
        setAccount(window.ethereum.selectedAddress);
        setConnected(true);
      }
    };
    
    checkConnection();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Header with Logo and Connect Wallet Button */}
      <div className="container mx-auto px-6 py-6">
        <div className="flex justify-between items-center">
          <div className="relative h-16 w-48">
            {/* <Image 
              src="/logo.png" 
              alt="axartoys.ai" 
              fill 
              style={{ objectFit: 'contain' }}
              className="object-left"
            /> */}
          </div>
          
          <button 
            onClick={connectWallet}
            className="relative px-8 py-2 rounded-full transition-all font-medium"
          >
            <span className="relative z-10" style={{
              background: connected ? 'linear-gradient(90deg, #4CAF50, #8BC34A)' : 'linear-gradient(90deg, #FF5A7E 0%, #A056F7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            } as React.CSSProperties}>{connected && account ? `Connected: ${account.substring(0, 6)}...${account.substring(account.length - 4)}` : 'Connect Wallet'}</span>
            <span className="absolute inset-0 rounded-full border-2 border-transparent" style={{
              background: connected ? 'linear-gradient(90deg, #4CAF50, #8BC34A) border-box' : 'linear-gradient(90deg, #FF5A7E, #A056F7) border-box',
              WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'destination-out',
              maskComposite: 'exclude',
            } as React.CSSProperties}></span>
          </button>
        </div>
      </div>

      <main className="container mx-auto px-6 pb-20 relative">
        {/* Circle gradient in the top section */}
        <div className="absolute top-80 left-3/5 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-xl z-0" style={{
          background: 'radial-gradient(circle, #FF5A7E 0%, #A056F7 50%, rgba(0,0,0,0) 70%)',
          opacity: 0.1
        }}></div>
        
        {/* Circle gradient in the middle for Trending NFTs */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-xl z-0" style={{
          background: 'radial-gradient(circle, #FF5A7E 0%, #A056F7 50%, rgba(0,0,0,0) 70%)',
          opacity: 0.15          
        }}></div>
        
        <div className="flex flex-col lg:flex-row justify-between items-center gap-10 py-10 relative z-10">
          {/* Left side - Hero content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2"
          >
            <h1 className="text-5xl font-bold mb-4">
              Decentralize Your <span style={{ 
                background: 'linear-gradient(90deg, #FF5A7E 0%, #A056F7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>Digital </span><span style={{ 
                background: 'linear-gradient(90deg, #FF5A7E 0%, #A056F7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}> Persona</span>
              <br />
              Across Any AI
            </h1>
            
            <p className="text-gray-400 text-lg mb-8">
              Axar empowers you to own and move your AI interactions freely,
              <br />
              no matter the form factor or AI model.
            </p>
            
            <div className="flex gap-4 mb-12">
              <Link href="/explore">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-white font-bold py-3 px-8 rounded-full shadow-lg"
                  style={{
                    background: 'linear-gradient(90deg, #FF5A7E 0%, #A056F7 100%)',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => {
                    const mintSection = document.getElementById('mint-section');
                    if (mintSection) {
                      mintSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  Create Your Axar NFT
                </motion.button>
              </Link>
              <Link href="/create">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative font-bold py-3 px-8 rounded-full shadow-lg transition-all overflow-hidden"
                >
                  <span className="relative z-10" style={{
                    background: 'linear-gradient(90deg, #FF5A7E 0%, #A056F7 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  } as React.CSSProperties}>Create</span>
                  <span className="absolute inset-0 rounded-full border-2 border-transparent" style={{
                    background: 'linear-gradient(90deg, #FF5A7E, #A056F7) border-box',
                    WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'destination-out',
                    maskComposite: 'exclude',
                  } as React.CSSProperties}></span>
                </motion.button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 text-2xl font-bold">
              <div>
                <span className="text-4xl">200K+</span>
                <p className="text-gray-400 text-sm">Collections</p>
              </div>
              <div>
                <span className="text-4xl">10K+</span>
                <p className="text-gray-400 text-sm">Artists</p>
              </div>
              <div>
                <span className="text-4xl">423K+</span>
                <p className="text-gray-400 text-sm">Community</p>
              </div>
            </div>
          </motion.div>

          {/* Right side - NFT Grid */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 relative h-[500px]"
          >
            {/* NFT layout exactly matching the reference image with increased gaps */}
            <div className="relative w-full h-full flex items-center justify-center">
              
              <div className="relative w-[500px] h-[500px]">
                {/* Top NFT - White Monkey */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 w-50 h-50 rounded-xl overflow-hidden border-2 border-white shadow-lg z-10"
                >
                  <Image src="/nft-1.jpeg" alt="White Monkey NFT" fill style={{ objectFit: 'cover' }} />
                </motion.div>
                
                {/* Left NFT - Yellow/Green Split Face */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="absolute top-1/2 left-0 transform -translate-y-1/2 w-50 h-50 rounded-xl overflow-hidden border-2 border-white shadow-lg z-10"
                >
                  <Image src="/nft-2.jpeg" alt="Split Face NFT" fill style={{ objectFit: 'cover' }} />
                </motion.div>
                
                {/* Right NFT - Afro Monkey */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute top-1/2 right-0 transform -translate-y-1/2 w-50 h-50 rounded-xl overflow-hidden border-2 border-white shadow-lg z-10"
                >
                  <Image src="/nft-3.jpeg" alt="Afro Monkey NFT" fill style={{ objectFit: 'cover' }} />
                </motion.div>
                
                {/* Bottom NFT - Green Monkey with Cap */}
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-50 h-50 rounded-xl overflow-hidden border-2 border-white shadow-lg z-10"
                >
                  <Image src="/nft-4.jpeg" alt="Green Monkey NFT" fill style={{ objectFit: 'cover' }} />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Wallet Connection Options */}
        {/* <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-10 py-12"
        >
          {wallets.map((wallet, index) => (
            <motion.div 
              key={index}
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Image src={wallet.logo} alt={wallet.name} width={30} height={30} />
              <span className="font-bold">{wallet.name}</span>
            </motion.div>
          ))}
        </motion.div> */}

        {/* What is Axar Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20"
        >
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ 
            background: 'linear-gradient(90deg, #FF5A7E 0%, #A056F7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Introducing Axar: The Future of AI Interactions
          </h2>
          
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-gray-300 text-lg mb-6">
              Axar lets you create encrypted AI prompts that work anywhere. Take your AI persona 
              with you across any device or model—computer, phone, or robot. Your data stays yours, 
              never locked to a single company.
            </p>
          </div>
        </motion.div>

        {/* Create Your Axar NFT Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20"
          id="mint-section"
        >
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ 
            background: 'linear-gradient(90deg, #FF5A7E 0%, #A056F7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Four Simple Steps to AI Freedom
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-900 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-purple-500/20 transition-all flex flex-col h-full">
              <div className="relative h-48 w-full">
                <Image 
                  src="/1-how.jpeg" 
                  alt="Encrypt Your AI Prompt" 
                  fill 
                  style={{ objectFit: 'cover' }}
                  className="rounded-t-lg"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-4">Encrypt Your AI Prompt</h3>
                <p className="text-gray-400 mb-6 flex-grow">
                  Create a secure, encrypted prompt that defines how your AI persona behaves and responds.
                </p>
                <button 
                  className="w-full text-white font-bold py-3 px-4 rounded-full shadow-lg relative overflow-hidden mt-auto"
                  style={{
                    background: 'linear-gradient(90deg, #FF5A7E 0%, #A056F7 100%)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Start Creating
                </button>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-purple-500/20 transition-all flex flex-col h-full">
              <div className="relative h-48 w-full">
                <Image 
                  src="/2-how.jpeg" 
                  alt="Personalize Your NFT" 
                  fill 
                  style={{ objectFit: 'cover' }}
                  className="rounded-t-lg"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-4">Personalize Your NFT</h3>
                <p className="text-gray-400 mb-6 flex-grow">
                  Add a name, description, and visual elements. Your metadata evolves as you interact with different AI systems.
                </p>
                <button 
                  className="w-full text-white font-bold py-3 px-4 rounded-full shadow-lg relative overflow-hidden mt-auto"
                  style={{
                    background: 'linear-gradient(90deg, #FF5A7E 0%, #A056F7 100%)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Customize
                </button>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-purple-500/20 transition-all flex flex-col h-full">
              <div className="relative h-48 w-full">
                <Image 
                  src="/3-how.jpeg" 
                  alt="Mint Your NFT" 
                  fill 
                  style={{ objectFit: 'cover' }}
                  className="rounded-t-lg"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-4">Mint Your NFT</h3>
                <p className="text-gray-400 mb-6 flex-grow">
                  Connect your wallet and mint your Axar NFT, securing your AI persona on the blockchain.
                </p>
                <button 
                  onClick={() => setWalletModalOpen(true)}
                  className="w-full text-white font-bold py-3 px-4 rounded-full shadow-lg relative overflow-hidden mt-auto"
                  style={{
                    background: 'linear-gradient(90deg, #FF5A7E 0%, #A056F7 100%)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {connected ? 'Mint NFT' : 'Connect Wallet'}
                </button>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-purple-500/20 transition-all flex flex-col h-full">
              <div className="relative h-48 w-full">
                <Image 
                  src="/4-how.jpeg" 
                  alt="Use Anywhere" 
                  fill 
                  style={{ objectFit: 'cover' }}
                  className="rounded-t-lg"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-4">Use Anywhere</h3>
                <p className="text-gray-400 mb-6 flex-grow">
                  Take your AI persona to any platform or device. Your interactions are encrypted and stored in your NFT.
                </p>
                <button 
                  className="w-full text-white font-bold py-3 px-4 rounded-full shadow-lg relative overflow-hidden mt-auto"
                  style={{
                    background: 'linear-gradient(90deg, #FF5A7E 0%, #A056F7 100%)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-8">
            <button 
              className="relative px-8 py-2 rounded-full transition-all font-medium"
            >
              <span className="relative z-10" style={{
                background: 'linear-gradient(90deg, #FF5A7E 0%, #A056F7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              } as React.CSSProperties}>SEE MORE</span>
              <span className="absolute inset-0 rounded-full border-2 border-transparent" style={{
                background: 'linear-gradient(90deg, #FF5A7E, #A056F7) border-box',
                WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'destination-out',
                maskComposite: 'exclude',
              } as React.CSSProperties}></span>
              <span 
                className="absolute inset-0 rounded-full opacity-0 hover:opacity-100 transition-opacity"
                style={{
                  background: 'linear-gradient(90deg, #FF5A7E 0%, #A056F7 100%)',
                }}
              ></span>
            </button>
          </div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20"
        >
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ 
            background: 'linear-gradient(90deg, #FF5A7E 0%, #A056F7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Why Axar?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-purple-500/20 transition-all p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4">Data Freedom</h3>
              <p className="text-gray-400">
                Never be locked into one AI ecosystem again. Your data moves with you.
              </p>
            </div>
            
            <div className="bg-gray-900 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-purple-500/20 transition-all p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4">Security</h3>
              <p className="text-gray-400">
                Blockchain-secured and encrypted. Your AI interactions remain private and tamper-proof.
              </p>
            </div>
            
            <div className="bg-gray-900 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-purple-500/20 transition-all p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4">Portability</h3>
              <p className="text-gray-400">
                One AI persona, endless devices. Consistent experience everywhere you go.
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <button 
              className="text-white font-bold py-3 px-8 rounded-full shadow-lg relative overflow-hidden"
              style={{
                background: 'linear-gradient(90deg, #FF5A7E 0%, #A056F7 100%)',
                transition: 'all 0.3s ease'
              }}
              onClick={() => !connected && setWalletModalOpen(true)}
            >
              Create Your Axar NFT Today
            </button>
            <p className="text-gray-400 mt-4">Take the first step towards liberating your AI interactions.</p>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 bg-gray-900 rounded-2xl p-10"
        >
          <h2 className="text-3xl font-bold mb-12 text-center">
            <span style={{ 
              background: 'linear-gradient(90deg, #FF5A7E 0%, #A056F7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Frequently Asked Questions</span>
          </h2>
          
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-3">What is Axar?</h3>
              <p className="text-gray-400">
                Axar is a blockchain system that makes your AI persona portable. Create once, use everywhere.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-3">How do I mint an Axar NFT?</h3>
              <p className="text-gray-400">
                Create your prompt, personalize it, connect your wallet, and mint. Four steps to complete freedom.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-3">Where is my interaction history stored?</h3>
              <p className="text-gray-400">
                Securely in your NFT on the blockchain, encrypted and accessible only to you.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-3">Can I use Axar with any AI model?</h3>
              <p className="text-gray-400">
                Yes. Your Axar persona works with any AI model that supports our open protocol.
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Wallet Connection Modal */}
      {walletModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 w-96 max-w-full">
            <h3 className="text-xl font-bold mb-4">Connect Your Wallet</h3>
            <p className="text-gray-400 mb-6">Connect with one of our available wallet providers or create a new one.</p>
            
            <div className="space-y-3">
              {wallets.map((wallet) => (
                <button 
                  key={wallet.name}
                  className="w-full flex items-center justify-between bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition-colors"
                  onClick={connectWallet}
                >
                  <span>{wallet.name}</span>
                  <Image src={wallet.logo} alt={wallet.name} width={24} height={24} />
                </button>
              ))}
            </div>
            
            <button 
              className="mt-6 w-full text-gray-400 hover:text-white"
              onClick={() => setWalletModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="py-16 bg-gradient-to-r from-purple-900/30 to-pink-900/30 mt-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready for AI freedom?</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Start your journey to truly portable AI today.
          </p>
          <button 
            className="text-white font-bold py-4 px-10 rounded-full shadow-lg relative overflow-hidden"
            style={{
              background: 'linear-gradient(90deg, #FF5A7E 0%, #A056F7 100%)',
              transition: 'all 0.3s ease'
            }}
            onClick={() => setWalletModalOpen(true)}
          >
            {connected ? 'Create Your AI Persona' : 'Get Started'}
          </button>
        </div>
      </div>

      {/* Footer with social links */}
      <footer className="mt-0 border-t border-gray-800 pt-10 pb-6">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="mb-6 md:mb-0">
              <div className="relative h-12 w-36">
                <Image 
                  src="/logo.png" 
                  alt="axartoys.ai" 
                  fill 
                  style={{ objectFit: 'contain' }}
                  className="object-left"
                />
              </div>
              <p className="text-gray-400 mt-2">Your AI, Your Way, Anywhere</p>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaDiscord size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaTelegram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaMedium size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaGithub size={24} />
              </a>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800">
            <p className="text-gray-400 text-sm mb-4 md:mb-0"> 2025 Axar. All rights reserved.</p>
            
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">FAQ</a>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">Contact: info@axar.ai</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
