import { motion } from 'framer-motion';

export function GradientButton({
  children,
  href,
  onClick,
  className = '',
  gradient = 'linear-gradient(90deg, #FF5A7E 0%, #A056F7 100%)',
  ...props
}) {
  const buttonClass = `relative text-white font-bold py-3 px-8 rounded-full shadow-lg overflow-hidden ${className}`;
  
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={buttonClass}
      style={{
        background: gradient,
        transition: 'all 0.3s ease'
      }}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function GradientTextButton({
  children,
  onClick,
  className = '',
  gradient = 'linear-gradient(90deg, #FF5A7E 0%, #A056F7 100%)',
  isConnected = false,
  ...props
}) {
  // Use a different class and style for connected state
  const buttonClass = `relative px-8 py-2 rounded-full transition-all font-medium ${isConnected ? 'bg-opacity-10 bg-green-500' : ''} ${className}`;
  
  // Use a green gradient for connected state
  const activeGradient = isConnected 
    ? 'linear-gradient(90deg, #4CAF50, #8BC34A)' 
    : gradient;
  
  return (
    <button
      onClick={onClick}
      className={buttonClass}
      {...props}
    >
      {isConnected && (
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
      )}
      <span 
        className={`relative z-10 ${isConnected ? 'pl-3' : ''}`} 
        style={{
          background: activeGradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        {children}
      </span>
      <span className="absolute inset-0 rounded-full border-2 border-transparent" style={{
        background: `${activeGradient} border-box`,
        WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'destination-out',
        maskComposite: 'exclude',
      }}></span>
      <span 
        className="absolute inset-0 rounded-full opacity-0 hover:opacity-100 transition-opacity"
        style={{
          background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.2))',
        }}
      ></span>
    </button>
  );
}
