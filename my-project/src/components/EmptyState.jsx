import React from 'react';

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  actionLabel = 'Get Started'
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {Icon && (
        <div className="mb-5 rounded-full border border-[#cfe9d5] bg-[#eefcf2] p-4 shadow-sm">
          <Icon size={42} className="text-[#177e4f]" />
        </div>
      )}

      <h2 className="text-2xl font-light tracking-tight text-[#14341e]">{title}</h2>

      {description && (
        <p className="mt-3 max-w-md text-sm leading-relaxed text-[#14341e]/70">{description}</p>
      )}

      {action && (
        <button
          onClick={action}
          className="mt-6 rounded-full bg-[#177e4f] px-6 py-2.5 text-sm text-white transition hover:bg-[#14341e]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
