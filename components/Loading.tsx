import React from 'react';

const LoadingSpinner: React.FC = ({ 

}) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/30">
      <div className="w-16 h-16 border-4 border-white border-t-blue-500 rounded-full animate-spin mb-4"></div>
      <p className="text-white text-lg font-medium tracking-wide">
       Loading...
      </p>
    </div>
  );
};

export default LoadingSpinner;