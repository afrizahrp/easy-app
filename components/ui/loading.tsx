import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  text = 'Loading',
  fullScreen = false,
  className = '',
}) => {
  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  const content = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Loading text */}
      <h2 className='text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4'>
        {text}
      </h2>

      {/* 3 dots animation */}
      <div className='flex space-x-2'>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`${dotSizes[size]} bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce`}
            style={{ animationDelay: `${i * 0.15}s` }}
          ></div>
        ))}
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800'>
        <div className='text-center'>{content}</div>
      </div>
    );
  }

  return content;
};

export default Loading;
