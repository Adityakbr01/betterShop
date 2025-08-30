"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TShirtControlsProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  className?: string;
}

// Exact 6 predefined colors as specified
const COLOR_PALETTE = [
  { name: "White", value: "#ffffffff", className: "bg-white border-2 border-gray-300" },
  { name: "Black", value: "#000000", className: "bg-black" },
  { name: "Light Gray", value: "#d1d5db", className: "bg-gray-300" },
  { name: "Gray", value: "#6b7280", className: "bg-gray-500" },
  { name: "Dark Gray", value: "#374151", className: "bg-gray-700" },
  { name: "Navy", value: "#1e293b", className: "bg-slate-800" },
];

export default function TShirtControls({
  selectedColor,
  onColorChange,
  className
}: TShirtControlsProps) {
  return (
    <div className={cn("p-4 rounded-lg border border-gray-200", className)}>
      {/* Color Selection */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-900">T-Shirt Color</h3>
        <div className="grid grid-cols-6 gap-2 sm:gap-3">
          {COLOR_PALETTE.map((color) => (
            <button
              key={color.value}
              onClick={() => onColorChange(color.value)}
              className={cn(
                "w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all duration-200 hover:scale-110 touch-manipulation",
                color.className,
                selectedColor === color.value
                  ? "ring-2 ring-gray-900 ring-offset-2 scale-110"
                  : "hover:ring-1 hover:ring-gray-400"
              )}
              aria-label={`Select ${color.name} color`}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* View Controls
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3">View Controls</h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant={autoRotate ? "default" : "outline"}
            size="sm"
            onClick={onAutoRotateToggle}
            className="flex-1 text-xs sm:text-sm font-medium min-h-[44px] touch-manipulation"
          >
            {autoRotate ? "Stop Rotation" : "Auto Rotate"}
          </Button>

          <Button
            variant={enableZoom ? "default" : "outline"}
            size="sm"
            onClick={onZoomToggle}
            className="flex-1 text-xs sm:text-sm font-medium min-h-[44px] touch-manipulation"
          >
            {enableZoom ? "Disable Zoom" : "Enable Zoom"}
          </Button>
        </div>
      </div> */}
    </div>
  );
}

