"use client";

import { Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { Suspense } from "react";
import TShirt from "./TShirt";
import { Skeleton } from "../ui/skeleton";

// Define the Scene component props interface
interface SceneProps {
  color?: string;
  className?: string;
  enableZoom?: boolean;
  autoRotate?: boolean;
}

// Enhanced loading component with progress indication
// Shadcn Skeleton loader
export function SceneLoader() {
  return (
    null
  );
}


export default function Scene({
  color = "#000000",
  className,
}: SceneProps) {
  const { theme } = useTheme();

  // Theme-aware lighting setup
  const ambientIntensity = theme === "dark" ? 0.4 : 0.6;
  const directionalIntensity = theme === "dark" ? 0.8 : 1.0;

  return (
    <div className={className}>
      <Suspense fallback={<SceneLoader />}>
        <Canvas
          camera={{
            position: [280, 470, 690],
            fov: 45
          }}
          style={{ touchAction: "none" }}
          className="w-full h-full"
          dpr={[1, 2]} 
          onCreated={(state) => {
            console.log("Canvas created:", state);
          }}
        >
          {/* Lighting setup */}
          <ambientLight intensity={ambientIntensity} />
          <directionalLight
            position={[2, 2, 2]}
            intensity={directionalIntensity}
            castShadow
          />

          {/* Environment for better reflections */}
          <Environment preset="studio" />

          <TShirt
            color={color}
            rotationSpeed={0.008}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
