"use client";

import { Palette } from 'lucide-react';

// AnalyzeButton component provides a prominent call-to-action for color analysis
// Props:
// - isDisabled: boolean to control button state
// - onClick: function to handle analysis
// - isLoading: boolean to show loading state
const AnalyzeButton = ({ isDisabled, onClick, isLoading }) => {
  return (
    <button 
      onClick={onClick}
      disabled={isDisabled || isLoading}
      className="btn btn-primary btn-lg gap-2 w-full max-w-md shadow-lg hover:shadow-xl transition-all duration-200"
    >
      {isLoading ? (
        <>
          <span className="loading loading-spinner"></span>
          Analyzing...
        </>
      ) : (
        <>
          <Palette className="w-5 h-5" />
          Analyze Colors
        </>
      )}
    </button>
  );
};

export default AnalyzeButton; 