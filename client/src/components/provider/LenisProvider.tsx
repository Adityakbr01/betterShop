"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";

export default function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      // Core options
      duration: 1.2,           // Scroll transition time (seconds)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Default easing
      wheelMultiplier: 1,      // Mouse wheel sensitivity
      touchMultiplier: 1,      // Touch scroll multiplier
      syncTouch: false,        // Keep touch scroll smooth (default false)
      gestureOrientation: "vertical",
      orientation: "vertical",
      infinite: false,
      autoResize: true,
      anchors: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
