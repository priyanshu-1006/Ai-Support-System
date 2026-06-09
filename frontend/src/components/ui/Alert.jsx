import { useEffect, useState } from 'react';

export function Alert({ type = 'info', message, title, onClose, duration = 5000 }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) return null;

  const typeStyles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  return (
    <div
      className={`border rounded-lg p-4 ${typeStyles[type]} flex justify-between items-start`}
      role="alert"
    >
      <div>
        {title && <p className="font-semibold">{title}</p>}
        <p className="text-sm">{message}</p>
      </div>
      <button
        onClick={() => {
          setIsVisible(false);
          onClose?.();
        }}
        className="text-lg font-bold opacity-70 hover:opacity-100"
      >
        ×
      </button>
    </div>
  );
}
