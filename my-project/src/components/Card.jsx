import React from 'react';

export const Card = ({
  children,
  className = '',
  padding = 'p-6',
  shadow = true,
  border = true,
  hover = false
}) => {
  const shadowClass = shadow ? 'shadow-sm' : '';
  const borderClass = border ? 'border border-gray-200' : '';
  const hoverClass = hover ? 'hover:shadow-md hover:border-gray-300 cursor-pointer transition-all' : '';

  return (
    <div className={`bg-white rounded-lg ${shadowClass} ${borderClass} ${hoverClass} ${padding} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
