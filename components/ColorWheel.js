"use client";

import { Camera, Download, Upload } from 'lucide-react';
import { useState } from 'react';
import ColorPopup from './ColorPopup';

/**
 * ColorWheel Component
 * ===================
 * 
 * A circular interface component that displays color palettes in a seasonal arrangement.
 * The component features a central upload area surrounded by color dots arranged in four
 * seasonal quadrants (Winter, Spring, Summer, Autumn).
 * 
 * Visual Layout:
 * -------------
 *                    Winter
 *                     ↑
 *            Autumn ←  ⚪  → Spring
 *                     ↓
 *                   Summer
 * 
 * Structure:
 * - Outer ring: Season labels and arcs
 * - Middle ring: Color palette dots
 * - Center: Image upload area (250x250px)
 * - Right side: Skin tone palette (if provided)
 * 
 * @param {Array} skinColors - Array of hex color codes representing skin tones
 * @param {Object} seasonalPalettes - Object containing color arrays for each season
 * @param {string} selectedImage - URL of the currently selected image
 * @param {Function} onImageUpload - Callback function when image is uploaded
 */

const ColorWheel = ({ 
  skinColors = [], 
  seasonalPalettes = {}, 
  selectedImage, 
  onImageUpload 
}) => {
  // State for drag-and-drop functionality
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);

  /**
   * Handles dragover event for file upload
   * Prevents default behavior and updates UI state
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  /**
   * Handles drag leave event
   * Resets the dragging state when file is dragged out
   */
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  /**
   * Handles file drop event
   * Processes the dropped file and initiates upload
   */
  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      await uploadImage(file);
    }
  };

  /**
   * Handles file selection from input
   * Processes the selected file and initiates upload
   */
  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await uploadImage(file);
    }
  };

  /**
   * Uploads image to the server
   * @param {File} file - The image file to upload
   * 
   * Error handling:
   * - Validates file upload response
   * - Shows error alert on failure
   * - Manages loading state
   */
  const uploadImage = async (file) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        onImageUpload(data.filename);
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Calculates position for color dots around the wheel
   * @param {number} seasonIndex - Index of the season (0-3)
   * @param {number} colorIndex - Index of the color within the season
   * @param {number} totalColors - Total colors in the season
   * @returns {Object} CSS transform property for positioning
   */
  const getColorPosition = (seasonIndex, colorIndex, totalColors) => {
    const seasonStartAngle = seasonIndex * 90;
    const angleStep = 90 / (totalColors + 1);
    const angle = seasonStartAngle + (colorIndex + 1) * angleStep;
    const radian = (angle - 90) * (Math.PI / 180);
    const radius = 140;
    const x = Math.cos(radian) * radius;
    const y = Math.sin(radian) * radius;
    
    return { transform: `translate(${x}px, ${y}px)` };
  };

  /**
   * Calculates SVG path for seasonal arcs
   * @param {number} seasonIndex - Index of the season (0-3)
   * @returns {Object} Path data and label position for the season arc
   */
  const getSeasonArc = (seasonIndex) => {
    const startAngle = seasonIndex * 90 - 90; // -90 to start from top
    const endAngle = startAngle + 90;
    const radius = 160;
    const startRadian = (startAngle * Math.PI) / 180;
    const endRadian = (endAngle * Math.PI) / 180;
    
    const startX = Math.cos(startRadian) * radius;
    const startY = Math.sin(startRadian) * radius;
    const endX = Math.cos(endRadian) * radius;
    const endY = Math.sin(endRadian) * radius;

    return {
      path: `M 0 0 L ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY} Z`,
      labelPosition: {
        x: Math.cos((startAngle + 45) * Math.PI / 180) * (radius - 20),
        y: Math.sin((startAngle + 45) * Math.PI / 180) * (radius - 20)
      }
    };
  };

  return (
    <div className="relative w-[400px] h-[400px]">
      {/* Season sections with arcs */}
      <div className="absolute inset-0">
        <svg className="w-full h-full" viewBox="-200 -200 400 400">
          <g transform="translate(200,200)">
            {['Winter', 'Spring', 'Summer', 'Autumn'].map((season, index) => {
              const { path, labelPosition } = getSeasonArc(index);
              return (
                <g key={season} className="opacity-5 hover:opacity-20 transition-opacity">
                  <path
                    d={path}
                    fill={
                      season === 'Winter' ? '#a8d1ff' :
                      season === 'Spring' ? '#ffefa8' :
                      season === 'Summer' ? '#ffa8a8' :
                      '#ffd1a8'
                    }
                    className="cursor-pointer"
                  />
                  {/* Arrow indicating direction */}
                  <path
                    d="M 0 0 L 20 -5 L 20 5 Z"
                    fill="currentColor"
                    className="text-base-content/50"
                    transform={`translate(${labelPosition.x},${labelPosition.y}) rotate(${index * 90 + 45})`}
                  />
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Season labels */}
      <div className="absolute inset-0">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 font-semibold">Winter</div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 font-semibold">Spring</div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-semibold">Summer</div>
        <div className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold">Autumn</div>
      </div>

      {/* Color dots around the circle */}
      <div className="absolute inset-0">
        {Object.entries(seasonalPalettes).map(([season, colors], seasonIndex) => (
          colors.map((color, colorIndex) => (
            <div
              key={`${season}-${colorIndex}`}
              className="absolute left-1/2 top-1/2 w-5 h-5 -ml-2.5 -mt-2.5 group cursor-pointer"
              style={getColorPosition(seasonIndex, colorIndex, colors.length)}
              onClick={() => setSelectedColor(color)}
            >
              <div
                className="w-full h-full rounded-full shadow-md transform hover:scale-150 transition-transform duration-200"
                style={{ backgroundColor: color }}
              />
              <div className="opacity-0 group-hover:opacity-100 absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-mono bg-base-300 px-2 py-1 rounded-md transition-opacity whitespace-nowrap z-10">
                {color}
              </div>
            </div>
          ))
        ))}
      </div>

      {/* Center image upload area */}
      <div 
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] rounded-full overflow-hidden border-4 transition-all duration-200 ${
          isDragging ? 'border-primary bg-primary/10' : 'border-base-200 bg-base-200'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {selectedImage ? (
          <img
            src={selectedImage}
            alt="Uploaded"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <Upload className="w-12 h-12 mb-4 text-base-content/50" />
            <p className="text-base-content/50 text-center text-sm mb-2">
              Drag and drop your photo here
            </p>
            <p className="text-base-content/30 text-xs text-center mb-4">
              or
            </p>
            <label className="btn btn-primary btn-sm">
              Choose File
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={isUploading}
              />
            </label>
            {isUploading && (
              <div className="mt-4">
                <span className="loading loading-spinner loading-md"></span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="absolute top-0 right-0 flex gap-2">
        <label className="btn btn-circle btn-sm">
          <Camera className="w-4 h-4" />
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isUploading}
          />
        </label>
        <button className="btn btn-circle btn-sm">
          <Download className="w-4 h-4" />
        </button>
      </div>

      {/* Skin tone colors display */}
      {skinColors.length > 0 && (
        <div className="absolute -right-64 top-1/2 -translate-y-1/2 w-48">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body p-4">
              <h3 className="card-title text-sm mb-3">Your Skin Tone Palette</h3>
              <div className="grid grid-cols-1 gap-2">
                {skinColors.map((color, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-lg shadow-inner shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-xs font-mono opacity-70">
                      {color}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedColor && (
        <ColorPopup
          color={selectedColor}
          onClose={() => setSelectedColor(null)}
        />
      )}
    </div>
  );
};

export default ColorWheel; 