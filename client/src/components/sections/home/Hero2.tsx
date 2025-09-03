"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useRef } from "react";
import Link from "next/link";

// Animation variants for staggered text entrance
const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.2,
    },
  },
};

// Child element animation (h1, p, buttons)
const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Mouse icon animation
const mouseVariants = {
  animate: {
    y: [-5, 5],
    transition: {
      repeat: Infinity,
      repeatType: "reverse",
      duration: 1.5,
      ease: "easeInOut",
    },
  },
};



export default function Hero2() {
  const textRef = useRef(null);

  return (
    <section className="relative bg-white w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 font-NeuMechina my-12 sm:my-16">

      <div className="container mx-auto px-4 lg:flex lg:items-center lg:justify-between">
        {/* Text Column */}
        <motion.div
          ref={textRef}
          className="lg:w-1/2"
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={childVariants}
            className="text-3xl sm:text-4xl lg:text-5xl font-light leading-tight text-gray-900"
          >


            <span className="relative inline-block">
              {/* Animated background */}
              <motion.span
                className="absolute inset-0 bg-[#d5f38a] z-0"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                whileHover={{ scaleX: 1.1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{ transformOrigin: "left" }}
              />

              {/* Text on top */}
              <span className="relative z-10 py-0 px-2">New</span>
            </span>
            Spring Collection
            <span className="block relative mt-2 text-4xl sm:text-5xl lg:text-6xl font-semibold">
              Just
              <span className="relative inline-block">
                {/* Animated background */}
                <motion.span
                  className="absolute inset-0 bg-[#e6902fd7] z-0"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  style={{ transformOrigin: "right" }}
                />

                {/* Text on top */}
                <span className="relative z-10 text-white px-1">Arrived</span>
              </span>

            </span>
          </motion.h1>
          <motion.p
            variants={childVariants}
            className="mt-4 text-base sm:text-lg text-gray-700"
          >
            Explore our latest men's essentials and elevate your style with
            timeless designs.
          </motion.p>
          <motion.div
            variants={childVariants}
            className="mt-6 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0"
          >
            <Link href={"/"} className="px-6 py-3 bg-black text-white font-semibold rounded-md text-center">
              Shop Now
            </Link>
            <Link
              href="#"
              className="px-6 py-3 border border-gray-900 text-gray-900 font-semibold rounded-md text-center"
            >
              New Arrivals
            </Link>
          </motion.div>
          <motion.div
            variants={childVariants}
            className="mt-6 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 text-sm text-gray-600"
          >
           <div>
             Free shipping over <span className="bg-[#e38f34] mx-1  text-white px-1 w-fit font-GeistRegular">₹999</span></div> • 30-day returns • Secure checkout
          </motion.div>
        </motion.div>

        {/* Image Column */}
        <div className="lg:w-1/2 mt-8 lg:mt-0 md:flex justify-center hidden">
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative w-[400px] h-[500px] overflow-hidden shadow-2xl 
               rounded-tl-[120px] rounded-br-[120px] rounded-tr-2xl rounded-bl-2xl
               border-[6px] border-transparent bg-gradient-to-br from-gray-100 via-gray-50 to-white"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <Image
                src="https://images.unsplash.com/photo-1722489873772-28815bb7e4f3?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0"
                alt="Men's Fashion"
                fill
                className="object-cover"
                priority
              />
              {/* Fixed Floating Badge */}
              <motion.div
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="absolute top-4 right-4 bg-gradient-to-r from-black via-gray-900 to-black 
                 text-white text-[13px] font-semibold px-5 py-2 rounded-full 
                 shadow-md tracking-widest uppercase"
              >
                ✦ New Drop
              </motion.div>
            </motion.div>

            {/* Subtle overlay light effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/60 mix-blend-overlay pointer-events-none" />
          </motion.div>
        </div>
      </div>

      {/* Mouse Scroll Icon */}
      <motion.div
        className="hidden sm:flex absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex-col items-center"
        animate={{ y: [0, 8, 0] }} // subtle up-down floating
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg
          width="24"
          height="40"
          viewBox="0 0 24 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-[#e6902fd7]  opacity-70"
        >
          <rect
            x="2"
            y="2"
            width="20"
            height="36"
            rx="10"
            stroke="currentColor"
            strokeWidth="2"
          />
          <motion.circle
            cx="12"
            cy="8"
            r="3"
            fill="currentColor"
            animate={{ y: [0, 16, 0] }} // smooth moving dot
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

        </svg>

        <span className="mt-2 text-xs text-gray-500 uppercase tracking-widest animate-pulse">
          Scroll
        </span>
      </motion.div>

    </section>
  );
}