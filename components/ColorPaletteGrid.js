"use client";

// ColorPaletteGrid displays the analyzed skin colors and seasonal recommendations in a circular layout
// Props:
// - skinColors: array of detected skin tone colors
// - seasonalPalettes: object containing color recommendations for each season
const ColorPaletteGrid = ({ skinColors = [], seasonalPalettes = {} }) => {
  // Calculate positions for seasonal colors in a circle
  const getColorPosition = (index, total, radius = 180) => {
    const angle = (index * 360) / total - 90; // Start from top (-90 degrees)
    const radian = (angle * Math.PI) / 180;
    const x = Math.cos(radian) * radius;
    const y = Math.sin(radian) * radius;
    return { transform: `translate(${x}px, ${y}px)` };
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-8 items-start">
      {/* Skin Tone Analysis - Displayed on the side */}
      <div className="w-full md:w-64 shrink-0">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title text-xl mb-4">Your Skin Tone Palette</h3>
            {skinColors.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {skinColors.map((color, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-lg shadow-inner shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm font-mono opacity-70">
                      {color}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-base-content/60">
                Upload a photo to analyze your skin tone
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Seasonal Color Wheel */}
      <div className="relative w-[400px] h-[400px] mx-auto">
        {/* Seasonal sections */}
        {Object.entries(seasonalPalettes).map(([season, colors], seasonIndex) => (
          <div key={season} className="absolute inset-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 mb-2">
              <h3 className={`text-lg font-semibold ${seasonIndex === 0 ? "text-primary" : "text-base-content/70"}`}>
                {season}
              </h3>
            </div>
            {colors?.map((color, colorIndex) => {
              const totalColors = colors.length;
              const segmentAngle = 90 / totalColors; // 90 degrees per season
              const baseAngle = seasonIndex * 90; // Each season gets a quarter of the circle
              const currentAngle = baseAngle + (colorIndex * segmentAngle);
              const radius = 160; // Slightly smaller than container

              const radian = (currentAngle * Math.PI) / 180;
              const x = Math.cos(radian) * radius + 200; // Center point offset
              const y = Math.sin(radian) * radius + 200;

              return (
                <div
                  key={`${season}-${colorIndex}`}
                  className="absolute w-8 h-8 -ml-4 -mt-4 group"
                  style={{
                    left: `${x}px`,
                    top: `${y}px`,
                  }}
                >
                  <div
                    className="w-full h-full rounded-full shadow-md transform hover:scale-150 transition-transform duration-200"
                    style={{ backgroundColor: color }}
                  />
                  <div className="opacity-0 group-hover:opacity-100 absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-mono bg-base-300 px-2 py-1 rounded-md transition-opacity whitespace-nowrap">
                    {color}
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* Center circle - could be used for additional info or left empty */}
        <div className="absolute inset-[60px] rounded-full border-4 border-base-200 bg-base-100/50">
          <div className="absolute inset-0 flex items-center justify-center text-center p-4">
            <p className="text-sm text-base-content/70">
              Your Seasonal Color Wheel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPaletteGrid; 