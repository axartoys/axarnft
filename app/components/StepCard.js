import Image from 'next/image';
import { GradientButton } from './GradientButton';

export function StepCard({
  title,
  description,
  imageSrc,
  imageAlt,
  buttonText,
  onClick,
  className = '',
  ...props
}) {
  return (
    <div className={`bg-gray-900 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-purple-500/20 transition-all flex flex-col h-full ${className}`} {...props}>
      <div className="relative h-48 w-full">
        <Image 
          src={imageSrc} 
          alt={imageAlt || title} 
          fill 
          style={{ objectFit: 'cover' }}
          className="rounded-t-lg"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        <p className="text-gray-400 mb-6 flex-grow">
          {description}
        </p>
        <GradientButton 
          onClick={onClick}
          className="w-full mt-auto"
        >
          {buttonText}
        </GradientButton>
      </div>
    </div>
  );
}
