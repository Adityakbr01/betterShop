// "use client";

// import { useEffect, useRef } from "react";
// import Lenis from "lenis";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// interface SmoothScrollProviderProps {
//   children: React.ReactNode;
// }

// export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
//   const lenisRef = useRef<Lenis | null>(null);

//   useEffect(() => {
//     // Initialize Lenis
//     const lenis = new Lenis({
//       duration: 1.2,
//       easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
//       direction: "vertical",
//       gestureDirection: "vertical",
//       smooth: true,
//       mouseMultiplier: 1,
//       smoothTouch: false,
//       touchMultiplier: 2,
//       infinite: false,
//     });

//     lenisRef.current = lenis;

//     // Register GSAP ScrollTrigger with Lenis
//     if (typeof window !== "undefined") {
//       gsap.registerPlugin(ScrollTrigger);
      
//       lenis.on("scroll", ScrollTrigger.update);
      
//       gsap.ticker.add((time) => {
//         lenis.raf(time * 1000);
//       });
      
//       gsap.ticker.lagSmoothing(0);
//     }

//     // Animation frame loop
//     function raf(time: number) {
//       lenis.raf(time);
//       requestAnimationFrame(raf);
//     }
//     requestAnimationFrame(raf);

//     return () => {
//       lenis.destroy();
//       gsap.ticker.remove((time) => {
//         lenis.raf(time * 1000);
//       });
//     };
//   }, []);

//   return <>{children}</>;
// }
