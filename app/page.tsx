"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from "next/link";

export default function Home() {
  // NFT data
  const trendingNFTs = [
    { id: 1, name: "Bored Ape Jars Club", creator: "randomguy", image: "/nft-1.jpg" },
    { id: 2, name: "Bored Ape Jars Club", creator: "randomguy", image: "/nft-2.jpg" },
    { id: 3, name: "Bored Ape Jars Club", creator: "randomguy", image: "/nft-3.jpg" },
    { id: 4, name: "Bored Ape Jars Club", creator: "randomguy", image: "/nft-4.jpg" },
  ];

  const wallets = [
    { name: "MetaMask", logo: "/metamask.png" },
    { name: "Trust Wallet", logo: "/trust-wallet.png" },
    { name: "Coinbase Wallet", logo: "/coinbase-wallet.png" },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Logo */}
      <div className="container mx-auto px-6 py-6">
        <div className="relative h-16 w-48">
          <Image 
            src="/logo.png" 
            alt="axartoys.ai" 
            fill 
            style={{ objectFit: 'contain' }}
            className="object-left"
          />
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
            <h1 className="text-6xl font-bold mb-4">
              Discover collect,
              <br />
              &amp; sell
              <br />
              <span style={{ 
                background: 'linear-gradient(90deg, #FF5A7E 0%, #A056F7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>Extraordinary</span>
              <br />
              NFTs
            </h1>
            
            <p className="text-gray-300 text-lg mb-8">
              the leading NFT Marketplace on Ethereum
              <br />
              Home to the next generation of digital creators. Discover the best NFT collections.
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
                >
                  Explore
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
                  <Image src="/nft-1.jpg" alt="White Monkey NFT" fill style={{ objectFit: 'cover' }} />
                </motion.div>
                
                {/* Left NFT - Yellow/Green Split Face */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="absolute top-1/2 left-0 transform -translate-y-1/2 w-50 h-50 rounded-xl overflow-hidden border-2 border-white shadow-lg z-10"
                >
                  <Image src="/nft-2.jpg" alt="Split Face NFT" fill style={{ objectFit: 'cover' }} />
                </motion.div>
                
                {/* Right NFT - Afro Monkey */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute top-1/2 right-0 transform -translate-y-1/2 w-50 h-50 rounded-xl overflow-hidden border-2 border-white shadow-lg z-10"
                >
                  <Image src="/nft-3.jpg" alt="Afro Monkey NFT" fill style={{ objectFit: 'cover' }} />
                </motion.div>
                
                {/* Bottom NFT - Green Monkey with Cap */}
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-50 h-50 rounded-xl overflow-hidden border-2 border-white shadow-lg z-10"
                >
                  <Image src="/nft-4.jpg" alt="Green Monkey NFT" fill style={{ objectFit: 'cover' }} />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Wallet Connection Options */}
        <motion.div 
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
        </motion.div>

        {/* Trending NFTs Section */}
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
            TRENDING NFTs
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {trendingNFTs.map((nft) => (
              <motion.div 
                key={nft.id}
                whileHover={{ y: -10 }}
                className="bg-gray-900 rounded-xl overflow-hidden border-2 border-gray-800 shadow-xl"
              >
                <div className="relative h-72">
                  <Image 
                    src={nft.image} 
                    alt={nft.name} 
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full overflow-hidden">
                      <Image src={nft.image} alt="Creator" width={24} height={24} />
                    </div>
                    <h3 className="text-lg font-bold">{nft.name}</h3>
                    <div className="ml-auto">
                      <Image src="/ethereum.svg" alt="ETH" width={16} height={16} />
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm">{nft.creator}</p>
                </div>
              </motion.div>
            ))}
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

        {/* Create and Sell NFTs Section */}
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
            }}>Create and sell your NFTs</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-gray-800 p-4 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Set up your wallet</h3>
              <p className="text-gray-400 text-sm">
                Once you&apos;ve set up your wallet of choice, connect it to OpenSea by clicking the wallet icon in the top right corner. Learn about the wallets we support.
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-gray-800 p-4 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Upload &amp; Create Collection</h3>
              <p className="text-gray-400 text-sm">
                Upload your work then Click My Collections and set up your collection. Add a description, profile &amp; banner images, and set a secondary sales fee.
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-gray-800 p-4 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">List them for sale</h3>
              <p className="text-gray-400 text-sm">
                Choose between auctions, fixed-price listings, and declining-price listings. You choose how you want to sell your NFTs, and we help you sell them.
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="text-center py-6 text-gray-400 text-sm">
        <p>Made with &amp;hearts; by Axartoys | Developer&apos;s Den</p>
      </footer>
    </div>
  );
}
