import React from 'react';

export const LoadingState = ({
  message = 'Loading...'
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-gray-200 rounded-full" />
        <div className="absolute inset-0 border-4 border-transparent border-t-brand-blue rounded-full animate-spin" />
      </div>
      <p className="text-gray-600 mt-4">{message}</p>
    </div>
  );
};

export default LoadingState;
