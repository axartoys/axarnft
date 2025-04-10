"use client";

import Image from "next/image";
import { useState } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";

export default function Home() {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState("");

  const connectWallet = async () => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const accounts = await provider.listAccounts();
      setAccount(accounts[0]);
      setConnected(true);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black text-white">
      <nav className="flex justify-between items-center p-6">
        <div className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
          axartoys.ai
        </div>
        <button
          onClick={connectWallet}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        >
          {connected ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : "Connect Wallet"}
        </button>
      </nav>

      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4">
            Discover collect,
            <br />
            & sell
            <span className="text-cyan-400"> Extraordinary</span>
            <br />
            NFTs
          </h1>
          <p className="text-gray-300 text-xl mb-8">
            the leading NFT Marketplace on Ethereum
            <br />
            Home to the next generation of digital creators. Discover the best NFT collections.
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full">
              Explore
            </button>
            <button className="border-2 border-white hover:bg-white hover:text-black text-white font-bold py-3 px-8 rounded-full transition-colors">
              Create
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Sample NFT Cards */}
          <div className="bg-gray-800 rounded-xl overflow-hidden">
            <Image
              src="/placeholder.png"
              alt="NFT"
              width={300}
              height={300}
              className="w-full object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">NFT Title</h3>
              <p className="text-gray-400">0.05 ETH</p>
            </div>
          </div>
          {/* Add more NFT cards here */}
        </div>

        <div className="mt-16 text-center">
          <div className="flex justify-center gap-8 text-2xl font-bold">
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
        </div>
      </main>
    </div>
  );
}
