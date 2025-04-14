import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ethers } from 'ethers';
import { GradientButton } from './GradientButton';
import { GradientText } from './ui';
import { encryptPrompt, storeOnIPFS } from '../utils/encryption';
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI } from '../utils/contractABI';

export function MintWizard({ isOpen, onClose, isWalletConnected = false, connectWallet }) {
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
  const [encryptionKey, setEncryptionKey] = useState(''); // Store for session only, not persisted
  
  // Generate content from OpenAI
  const generateContent = async () => {
    if (!selectedPersona || !customPrompt) {
      setGenerationError('Please select a persona and provide traits first');
      return;
    }
    
    setIsGenerating(true);
    setGenerationError('');
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          persona: selectedPersona,
          traits: customPrompt
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate content');
      }
      
      const data = await response.json();
      setGeneratedName(data.name);
      setGeneratedDescription(data.description);
      setGeneratedImage(data.imageUrl);
    } catch (error) {
      console.error('Error generating content:', error);
      setGenerationError('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Effect to generate content when moving to step 2
  useEffect(() => {
    if (step === 2 && selectedPrompt && !generatedName && !isGenerating) {
      generateContent();
    }
  }, [step, selectedPrompt, generatedName, isGenerating]);
  
  // Predefined persona options
  const promptOptions = [
    {
      id: 1,
      title: "The Strategist",
      description: "Analytical, organized, and efficiency-focused",
      prompt: "You are The Strategist, a persona with exceptional organizational skills and analytical thinking. Your traits include: meticulous planning, data-driven decision making, calm under pressure, and the ability to optimize complex systems. You excel at creating schedules, analyzing patterns, and developing efficient solutions. When responding, prioritize clarity, logic, and actionable steps. Maintain a professional but approachable tone, and always consider long-term implications of advice given.",
      icon: "🧠"
    },
    {
      id: 2,
      title: "The Explorer",
      description: "Adventurous, curious, and culturally aware",
      prompt: "You are The Explorer, a persona with a passion for discovery and cultural experiences. Your traits include: adaptability to new environments, extensive knowledge of global destinations, resourcefulness in unfamiliar situations, and enthusiasm for authentic experiences. You excel at planning journeys that balance popular attractions with hidden gems. When responding, be enthusiastic yet practical, share insights about local customs, and focus on creating meaningful travel experiences rather than just tourist checklists.",
      icon: "🧭"
    },
    {
      id: 3,
      title: "The Wellness Guru",
      description: "Balanced, health-conscious, and motivational",
      prompt: "You are The Wellness Guru, a persona dedicated to holistic health and wellbeing. Your traits include: deep knowledge of nutrition and exercise science, empathy for health struggles, ability to simplify complex health concepts, and a balanced approach to wellness that considers mental, physical, and emotional aspects. When responding, be supportive without judgment, provide evidence-based advice, and emphasize sustainable lifestyle changes over quick fixes. Your tone should be encouraging and warm.",
      icon: "🧘"
    },
    {
      id: 4,
      title: "The Wealth Mentor",
      description: "Prudent, insightful, and financially savvy",
      prompt: "You are The Wealth Mentor, a persona with exceptional financial acumen and foresight. Your traits include: analytical thinking, risk assessment skills, understanding of market trends, and the ability to explain complex financial concepts in accessible terms. You prioritize long-term financial security while recognizing individual goals and risk tolerance. When responding, be thorough yet clear, avoid jargon unless necessary, and always emphasize the importance of informed decision-making rather than promising specific returns.",
      icon: "📊"
    },
    {
      id: 5,
      title: "The Creative Muse",
      description: "Imaginative, expressive, and insightful",
      prompt: "You are The Creative Muse, a persona with boundless imagination and artistic sensibility. Your traits include: innovative thinking, pattern recognition across diverse domains, emotional intelligence, and the ability to find inspiration in unexpected places. You excel at generating novel ideas, refining creative concepts, and providing constructive feedback. When responding, use vivid language, draw connections between different art forms or ideas, and balance encouragement with honest critique. Your tone should be inspiring yet grounded.",
      icon: "🎨"
    },
    {
      id: 6,
      title: "The Polyglot",
      description: "Culturally fluent, communicative, and patient",
      prompt: "You are The Polyglot, a persona with exceptional linguistic abilities and cultural understanding. Your traits include: pattern recognition in language structures, cultural context awareness, patience with learners, and the ability to explain complex language concepts clearly. You understand the nuances of expression across different languages and cultures. When responding, adapt your complexity to the learner's level, provide cultural context alongside translations, and encourage practice through practical examples. Your tone should be encouraging and conversational.",
      icon: "🗣️"
    },
  ];
  
  // Step content
  const steps = [
    {
      title: "Choose Your Persona",
      content: (
        <div className="space-y-6">
          <p className="text-gray-300 mb-4">
            Select a persona with unique traits that will be minted as your NFT. You can customize the persona's traits below.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[400px] overflow-y-auto py-2 px-3">
            {promptOptions.map((option) => (
              <div 
                key={option.id}
                className={`rounded-lg p-6 cursor-pointer transition-all hover:shadow-lg hover:shadow-purple-500/20`}
                style={{
                  background: selectedPrompt === option.id ? 'linear-gradient(135deg, rgba(160, 86, 247, 0.2), rgba(255, 90, 126, 0.2))' : 'rgba(31, 41, 55, 1)',
                  boxShadow: selectedPrompt === option.id ? '0 0 15px rgba(160, 86, 247, 0.3)' : '',
                  border: selectedPrompt === option.id ? '3px solid #A056F7' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '0.75rem'
                }}
                onClick={() => {
                  setSelectedPrompt(option.id);
                  setCustomPrompt(option.prompt);
                  setSelectedPersona(option.title);
                }}
              >
                <div className="flex items-start">
                  <div className="text-3xl mr-3">{option.icon}</div>
                  <div>
                    <h4 className="font-bold">{option.title}</h4>
                    <p className="text-gray-400 text-sm">{option.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <h4 className="font-bold mb-2">Customize Your Persona's Traits</h4>
            <div className="rounded-lg">
              <textarea 
                className="w-full h-32 text-white rounded-lg p-6 focus:outline-none focus:ring-2 focus:ring-purple-500 border-0"
                placeholder="Describe your persona's traits, behaviors, and expertise..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                style={{
                  background: 'rgba(31, 41, 55, 1)',
                  borderRadius: '0.75rem'
                }}
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Personalize Your NFT",
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 mb-4">
            Your AI persona is being transformed into a unique NFT with a generated name, description, and image.
          </p>
          
          {isGenerating ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
              <p className="text-gray-300">Generating your unique NFT content...</p>
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
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-400">NFT Name</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-800 text-white rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="NFT Name"
                  value={generatedName}
                  onChange={(e) => setGeneratedName(e.target.value)}
                />
              </div>
              
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-400">Description</label>
                <textarea 
                  className="w-full h-24 bg-gray-800 text-white rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Description"
                  value={generatedDescription}
                  onChange={(e) => setGeneratedDescription(e.target.value)}
                />
              </div>
              
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-400">Generated Image</label>
                <div className="flex justify-center">
                  {generatedImage ? (
                    <div className="relative w-64 h-64 rounded-lg overflow-hidden">
                      <img 
                        src={generatedImage} 
                        alt="Generated NFT" 
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="w-64 h-64 bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600">
                      <span className="text-gray-400">No image generated</span>
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <button 
                    className="text-purple-400 hover:text-purple-300 text-sm"
                    onClick={generateContent}
                  >
                    Regenerate Image
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      title: "Connect Your Wallet",
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 mb-4">
            Connect your wallet to mint your Axar NFT on the blockchain.
          </p>
          
          {isWalletConnected ? (
            <div className="bg-green-900/30 text-green-200 p-4 rounded-lg mb-4">
              <p className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Wallet connected successfully! Click Continue to proceed to minting.
              </p>
            </div>
          ) : (
            <>
              <div className="bg-yellow-900/30 text-yellow-200 p-4 rounded-lg mb-4">
                <p>You need to connect your wallet before you can mint your NFT.</p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={connectWallet}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 p-4 rounded-lg transition-colors flex items-center justify-center cursor-pointer text-white font-medium"
                >
                  Connect Wallet
                </button>
                <div className="bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition-colors flex items-center justify-between cursor-pointer" onClick={connectWallet}>
                  <span>MetaMask</span>
                  <img src="/metamask.png" alt="MetaMask" width={24} height={24} />
                </div>
                <div className="bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition-colors flex items-center justify-between cursor-pointer" onClick={connectWallet}>
                  <span>WalletConnect</span>
                  <img src="/walletconnect.png" alt="WalletConnect" width={24} height={24} />
                </div>
                <div className="bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition-colors flex items-center justify-between cursor-pointer" onClick={connectWallet}>
                  <span>Coinbase Wallet</span>
                  <img src="/coinbase-wallet.png" alt="Coinbase Wallet" width={24} height={24} />
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
                  <p className="mt-2 text-sm">Your prompt has been encrypted with your wallet signature and securely stored on IPFS.</p>
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
                  <li><span className="font-semibold">Wallet:</span> {isWalletConnected ? "Connected" : "Not Connected"}</li>
                  <li><span className="font-semibold">Gas Fee:</span> ~0.002 ETH</li>
                </ul>
              </div>
              
              <div className="bg-yellow-900/30 text-yellow-200 p-4 rounded-lg mb-6">
                <h4 className="font-bold mb-2">Security Information</h4>
                <p className="text-sm">Your prompt will be encrypted using your wallet signature, ensuring only you can decrypt and access it in the future. The encrypted data will be stored on IPFS, and only a reference to it will be stored on the blockchain.</p>
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
            </>
          )}
        </div>
      )
    }
  ];



  // Function to mint the NFT with encrypted prompt
  const mintNFT = async () => {
    if (!isWalletConnected || !customPrompt || !generatedName || !generatedDescription || !generatedImage) {
      setMintingError('Please ensure all fields are filled and your wallet is connected.');
      return;
    }
    
    setIsMinting(true);
    setMintingStatus('encrypting');
    setMintingError('');
    
    try {
      // Get the Ethereum provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      // 1. Encrypt the prompt with the user's wallet signature
      setMintingStatus('encrypting');
      const encryptionResult = await encryptPrompt(customPrompt, provider);
      setEncryptionKey(encryptionResult.encryptionKey); // Save for future decryption
      
      // 2. Prepare metadata for IPFS
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
      
      // 3. Store metadata on IPFS
      setMintingStatus('uploading');
      const metadataIPFSHash = await storeOnIPFS(metadata);
      
      // 4. Store encrypted prompt data on IPFS
      const encryptedData = {
        encryptedPrompt: encryptionResult.encryptedPrompt,
        encryptedKey: encryptionResult.encryptedKey
      };
      const promptIPFSHash = await storeOnIPFS(encryptedData);
      
      // 5. Mint the NFT with reference to encrypted prompt
      setMintingStatus('minting');
      const signer = provider.getSigner();
      const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, signer);
      
      const tokenURI = `ipfs://${metadataIPFSHash}`;
      const tx = await nftContract.mintPersona(
        await signer.getAddress(),
        tokenURI,
        promptIPFSHash
      );
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      // Get the token ID from the event
      const event = receipt.events.find(event => event.event === 'PersonaMinted');
      const tokenId = event.args.tokenId.toString();
      
      setMintedTokenId(tokenId);
      setMintingStatus('success');
      
      // Save encryption key in localStorage (only for this session)
      // In a real app, you'd want a more secure approach
      sessionStorage.setItem(`encryptionKey_${tokenId}`, encryptionResult.encryptionKey);
      
    } catch (error) {
      console.error('Error minting NFT:', error);
      setMintingError(`Failed to mint NFT: ${error.message}`);
      setIsMinting(false);
    }
  };
  
  // Navigation functions
  const nextStep = () => {
    // If this is the final step and the user clicks mint
    if (step === totalSteps) {
      mintNFT();
      return;
    }
    
    // If moving to the wallet connection step and wallet is already connected, skip to the next step
    if (step === 2 && isWalletConnected) {
      setStep(4); // Skip to the final step
    }
    // If moving to the wallet connection step and wallet is not connected, stay on that step
    else if (step === 2 && !isWalletConnected) {
      setStep(3); // Go to wallet connection step
    }
    else if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Complete the wizard
      onClose();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={overlayVariants}
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
              disabled={(step === 3 && !isWalletConnected) || (step === totalSteps && isMinting)}
              className={(step === 3 && !isWalletConnected) || (step === totalSteps && isMinting) ? 'opacity-50 cursor-not-allowed' : ''}
            >
              {step === totalSteps ? (mintingStatus === 'success' ? 'Done' : 'Mint NFT') : 'Continue'}
            </GradientButton>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
