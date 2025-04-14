import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import { GradientButton } from './GradientButton';
import { GradientText } from './ui';
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI } from '../utils/contractABI';
import { retrieveFromIPFS, decryptPrompt } from '../utils/encryption';

export function PersonaGallery({ isWalletConnected, connectWallet }) {
  const [userNFTs, setUserNFTs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [decryptedPrompt, setDecryptedPrompt] = useState('');
  const [decrypting, setDecrypting] = useState(false);
  const [decryptError, setDecryptError] = useState('');

  // Load user's NFTs when wallet is connected
  useEffect(() => {
    if (isWalletConnected) {
      loadUserNFTs();
    } else {
      setUserNFTs([]);
      setSelectedNFT(null);
      setDecryptedPrompt('');
    }
  }, [isWalletConnected]);

  // Function to load user's NFTs
  const loadUserNFTs = async () => {
    setLoading(true);
    setError('');
    
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, signer);
      
      // Get all token IDs owned by the user
      const tokenIds = await nftContract.getTokensOfOwner(address);
      
      if (tokenIds.length === 0) {
        setUserNFTs([]);
        setLoading(false);
        return;
      }
      
      // Get metadata for each token
      const nfts = await Promise.all(tokenIds.map(async (id) => {
        try {
          // Get token URI
          const tokenURI = await nftContract.tokenURI(id);
          const formattedURI = tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
          
          // Get prompt IPFS hash
          const promptIPFSHash = await nftContract.getPromptIPFSHash(id);
          
          // Fetch metadata from IPFS
          const response = await fetch(formattedURI);
          const metadata = await response.json();
          
          return {
            id: id.toString(),
            name: metadata.name,
            description: metadata.description,
            image: metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/'),
            promptIPFSHash
          };
        } catch (error) {
          console.error(`Error fetching NFT ${id}:`, error);
          return {
            id: id.toString(),
            name: `NFT #${id}`,
            description: 'Metadata unavailable',
            image: '/placeholder-nft.png',
            promptIPFSHash: ''
          };
        }
      }));
      
      setUserNFTs(nfts);
    } catch (error) {
      console.error('Error loading NFTs:', error);
      setError('Failed to load your NFTs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to decrypt the prompt for a selected NFT
  const decryptNFTPrompt = async (nft) => {
    setDecrypting(true);
    setDecryptError('');
    setDecryptedPrompt('');
    
    try {
      // Check if we have the encryption key in session storage
      const encryptionKey = sessionStorage.getItem(`encryptionKey_${nft.id}`);
      
      if (!encryptionKey) {
        // If not, we need to ask the user to sign a message to derive it
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        
        // This should match the message used during encryption
        const message = `Sign this message to securely decrypt your AI persona prompt. This doesn't cost any gas and keeps your prompt secure.\n\nAddress: ${address}\nTimestamp: ${Date.now()}`;
        const signature = await signer.signMessage(message);
        
        // Derive the encryption key from the signature
        const derivedKey = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(signature));
        
        // Retrieve the encrypted data from IPFS
        const encryptedData = await retrieveFromIPFS(nft.promptIPFSHash);
        
        // Decrypt the prompt
        const prompt = decryptPrompt(
          encryptedData.encryptedPrompt,
          encryptedData.encryptedKey,
          derivedKey
        );
        
        setDecryptedPrompt(prompt);
        
        // Save the key for this session
        sessionStorage.setItem(`encryptionKey_${nft.id}`, derivedKey);
      } else {
        // If we already have the key, use it
        const encryptedData = await retrieveFromIPFS(nft.promptIPFSHash);
        
        const prompt = decryptPrompt(
          encryptedData.encryptedPrompt,
          encryptedData.encryptedKey,
          encryptionKey
        );
        
        setDecryptedPrompt(prompt);
      }
    } catch (error) {
      console.error('Error decrypting prompt:', error);
      setDecryptError('Failed to decrypt prompt. Please try again.');
    } finally {
      setDecrypting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8">
        <GradientText>Your AI Personas</GradientText>
      </h2>
      
      {!isWalletConnected ? (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-300 mb-6">Connect your wallet to view your AI Personas</p>
          <GradientButton onClick={connectWallet}>Connect Wallet</GradientButton>
        </div>
      ) : loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-gray-300">Loading your AI Personas...</p>
        </div>
      ) : error ? (
        <div className="bg-red-900/30 text-red-200 p-6 rounded-lg">
          <p>{error}</p>
          <button 
            className="mt-4 text-white bg-red-700 hover:bg-red-600 px-4 py-2 rounded-lg"
            onClick={loadUserNFTs}
          >
            Try Again
          </button>
        </div>
      ) : userNFTs.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-300 mb-6">You don't have any AI Personas yet</p>
          <GradientButton onClick={() => window.location.href = '/'}>Create Your First Persona</GradientButton>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userNFTs.map((nft) => (
            <motion.div
              key={nft.id}
              className={`bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer transition-all ${selectedNFT?.id === nft.id ? 'ring-2 ring-purple-500' : ''}`}
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(160, 86, 247, 0.4)' }}
              onClick={() => {
                setSelectedNFT(nft);
                setDecryptedPrompt('');
                setDecryptError('');
              }}
            >
              <div className="relative h-48 bg-gray-700">
                <img 
                  src={nft.image} 
                  alt={nft.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-nft.png';
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{nft.name}</h3>
                <p className="text-gray-400 text-sm mb-2 line-clamp-2">{nft.description}</p>
                <div className="text-xs text-gray-500">Token ID: {nft.id}</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {selectedNFT && (
        <div className="mt-12 bg-gray-800 rounded-lg p-6">
          <h3 className="text-2xl font-bold mb-4">{selectedNFT.name}</h3>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <div className="relative h-64 w-full rounded-lg overflow-hidden">
                <img 
                  src={selectedNFT.image} 
                  alt={selectedNFT.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-nft.png';
                  }}
                />
              </div>
            </div>
            
            <div className="md:w-2/3">
              <p className="text-gray-300 mb-4">{selectedNFT.description}</p>
              
              {decryptedPrompt ? (
                <div className="mt-6">
                  <h4 className="text-lg font-bold mb-2">Decrypted Prompt</h4>
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <p className="text-gray-300 whitespace-pre-wrap">{decryptedPrompt}</p>
                  </div>
                  <div className="mt-4">
                    <GradientButton 
                      onClick={() => {
                        // Copy to clipboard
                        navigator.clipboard.writeText(decryptedPrompt);
                        alert('Prompt copied to clipboard!');
                      }}
                    >
                      Copy Prompt
                    </GradientButton>
                  </div>
                </div>
              ) : decrypting ? (
                <div className="mt-6 text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mb-2"></div>
                  <p className="text-gray-300">Decrypting your prompt...</p>
                </div>
              ) : decryptError ? (
                <div className="mt-6 bg-red-900/30 text-red-200 p-4 rounded-lg">
                  <p>{decryptError}</p>
                  <button 
                    className="mt-2 text-white bg-red-700 hover:bg-red-600 px-4 py-2 rounded-lg text-sm"
                    onClick={() => decryptNFTPrompt(selectedNFT)}
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="mt-6">
                  <p className="text-gray-400 mb-4">
                    This AI persona has an encrypted prompt that only you can decrypt with your wallet.
                  </p>
                  <GradientButton onClick={() => decryptNFTPrompt(selectedNFT)}>
                    Decrypt Prompt
                  </GradientButton>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
