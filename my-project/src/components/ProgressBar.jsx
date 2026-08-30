import React from 'react';

export const ProgressBar = ({
  value = 0,
  max = 100,
  color = 'brand-blue',
  showLabel = true,
  size = 'md'
}) => {
  const percentage = (value / max) * 100;

  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const colorClasses = {
    'brand-blue': 'bg-brand-blue',
    green: 'bg-green-600',
    red: 'bg-red-600',
    yellow: 'bg-yellow-600'
  };

  return (
    <div>
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`${colorClasses[color]} h-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-sm text-gray-600 mt-1">{Math.round(percentage)}% complete</p>
      )}
    </div>
  );
};

export default ProgressBar;
