import React from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

export default function Notification({ type = 'info', message, onClose }) {
  // Ensure message is always a string
  const safeMessage = typeof message === 'string' ? message : 
                     typeof message === 'object' && message !== null ? 
                     (message.message || JSON.stringify(message)) : 
                     String(message || '');
  
  if (!safeMessage) return null;

  const config = {
    error: {
      icon: AlertCircle,
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      iconColor: 'text-red-600'
    },
    success: {
      icon: CheckCircle,
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      iconColor: 'text-green-600'
    },
    warning: {
      icon: AlertTriangle,
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      iconColor: 'text-yellow-600'
    },
    info: {
      icon: Info,
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      iconColor: 'text-blue-600'
    }
  };

  const currentConfig = config[type];
  const IconComponent = currentConfig.icon;

  return (
    <div className={`${currentConfig.bg} ${currentConfig.border} border rounded-xl p-4 mb-6 flex items-start space-x-3 animate-in slide-in-from-top-2 duration-300`}>
      <IconComponent className={`w-5 h-5 ${currentConfig.iconColor} mt-0.5 flex-shrink-0`} />
      <div className={`flex-1 ${currentConfig.text} text-sm font-medium`}>
        {safeMessage}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`${currentConfig.text} hover:${currentConfig.iconColor} transition-colors p-1 rounded-lg hover:bg-white/50`}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
} 