import React from 'react';
import Card from './Card';

export const LifeEventCard = ({
  icon: Icon,
  label,
  description,
  isSelected = false,
  onClick
}) => {
  return (
    <Card
      onClick={onClick}
      className={`cursor-pointer transition-all ${
        isSelected
          ? 'border-brand-blue bg-blue-50 shadow-md'
          : 'hover:border-brand-blue hover:shadow-md'
      }`}
      border
    >
      <div className="text-center">
        {Icon && (
          <div className={`mx-auto w-12 h-12 flex items-center justify-center rounded-lg ${
            isSelected ? 'bg-brand-blue text-white' : 'bg-gray-100 text-brand-blue'
          }`}>
            <Icon size={24} />
          </div>
        )}
        <h3 className="font-semibold text-gray-900 mt-3">{label}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
        {isSelected && (
          <div className="mt-3 text-brand-blue font-medium text-sm">✓ Selected</div>
        )}
      </div>
    </Card>
  );
};

export default LifeEventCard;
