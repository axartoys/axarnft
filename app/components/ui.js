import Image from 'next/image';

export function GradientText({
  children,
  gradient = 'linear-gradient(90deg, #FF5A7E 0%, #A056F7 100%)',
  className = '',
  ...props
}) {
  return (
    <span
      className={className}
      style={{
        background: gradient,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}
      {...props}
    >
      {children}
    </span>
  );
}

export function RadialGradient({
  className = '',
  position = 'top-80 left-3/5',
  size = 'w-[600px] h-[600px]',
  opacity = 0.1,
  colors = '#FF5A7E 0%, #A056F7 50%, rgba(0,0,0,0) 70%',
  ...props
}) {
  return (
    <div
      className={`absolute ${position} transform -translate-x-1/2 -translate-y-1/2 ${size} rounded-full blur-xl z-0 ${className}`}
      style={{
        background: `radial-gradient(circle, ${colors})`,
        opacity
      }}
      {...props}
    ></div>
  );
}

export function Card({
  children,
  className = '',
  heading,
  subheading,
  ...props
}) {
  return (
    <div
      className={`bg-gray-900 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-purple-500/20 transition-all p-6 ${className}`}
      {...props}
    >
      {heading && (
        <h3 className="text-xl font-bold mb-4">{heading}</h3>
      )}
      {subheading && (
        <p className="text-gray-400 mb-6">{subheading}</p>
      )}
      {children}
    </div>
  );
}

export function IconCard({
  children,
  className = '',
  icon,
  ...props
}) {
  return (
    <div className={`p-6 flex flex-col flex-grow ${className}`} {...props}>
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
          {icon}
        </div>
      </div>
      {children}
    </div>
  );
}
