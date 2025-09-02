"use client";

import { motion } from "motion/react";
import React from "react";

// Normal HTML button with fixed height/width
const BaseButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className = "", ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={`h-8 px-3 rounded-md text-sm border text-foreground bg-background
                  hover:bg-accent hover:text-accent-foreground 
                  dark:bg-input/30 dark:text-muted-foreground 
                  dark:hover:text-accent-foreground dark:hover:bg-input/50
                  transition-colors duration-200 whitespace-nowrap
                  cursor-pointer
                  ${className}`}
      {...props}
    />
  );
});
BaseButton.displayName = "BaseButton";

export const MotionButton = motion(BaseButton);
