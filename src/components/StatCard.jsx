import React from 'react';

export const StatCard = ({
  label,
  value,
  icon: Icon,
  color = 'blue',
  trend,
  className = ''
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200'
  };

  return (
    <div className={`border rounded-lg p-6 ${colorClasses[color]} ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{label}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {trend && (
            <p className="text-xs mt-2 opacity-75">{trend}</p>
          )}
        </div>
        {Icon && (
          <div className="p-3 rounded-lg bg-white bg-opacity-50">
            <Icon size={24} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
