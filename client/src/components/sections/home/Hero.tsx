"use client";

import ThreeDErrorBoundary from "@/components/3d/ErrorBoundary";
import TShirtControls from "@/components/3d/TShirtControls";
import PremiumBadge from "@/components/PremiumBadge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Play, Sparkles } from "lucide-react";
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "motion/react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";


const DEFAULT_COLOR = "#a9ff29ff";
const STORAGE_KEY = "tshirt-selected-color";

// Dynamic 3D scene with mobile-optimized loading
const Scene = dynamic(() => import("../../3d/Scene"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
            <div className="text-center space-y-3">
                <div className="relative">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 border-3 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-600 rounded-full opacity-20 animate-pulse"></div>
                    </div>
                </div>
                <p className="text-sm sm:text-base text-gray-600 font-medium">Loading 3D Experience...</p>
                <div className="w-24 sm:w-32 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden">
                    <div className="h-full bg-gray-600 rounded-full animate-pulse"></div>
                </div>
            </div>
        </div>
    )
});

// Register GSAP
if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
    className?: string;
}

export default function Hero({ className }: HeroProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [currentColor, setCurrentColor] = useState(DEFAULT_COLOR);
    const [showControls, setShowControls] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const heroRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);

    // Mobile detection and performance optimization
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Detect low-end devices
    const isLowEnd =
        typeof navigator !== "undefined" &&
        /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);


    // Load saved color from localStorage
    useEffect(() => {
        try {
            const savedColor = localStorage.getItem(STORAGE_KEY);
            if (savedColor) setCurrentColor(savedColor);
        } catch { }
    }, []);

    // Optimized color setter with memoization for better performance
    const updateColor = useCallback((color: string) => {
        setCurrentColor(color);
        try {
            localStorage.setItem(STORAGE_KEY, color);
        } catch (error) {
            console.warn("Failed to save color to localStorage:", error);
        }
    }, []);

    // Mobile-optimized animation config
    const animationConfig = useMemo(() => ({
        type: "spring" as const,
        stiffness: isMobile ? 150 : 100,
        damping: isMobile ? 25 : 20,
        mass: isMobile ? 0.8 : 1,
        velocity: 0
    }), [isMobile]);

    // Smooth spring-based transforms for better mobile performance
    const smoothY = useSpring(0, animationConfig);
    const smoothOpacity = useSpring(1, animationConfig);

    // Mobile-optimized scroll-based motion with reduced intensity on mobile
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });

    // Reduced parallax effect on mobile for better performance
    const y = useTransform(
        scrollYProgress,
        [0, 1],
        isMobile ? ["0%", "40%"] : ["0%", "50%"]
    );

    const opacity = useTransform(
        scrollYProgress,
        [0, 0.5],
        [1, isMobile ? 0.5 : 0]
    );

    // GSAP timeline for hero text animations
    useEffect(() => {
        if (!isLoaded || isLowEnd) return;
        const tl = gsap.timeline({ delay: 0.5 });
        tl.from(titleRef.current, { y: 50, opacity: 0, duration: 1, ease: "power3.out" });
        tl.from(subtitleRef.current, { y: 30, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.5");
        return () => {
            tl.kill();
        };
    }, [isLoaded]);

    return (
        <section
            ref={heroRef}
            className={cn(
                "relative min-h-screen flex flex-col items-center justify-center overflow-hidden ",
            )}
        >
            {/* Ultra-smooth animated container with mobile-first optimization */}
            <motion.div
                style={{ y, opacity }}
                className="relative z-10 w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 font-NeuMechina my-20 sm:my-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                    duration: isMobile ? 0.6 : 0.8,
                    ease: "easeOut",
                    type: "spring",
                    stiffness: isMobile ? 120 : 100,
                    damping: isMobile ? 20 : 15
                }}
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center min-h-screen py-4 sm:py-16 lg:py-20">
                    {/* Left Column - Mobile-First Content */}
                    <motion.div
                        className="space-y-6 sm:space-y-8 text-center lg:text-left order-2 lg:order-1"
                        initial={{ opacity: 0, x: isMobile ? 0 : -500, y: isMobile ? 20 : 0 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{
                            duration: isMobile ? 0.6 : 0.8,
                            delay: isMobile ? 0.2 : 0.3,
                            ease: "easeOut",
                            type: "spring",
                            stiffness: isMobile ? 100 : 80
                        }}
                    >
                        {/* Premium Badge - Mobile Optimized */}
                        <PremiumBadge isMobile={isMobile}/>

                        {/* Hero Title - Mobile-First Typography */}
                        <motion.h1
                            ref={titleRef}
                            className="text-2xl sm:text-4xl md:text-4xl lg:text-6xl  font-bold leading-tight tracking-tight"
                            initial={{ y: isMobile ? 15 : 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{
                                duration: isMobile ? 0.6 : 0.8,
                                delay: isMobile ? 0.4 : 0.7,
                                type: "spring",
                                stiffness: isMobile ? 100 : 80
                            }}
                        >
                            <span className="block">Shop Your</span>
                            <span className="block bg-gradient-to-r ">
                                Favorite T-Shirts
                            </span>
                        </motion.h1>


                        {/* Subtitle - Mobile Optimized */}
                        <motion.p
                            ref={subtitleRef}
                            className="text-sm sm:text-base md:text-lg lg:text-xl max-w-sm sm:max-w-lg lg:max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                            initial={{ y: isMobile ? 10 : 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{
                                duration: isMobile ? 0.5 : 0.8,
                                delay: isMobile ? 0.5 : 0.9,
                                type: "spring",
                                stiffness: 90
                            }}
                        >
                            Discover your favorite t-shirts with premium quality and a perfect fit.
                            <span className="hidden sm:inline"> Browse multiple colors, check real-time previews, and pick your style with ease.</span>
                            <span className="sm:hidden block mt-1">Pick colors and see previews before buying.</span>
                        </motion.p>


                        <motion.div
                            ref={ctaRef}
                            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 1.1 }}
                        >
                            {/* Primary CTA - Shop Now */}
                            <Button
                                size={isMobile ? "default" : "lg"}
                                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium bg-gray-900 hover:bg-gray-800 text-white transition-all duration-300 transform hover:scale-105 active:scale-95 touch-manipulation"
                            >
                                <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                Shop Now
                            </Button>

                            {/* Secondary CTA - Customize */}
                            <Button
                                variant="outline"
                                size={isMobile ? "default" : "lg"}
                                onClick={() => setShowControls(!showControls)}
                                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium border-2 border-gray-300 hover:border-gray-400 transition-all duration-300 transform hover:scale-105 active:scale-95 touch-manipulation"
                            >
                                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                <span className="hidden sm:inline">{showControls ? "Hide Options" : "Customize T-Shirt"}</span>
                                <span className="sm:hidden">{showControls ? "Hide" : "Customize"}</span>
                            </Button>
                        </motion.div>

                    </motion.div>

                    {/* Right Column - 3D Experience Mobile-First */}
                    <motion.div
                        className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] order-1 lg:order-2"
                        initial={{
                            //   scale: isMobile ? 0.95 : 0.9,
                            opacity: 0,
                            y: isMobile ? 20 : 0
                        }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{
                            duration: isMobile ? 0.8 : 1,
                            delay: isMobile ? 0.1 : 1.2,
                            ease: "easeOut",
                            type: "spring",
                            stiffness: isMobile ? 80 : 60
                        }}
                    >
                        <ThreeDErrorBoundary>
                            <Scene color={currentColor} autoRotate={!isLowEnd} enableZoom={!isLowEnd} className="w-full h-full" />
                        </ThreeDErrorBoundary>

                        {/* Mobile-Optimized Controls Overlay */}
                        <AnimatePresence>
                            {showControls && (
                                <motion.div
                                    initial={{ opacity: 0, y: isMobile ? 30 : 20, scale: isMobile ? 0.95 : 1 }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        scale: 1,
                                        pointerEvents: "auto"
                                    }}
                                    exit={{
                                        opacity: 0,
                                        y: isMobile ? 30 : 20,
                                        scale: isMobile ? 0.95 : 1,
                                        pointerEvents: "none"
                                    }}
                                    transition={{
                                        duration: isMobile ? 0.3 : 0.4,
                                        ease: "easeOut",
                                        type: "spring",
                                        stiffness: 120
                                    }}
                                    className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 z-10"
                                >
                                    <TShirtControls
                                        selectedColor={currentColor}
                                        onColorChange={updateColor}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Mobile-Optimized Floating Toggle Button */}
                        <motion.button
                            onClick={() => setShowControls(!showControls)}
                            className="absolute top-2 sm:top-4 right-2 sm:right-4 p-2 sm:p-3 bg-white/95 backdrop-blur-md rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-20 touch-manipulation"
                            whileHover={{ scale: isMobile ? 1.05 : 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label={showControls ? "Hide T-shirt controls" : "Show T-shirt controls"}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: isMobile ? 0.8 : 1.5, type: "spring", stiffness: 150 }}
                        >
                            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                        </motion.button>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}
