import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loading = ({ message = 'Carregando...', size = 'medium' }) => {
  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <Loader2 className={`${sizes[size]} animate-spin text-blue-600`} />
      {message && <p className="text-gray-600 text-sm">{message}</p>}
    </div>
  );
};

export const LoadingOverlay = ({ message = 'Processando...' }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        <p className="text-gray-700 font-medium">{message}</p>
      </div>
    </div>
  );
};

export const InlineLoading = ({ message }) => {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <Loader2 className="w-4 h-4 animate-spin" />
      {message && <span>{message}</span>}
    </div>
  );
};
