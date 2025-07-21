import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, className = '' }) => {
  return (
    <div className={`flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg border border-red-200 ${className}`}>
      <AlertCircle size={20} />
      <span>{message}</span>
    </div>
  );
};

export default ErrorMessage;