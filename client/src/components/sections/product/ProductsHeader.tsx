"use client";

import { motion } from "motion/react";

interface ProductsHeaderProps {
  isMobile: boolean;
  springConfig: {
    type: "spring";
    stiffness: number;
    damping: number;
    mass: number;
  };
}

export default function ProductsHeader({ isMobile, springConfig }: ProductsHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: isMobile ? 20 : 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springConfig}
      className="mb-6 sm:mb-8"
    >
      <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl uppercase font-NeuMechina font-bold tracking-tight">
        Products
      </h1>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ ...springConfig, delay: 0.2 }}
        className="h-0.5 bg-gradient-to-r from-gray-900 to-gray-600 mt-2 max-w-xs"
      />
    </motion.div>
  );
}
