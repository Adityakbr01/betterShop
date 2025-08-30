"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Scene from "./Scene";
import TShirtControls from "./TShirtControls";

interface TShirtViewerProps {
  initialColor?: string;
  showControls?: boolean;
  className?: string;
  controlsPosition?: "bottom" | "side" | "top";
}

export default function TShirtViewer({
  initialColor = "#ffffff",
  showControls = true,
  className,
  controlsPosition = "bottom"
}: TShirtViewerProps) {
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [autoRotate, setAutoRotate] = useState(false);
  const [enableZoom, setEnableZoom] = useState(true);

  const sceneComponent = (
    <Scene
      color={selectedColor}
      enableZoom={enableZoom}
      autoRotate={autoRotate}
      className="w-full h-full min-h-[400px] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg overflow-hidden"
    />
  );

  const controlsComponent = showControls ? (
    <TShirtControls
      selectedColor={selectedColor}
      onColorChange={setSelectedColor}
    />
  ) : null;

  if (controlsPosition === "side") {
    return (
      <div className={cn("flex gap-4", className)}>
        <div className="flex-1">
          {sceneComponent}
        </div>
        {controlsComponent && (
          <div className="w-64 flex-shrink-0">
            {controlsComponent}
          </div>
        )}
      </div>
    );
  }

  if (controlsPosition === "top") {
    return (
      <div className={cn("space-y-4", className)}>
        {controlsComponent}
        {sceneComponent}
      </div>
    );
  }

  // Default: bottom position
  return (
    <div className={cn("space-y-4", className)}>
      {sceneComponent}
      {controlsComponent}
    </div>
  );
}
