"use client";

import { useEffect } from 'react';
import { X } from 'lucide-react';

const ColorPopup = ({ color, onClose }) => {
  // Handle Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!color) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="bg-base-100 p-6 rounded-lg shadow-xl relative animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="btn btn-sm btn-circle absolute right-2 top-2"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-32 h-32 rounded-full shadow-lg"
            style={{ backgroundColor: color }}
          />
          <div className="flex flex-col items-center gap-2">
            <p className="text-xl font-mono">{color}</p>
            <button 
              className="btn btn-sm btn-primary"
              onClick={() => navigator.clipboard.writeText(color)}
            >
              Copy Hex Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPopup; 