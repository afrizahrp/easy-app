import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'pulse' | 'wave' | 'dots';
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  text,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const renderSpinner = () => {
    switch (variant) {
      case 'pulse':
        return (
          <div className={`${sizeClasses[size]} relative`}>
            <div className='absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse'></div>
            <div className='absolute inset-1 rounded-full bg-white dark:bg-gray-800'></div>
            <div
              className='absolute inset-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse'
              style={{ animationDelay: '0.5s' }}
            ></div>
          </div>
        );

      case 'wave':
        return (
          <div className='flex space-x-1'>
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className='w-2 h-8 bg-gradient-to-t from-blue-600 to-purple-600 rounded-full animate-pulse'
                style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>
        );

      case 'dots':
        return (
          <div className='flex space-x-2'>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className='w-3 h-3 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce'
                style={{ animationDelay: `${i * 0.15}s` }}
              ></div>
            ))}
          </div>
        );

      default:
        return (
          <div className={`${sizeClasses[size]} relative`}>
            {/* Outer ring */}
            <div className='absolute inset-0 rounded-full border-4 border-blue-200 dark:border-gray-700'></div>

            {/* Spinning rings */}
            <div className='absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 animate-spin'></div>
            <div
              className='absolute inset-2 rounded-full border-4 border-transparent border-b-indigo-600 dark:border-b-indigo-400 animate-spin'
              style={{ animationDelay: '-0.5s' }}
            ></div>
            <div
              className='absolute inset-4 rounded-full border-4 border-transparent border-l-purple-600 dark:border-l-purple-400 animate-spin'
              style={{ animationDelay: '-1s' }}
            ></div>

            {/* Center dot */}
            <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse'></div>
          </div>
        );
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {renderSpinner()}
      {text && (
        <p className='text-sm text-gray-600 dark:text-gray-400 mt-3 animate-pulse'>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
