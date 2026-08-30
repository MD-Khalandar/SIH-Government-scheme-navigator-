import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export const Toast = ({
  message,
  type = 'info',
  duration = 3000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const icons = {
    success: <CheckCircle size={20} className="flex-shrink-0" />,
    error: <AlertCircle size={20} className="flex-shrink-0" />,
    info: <Info size={20} className="flex-shrink-0" />
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const iconColors = {
    success: 'text-green-600',
    error: 'text-red-600',
    info: 'text-blue-600'
  };

  return (
    <div className={`toast fixed bottom-4 right-4 max-w-sm border rounded-lg p-4 flex items-center gap-3 ${colors[type]}`}>
      <span className={iconColors[type]}>
        {icons[type]}
      </span>
      <span className="flex-1">{message}</span>
      <button
        onClick={() => setIsVisible(false)}
        className="p-1 hover:bg-white hover:bg-opacity-50 rounded transition"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
