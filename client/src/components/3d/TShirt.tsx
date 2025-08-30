"use client";

import { useGLTF, Bounds } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useMemo, useState, useCallback } from "react";
import { useTheme } from "next-themes";
import * as THREE from "three";

// Define the TShirt component props interface
interface TShirtProps {
  color?: string;
  rotationSpeed?: number;
  scale?: number;
}

// Define the GLTF result type for better type safety
interface TShirtGLTF {
  scene: THREE.Group;
  materials: { [key: string]: THREE.Material };
  nodes: { [key: string]: THREE.Object3D };
}

export default function TShirt({
  color = "#000000",
  rotationSpeed = 0.005,
  scale = 5
}: TShirtProps) {
  const { theme } = useTheme();
  const group = useRef<THREE.Group>(null);

  // Memoize the color to avoid unnecessary re-renders
  const tshirtColor = useMemo(() => {
    // Use theme-aware default colors if no color is provided
    if (color === "#000000") {
      return theme === "dark" ? "#f5f5f5" : "#000000";
    }
    return color;
  }, [color, theme]);

  // Load the T-shirt model with proper typing and error handling
  const gltf = useGLTF("/models/tshirt/scene.gltf") as TShirtGLTF;

  console.log("GLTF loaded:", gltf);

  if (!gltf || !gltf.scene) {
    console.error("Failed to load T-shirt model", gltf);
    return (
      <mesh>
        <boxGeometry args={[0, 0, 0]} />
        <meshStandardMaterial color={tshirtColor} />
      </mesh>
    );
  }

  const { scene, materials } = gltf;

  // Smooth rotation animation
  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += rotationSpeed * delta * 60; 
    }
  });

  // Apply dynamic color to fabric materials
  useMemo(() => {
    if (materials) {
      // Common fabric material names to try
      const fabricMaterialNames = [
        "FABRIC_1_FRONT_4193",
        "Fabric",
        "Material",
        "fabric",
        "tshirt",
        "cloth"
      ];

      fabricMaterialNames.forEach(materialName => {
        if (materials[materialName]) {
          const material = materials[materialName] as THREE.MeshStandardMaterial;
          if (material.color) {
            material.color.set(new THREE.Color(tshirtColor));
            material.needsUpdate = true;
          }
        }
      });
    }
  }, [materials, tshirtColor]);

  return (
    <Bounds fit={true} clip={true} observe={false}>
      <primitive
        ref={group}
        object={scene}
        scale={scale}
        dispose={null}
      />
    </Bounds>

  );
}

// Preload model for better performance
useGLTF.preload("/models/tshirt/scene.gltf");
