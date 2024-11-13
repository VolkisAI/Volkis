"use client";

// ColorSliders component provides HSL (Hue, Saturation, Lightness) adjustment controls
// Props:
// - hue, saturation, lightness: current HSL values
// - onHueChange, onSaturationChange, onLightnessChange: functions to handle value changes
const ColorSliders = ({
  hue,
  saturation,
  lightness,
  onHueChange,
  onSaturationChange,
  onLightnessChange
}) => {
  return (
    <div className="mt-8 space-y-4 max-w-sm mx-auto">
      <div>
        <label className="flex items-center gap-2">
          <span className="w-4">H</span>
          <input
            type="range"
            min="0"
            max="360"
            value={hue}
            onChange={(e) => onHueChange(e.target.value)}
            className="range range-primary"
            style={{
              background: `linear-gradient(to right, 
                hsl(0, 100%, 50%), 
                hsl(60, 100%, 50%), 
                hsl(120, 100%, 50%), 
                hsl(180, 100%, 50%), 
                hsl(240, 100%, 50%), 
                hsl(300, 100%, 50%), 
                hsl(360, 100%, 50%))`
            }}
          />
          <span className="w-12 text-right">{hue}</span>
        </label>
      </div>
      <div>
        <label className="flex items-center gap-2">
          <span className="w-4">S</span>
          <input
            type="range"
            min="0"
            max="100"
            value={saturation}
            onChange={(e) => onSaturationChange(e.target.value)}
            className="range range-primary"
            style={{
              background: `linear-gradient(to right, 
                hsl(${hue}, 0%, 50%), 
                hsl(${hue}, 100%, 50%))`
            }}
          />
          <span className="w-12 text-right">{saturation}</span>
        </label>
      </div>
      <div>
        <label className="flex items-center gap-2">
          <span className="w-4">L</span>
          <input
            type="range"
            min="0"
            max="100"
            value={lightness}
            onChange={(e) => onLightnessChange(e.target.value)}
            className="range range-primary"
            style={{
              background: `linear-gradient(to right, 
                hsl(${hue}, ${saturation}%, 0%), 
                hsl(${hue}, ${saturation}%, 50%), 
                hsl(${hue}, ${saturation}%, 100%))`
            }}
          />
          <span className="w-12 text-right">{lightness}</span>
        </label>
      </div>
    </div>
  );
};

export default ColorSliders; 