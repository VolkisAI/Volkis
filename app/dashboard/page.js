"use client";

import { useState } from 'react';
import ColorWheel from '@/components/ColorWheel';
import AnalyzeButton from '@/components/AnalyzeButton';
import ButtonAccount from "@/components/ButtonAccount";
import DashboardNav from "@/components/DashboardNav";

export default function Dashboard() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);

  const handleImageUpload = (imagePath) => {
    setSelectedImage(imagePath);
    setAnalysisResults(null); // Reset analysis when new image uploaded
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          imagePath: selectedImage 
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setAnalysisResults(data.results);
      } else {
        throw new Error(data.error || 'Analysis failed');
      }
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen bg-base-200">
      {/* Top Bar */}
      <div className="navbar bg-base-100 sticky top-0 z-50">
        <div className="flex-1">
          <h1 className="text-2xl font-bold px-4">Color Analysis</h1>
        </div>
        <div className="flex-none gap-2">
          <ButtonAccount />
        </div>
      </div>

      <div className="container mx-auto p-6 max-w-7xl min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-8 max-w-xl w-full">
          <h2 className="text-3xl font-light text-center">
            {selectedImage 
              ? "Ready to analyze your colors!"
              : "Upload a photo to begin"}
          </h2>

          <ColorWheel 
            selectedImage={selectedImage}
            onImageUpload={handleImageUpload}
            skinColors={analysisResults?.skinColors || []}
            seasonalPalettes={analysisResults?.seasonalPalettes || {}}
          />
          
          {selectedImage && (
            <AnalyzeButton 
              isDisabled={!selectedImage}
              isLoading={isAnalyzing}
              onClick={handleAnalyze}
            />
          )}

          {!selectedImage && (
            <div className="text-center text-base-content/60 mt-8">
              <h3 className="text-xl mb-2">How it works:</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>Upload a clear photo of your face</li>
                <li>Click "Analyze Colors" to begin</li>
                <li>Get your personalized color palette</li>
                <li>See which colors suit you best</li>
              </ol>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <DashboardNav />
    </main>
  );
}
