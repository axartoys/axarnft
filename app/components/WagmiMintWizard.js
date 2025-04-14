'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useAccount, useConnect, useSignMessage } from 'wagmi';
import { metaMask } from 'wagmi/connectors';
import { GradientButton } from './GradientButton';
import { GradientText } from './ui';
import { storeOnIPFS, storeNFTData } from '../utils/ipfsStorage';
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI } from '../utils/contractABI';
import CryptoJS from 'crypto-js';

export function WagmiMintWizard({ isOpen, onClose }) {
  // Wagmi hooks
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { data: signature, error: signError, isPending, signMessage } = useSignMessage();

  // Wizard state
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedPersona, setSelectedPersona] = useState('');
  
  // Generated content states
  const [generatedName, setGeneratedName] = useState('');
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState('');
  
  // Minting states
  const [isMinting, setIsMinting] = useState(false);
  const [mintingStatus, setMintingStatus] = useState(''); // 'encrypting', 'uploading', 'minting', 'success', 'error'
  const [mintingError, setMintingError] = useState('');
  const [mintedTokenId, setMintedTokenId] = useState(null);
  const [encryptedData, setEncryptedData] = useState(null);
  const [signatureTimestamp, setSignatureTimestamp] = useState(null);
  
  // Modal animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 20, stiffness: 300 } }
  };

  // Generate content from OpenAI - COMMENTED OUT FOR DEBUGGING
  const generateContent = async () => {
    if (!selectedPersona || !customPrompt) {
      setGenerationError('Please select a persona and provide traits first');
      return;
    }
    
    setIsGenerating(true);
    setGenerationError('');
    
    try {
      // DEBUGGING: Use placeholder data instead of API call
      console.log('Using placeholder data for debugging');
      
      // Simulating API response with placeholder data
      setTimeout(() => {
        // Use persona title to generate a name
        const name = `${selectedPersona} #${Math.floor(Math.random() * 1000)}`;
        
        // Generate a simple description based on the persona
        const description = `A unique ${selectedPersona} NFT with custom traits. This persona embodies the characteristics you've defined.`;
        
        // Use a placeholder image based on the persona type
        let imagePath;
        switch (selectedPersona.toLowerCase()) {
          case 'artist':
            imagePath = '/placeholders/artist.png';
            break;
          case 'scientist':
            imagePath = '/placeholders/scientist.png';
            break;
          case 'philosopher':
            imagePath = '/placeholders/philosopher.png';
            break;
          case 'entrepreneur':
            imagePath = '/placeholders/entrepreneur.png';
            break;
          default:
            imagePath = '/placeholders/default.png';
        }
        
        setGeneratedName(name);
        setGeneratedDescription(description);
        setGeneratedImage(imagePath);
        setIsGenerating(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error generating content:', error);
      setGenerationError(`Failed to generate content: ${error.message}`);
      setIsGenerating(false);
    }
  };

  // Function to encrypt the prompt with the user's wallet signature
  const encryptPrompt = async (prompt) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }
    
    // Generate a timestamp for this encryption
    const timestamp = Date.now().toString();
    setSignatureTimestamp(timestamp);
    
    // Create a message to sign
    const message = `Sign this message to securely encrypt your AI persona prompt. This doesn't cost any gas and keeps your prompt secure.\n\nAddress: ${address}\nTimestamp: ${timestamp}`;
    
    // Request signature
    signMessage({ message });
  };

  // Effect to handle signature result for encryption
  useEffect(() => {
    const handleEncryptionSignature = async () => {
      if (signature && signatureTimestamp && isMinting && mintingStatus === 'encrypting') {
        try {
          // Use the signature to derive an encryption key
          const signatureHash = CryptoJS.SHA256(signature).toString();
          
          // Generate a random key for AES encryption
          const randomKey = CryptoJS.lib.WordArray.random(16);
          const randomKeyHex = randomKey.toString();
          
          // Encrypt the prompt with the random key
          const encryptedPrompt = CryptoJS.AES.encrypt(customPrompt, randomKeyHex).toString();
          
          // Encrypt the random key with the signature hash
          const encryptedKey = CryptoJS.AES.encrypt(randomKeyHex, signatureHash).toString();
          
          // Store the encrypted data
          const encryptedData = {
            encryptedPrompt,
            encryptedKey,
            timestamp: signatureTimestamp
          };
          
          setEncryptedData(encryptedData);
          
          // Move to the next step of the minting process
          setMintingStatus('uploading');
          uploadToIPFS(encryptedData);
        } catch (error) {
          console.error('Error processing encryption signature:', error);
          setMintingError(`Encryption failed: ${error.message}`);
          setIsMinting(false);
        }
      }
    };
    
    handleEncryptionSignature();
  }, [signature, signatureTimestamp, isMinting, mintingStatus, customPrompt]);

  // Function to upload metadata and encrypted prompt to IPFS
  const uploadToIPFS = async (encryptedData) => {
    try {
      // Prepare metadata for IPFS
      const metadata = {
        name: generatedName,
        description: generatedDescription,
        image: generatedImage,
        attributes: [
          {
            trait_type: "Persona Type",
            value: selectedPersona
          }
        ]
      };
      
      // Store metadata on IPFS
      console.log('Uploading metadata to IPFS...');
      const metadataIPFSHash = await storeOnIPFS(metadata);
      console.log('Metadata uploaded to IPFS:', metadataIPFSHash);
      
      // Store encrypted prompt data on IPFS
      console.log('Uploading encrypted prompt data to IPFS...');
      const promptIPFSHash = await storeOnIPFS(encryptedData);
      console.log('Encrypted prompt uploaded to IPFS:', promptIPFSHash);
      
      // For demonstration purposes, we'll simulate a successful minting
      // In a real implementation, you would interact with the blockchain here
      
      // Simulate minting success
      setMintingStatus('success');
      setMintedTokenId('DEMO-123'); // This would be the actual token ID from the blockchain
      
      // In a real implementation, you would mint the NFT on the blockchain:
      /*
      setMintingStatus('minting');
      console.log('Minting NFT on blockchain...');
      
      // Create a contract instance
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, signer);
      
      const tokenURI = `ipfs://${metadataIPFSHash}`;
      const tx = await nftContract.mintPersona(
        address,
        tokenURI,
        promptIPFSHash
      );
      
      // Wait for transaction to be mined
      console.log('Transaction submitted, waiting for confirmation...');
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);
      
      // Get the token ID from the event
      const event = receipt.events.find(event => event.event === 'PersonaMinted');
      const tokenId = event.args.tokenId.toString();
      console.log('NFT minted with token ID:', tokenId);
      
      setMintedTokenId(tokenId);
      setMintingStatus('success');
      */
      
    } catch (error) {
      console.error('Error uploading to IPFS or minting:', error);
      setMintingError(`Failed to upload or mint: ${error.message}`);
      setIsMinting(false);
    }
  };

  // Function to start the minting process
  const startMinting = async () => {
    if (!isConnected || !customPrompt || !generatedName || !generatedDescription || !generatedImage) {
      setMintingError('Please ensure all fields are filled and your wallet is connected.');
      return;
    }
    
    setIsMinting(true);
    setMintingStatus('encrypting');
    setMintingError('');
    
    try {
      // Start the encryption process
      await encryptPrompt(customPrompt);
    } catch (error) {
      console.error('Error starting minting process:', error);
      setMintingError(`Failed to start minting: ${error.message}`);
      setIsMinting(false);
    }
  };

  // Navigation functions
  const nextStep = () => {
    if (step === 2 && (!selectedPersona || !customPrompt)) {
      setGenerationError('Please select a persona and provide traits first');
      return;
    }
    
    if (step === 2) {
      generateContent();
    }
    
    if (step < totalSteps) {
      setStep(step + 1);
    } else if (step === totalSteps) {
      startMinting();
    }
  };
  
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Persona selection options
  const personaOptions = [
    { id: 'artist', title: 'Artist', description: 'Creative and expressive, with a unique perspective on the world.' },
    { id: 'scientist', title: 'Scientist', description: 'Analytical and curious, with a passion for discovery and innovation.' },
    { id: 'philosopher', title: 'Philosopher', description: 'Contemplative and insightful, with deep thoughts on existence and meaning.' },
    { id: 'entrepreneur', title: 'Entrepreneur', description: 'Ambitious and resourceful, with a drive to create and build.' }
  ];

  // Wizard steps content
  const steps = [
    {
      title: "Select Your AI Persona",
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 mb-4">
            Choose the type of AI persona you want to create. Each persona has unique characteristics and capabilities.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {personaOptions.map((persona) => (
              <div 
                key={persona.id}
                className={`p-4 rounded-lg cursor-pointer transition-all ${selectedPersona === persona.title ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-purple-500' : 'bg-gray-800 hover:bg-gray-700'}`}
                onClick={() => setSelectedPersona(persona.title)}
              >
                <h3 className="font-bold text-lg mb-1">{persona.title}</h3>
                <p className="text-sm text-gray-300">{persona.description}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Customize Your Persona",
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 mb-4">
            Describe the traits and characteristics you want your AI persona to have. Be specific to create a unique personality.
          </p>
          
          <div className="space-y-2">
            <label className="text-sm text-gray-300">Persona Traits</label>
            <textarea 
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none min-h-[150px]"
              placeholder="Example: A philosophical artist with a deep interest in quantum physics and a quirky sense of humor. They speak in metaphors and have a calm, thoughtful demeanor."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
            />
          </div>
          
          {generationError && (
            <div className="bg-red-900/30 text-red-200 p-4 rounded-lg">
              <p>{generationError}</p>
            </div>
          )}
        </div>
      )
    },
    {
      title: "Preview Your NFT",
      content: (
        <div className="space-y-4">
          {isGenerating ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
              <p className="text-gray-300">Generating your AI persona NFT...</p>
            </div>
          ) : generationError ? (
            <div className="bg-red-900/30 text-red-200 p-4 rounded-lg mb-4">
              <p>{generationError}</p>
              <button 
                className="mt-2 text-white bg-red-700 hover:bg-red-600 px-4 py-2 rounded-lg text-sm"
                onClick={generateContent}
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <p className="text-gray-300 mb-4">
                Here's a preview of your AI persona NFT. If you're happy with it, proceed to the next step to mint it.
              </p>
              
              <div className="flex flex-col md:flex-row gap-6">
                {generatedImage && (
                  <div className="w-full md:w-1/2">
                    <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden border-4 border-purple-500/30">
                      <img 
                        src={generatedImage} 
                        alt="Generated NFT" 
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                )}
                
                <div className="w-full md:w-1/2 space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400">NAME</h3>
                    <p className="text-xl font-bold">{generatedName || "Not generated yet"}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400">DESCRIPTION</h3>
                    <p className="text-gray-300">{generatedDescription || "Not generated yet"}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400">PERSONA TYPE</h3>
                    <p className="text-gray-300">{selectedPersona}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400">TRAITS</h3>
                    <p className="text-gray-300">{customPrompt.length > 100 ? customPrompt.substring(0, 100) + '...' : customPrompt}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )
    },
    {
      title: "Mint Your NFT",
      content: (
        <div className="space-y-4">
          {isMinting ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
              <p className="text-gray-300">
                {mintingStatus === 'encrypting' && 'Encrypting your prompt with your wallet signature...'}
                {mintingStatus === 'uploading' && 'Uploading encrypted data to IPFS...'}
                {mintingStatus === 'minting' && 'Minting your NFT on the blockchain...'}
                {mintingStatus === 'success' && 'Success! Your AI persona NFT has been minted!'}
              </p>
              {mintingStatus === 'success' && mintedTokenId && (
                <div className="mt-4 bg-green-900/30 text-green-200 p-4 rounded-lg">
                  <p>Your NFT has been minted successfully!</p>
                  <p className="mt-2">Token ID: {mintedTokenId}</p>
                  <p className="mt-2 text-sm">Your prompt has been encrypted with your wallet signature and securely stored on IPFS. Only you can decrypt it with your private key.</p>
                </div>
              )}
            </div>
          ) : mintingError ? (
            <div className="bg-red-900/30 text-red-200 p-4 rounded-lg mb-4">
              <p>{mintingError}</p>
              <button 
                className="mt-2 text-white bg-red-700 hover:bg-red-600 px-4 py-2 rounded-lg text-sm"
                onClick={() => setMintingError('')}
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <p className="text-gray-300 mb-4">
                Review your information and mint your AI persona NFT. Your prompt will be encrypted with your wallet signature.
              </p>
              <div className="bg-gray-800 p-4 rounded-lg mb-6">
                <h4 className="font-bold mb-2">Summary</h4>
                <ul className="space-y-2 text-gray-300">
                  <li><span className="font-semibold">Persona Traits:</span> {customPrompt ? (customPrompt.length > 100 ? customPrompt.substring(0, 100) + '...' : customPrompt) : "No persona selected"}</li>
                  <li><span className="font-semibold">Name:</span> {generatedName || "Not generated"}</li>
                  <li><span className="font-semibold">Description:</span> {generatedDescription ? (generatedDescription.length > 100 ? generatedDescription.substring(0, 100) + '...' : generatedDescription) : "Not generated"}</li>
                  <li><span className="font-semibold">Wallet:</span> {isConnected ? `Connected (${address.substring(0, 6)}...${address.substring(address.length - 4)})` : "Not Connected"}</li>
                  <li><span className="font-semibold">Gas Fee:</span> ~0.002 ETH</li>
                </ul>
              </div>
              
              <div className="bg-yellow-900/30 text-yellow-200 p-4 rounded-lg mb-6">
                <h4 className="font-bold mb-2">Security Information</h4>
                <p className="text-sm">Your prompt will be encrypted using your private key through a wallet signature, ensuring only you can decrypt and access it in the future. The encrypted data will be stored on IPFS, and only a reference to it will be stored on the blockchain.</p>
              </div>
              
              {generatedImage && (
                <div className="flex justify-center mb-6">
                  <div className="relative w-64 h-64 rounded-lg overflow-hidden border-4 border-purple-500/30">
                    <img 
                      src={generatedImage} 
                      alt="Generated NFT" 
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              )}
              
              {!isConnected && (
                <div className="bg-yellow-900/30 text-yellow-200 p-4 rounded-lg mb-4">
                  <p>You need to connect your wallet before you can mint your NFT.</p>
                </div>
              )}
              
              {!isConnected && (
                <GradientButton
                  onClick={() => connect({ connector: metaMask() })}
                  className="w-full py-3 mb-4"
                >
                  Connect Wallet
                </GradientButton>
              )}
            </>
          )}
        </div>
      )
    }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose}
      >
        <motion.div 
          className="bg-gray-900 rounded-xl p-8 max-w-2xl w-full mx-4 relative overflow-hidden"
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'radial-gradient(circle at top right, rgba(160, 86, 247, 0.15), rgba(255, 90, 126, 0.05), rgba(13, 18, 30, 1) 70%)',
            boxShadow: '0 0 30px rgba(160, 86, 247, 0.2)'
          }}
        >
          {/* Close button */}
          <button 
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
            onClick={onClose}
          >
            ✕
          </button>
          
          {/* Progress indicator */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div 
                  key={i} 
                  className={`w-full h-1 rounded-full mx-1 ${i < step ? 'bg-gradient-to-r from-pink-500 to-purple-500' : 'bg-gray-700'}`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-400 text-right">
              Step {step} of {totalSteps}
            </div>
          </div>
          
          {/* Step title */}
          <h2 className="text-2xl font-bold mb-6" style={{ 
            background: 'linear-gradient(90deg, #FF5A7E 0%, #A056F7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {steps[step-1].title}
          </h2>
          
          {/* Step content */}
          <div className="mb-8">
            {steps[step-1].content}
          </div>
          
          {/* Navigation buttons */}
          <div className="flex justify-between">
            <GradientButton 
              onClick={prevStep}
              className={`px-6 ${step === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={step === 1}
            >
              Back
            </GradientButton>
            
            <GradientButton 
              onClick={nextStep}
              disabled={(step === 3 && !generatedName) || (step === totalSteps && (!isConnected || isMinting))}
              className={(step === 3 && !generatedName) || (step === totalSteps && (!isConnected || isMinting)) ? 'opacity-50 cursor-not-allowed' : ''}
            >
              {step === totalSteps ? (mintingStatus === 'success' ? 'Done' : 'Mint NFT') : 'Continue'}
            </GradientButton>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
