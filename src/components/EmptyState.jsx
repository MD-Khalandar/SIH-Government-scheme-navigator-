import React from 'react';

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  actionLabel = 'Get Started'
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {Icon && (
        <div className="bg-gray-100 p-4 rounded-full mb-4">
          <Icon size={48} className="text-gray-400" />
        </div>
      )}
      <h2 className="text-2xl font-bold text-gray-900 text-center">{title}</h2>
      {description && (
        <p className="text-gray-600 text-center mt-2 max-w-sm">{description}</p>
      )}
      {action && (
        <button
          onClick={action}
          className="mt-6 px-6 py-2.5 bg-brand-blue text-white rounded-lg hover:bg-brand-navy transition-colors font-medium"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
