import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { GradientButton } from './GradientButton';
import { GradientText } from './ui';

export function MintWizard({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [customPrompt, setCustomPrompt] = useState('');
  
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
            {promptOptions.map((option) => (
              <div 
                key={option.id}
                className={`bg-gray-800 rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg hover:shadow-purple-500/20 ${selectedPrompt === option.id ? 'ring-2 ring-purple-500' : ''}`}
                onClick={() => {
                  setSelectedPrompt(option.id);
                  setCustomPrompt(option.prompt);
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
            <textarea 
              className="w-full h-32 bg-gray-800 text-white rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Describe your persona's traits, behaviors, and expertise..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
            />
          </div>
        </div>
      )
    },
    {
      title: "Personalize Your NFT",
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 mb-4">
            Add a name, description, and visual elements to your AI persona.
          </p>
          <div className="space-y-4">
            <input 
              type="text" 
              className="w-full bg-gray-800 text-white rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="NFT Name"
            />
            <textarea 
              className="w-full h-24 bg-gray-800 text-white rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Description"
            />
            <div className="flex justify-center">
              <div className="w-48 h-48 bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600 cursor-pointer hover:border-purple-500 transition-colors">
                <span className="text-gray-400">Upload Image</span>
              </div>
            </div>
          </div>
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
          <div className="space-y-3">
            <div className="bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition-colors flex items-center justify-between cursor-pointer">
              <span>MetaMask</span>
              <img src="/metamask.png" alt="MetaMask" width={24} height={24} />
            </div>
            <div className="bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition-colors flex items-center justify-between cursor-pointer">
              <span>WalletConnect</span>
              <img src="/walletconnect.png" alt="WalletConnect" width={24} height={24} />
            </div>
            <div className="bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition-colors flex items-center justify-between cursor-pointer">
              <span>Coinbase Wallet</span>
              <img src="/coinbase-wallet.png" alt="Coinbase Wallet" width={24} height={24} />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Mint Your NFT",
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 mb-4">
            Review your information and mint your AI persona NFT.
          </p>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h4 className="font-bold mb-2">Summary</h4>
            <ul className="space-y-2 text-gray-300">
              <li><span className="font-semibold">Persona Traits:</span> {customPrompt ? (customPrompt.length > 100 ? customPrompt.substring(0, 100) + '...' : customPrompt) : "No persona selected"}</li>
              <li><span className="font-semibold">Name:</span> Your NFT Name</li>
              <li><span className="font-semibold">Wallet:</span> Connected</li>
              <li><span className="font-semibold">Gas Fee:</span> ~0.002 ETH</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  // Navigation functions
  const nextStep = () => {
    if (step < totalSteps) {
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
          className="bg-gray-900 rounded-xl p-8 max-w-2xl w-full mx-4 relative"
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()}
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
            
            <GradientButton onClick={nextStep}>
              {step === totalSteps ? 'Mint NFT' : 'Continue'}
            </GradientButton>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
