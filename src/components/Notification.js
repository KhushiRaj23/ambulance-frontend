import React from 'react';

export default function Notification({ type = 'info', message, onClose }) {
  if (!message) return null;
  const color =
    type === 'error'
      ? 'bg-red-100 text-red-700 border-red-400'
      : type === 'success'
      ? 'bg-green-100 text-green-700 border-green-400'
      : 'bg-blue-100 text-blue-700 border-blue-400';

  return (
    <div className={`border-l-4 p-4 mb-4 rounded ${color} flex justify-between items-center`}>
      <span>{message}</span>
      {onClose && (
        <button className="ml-4 text-lg font-bold" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
} 