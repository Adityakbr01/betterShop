"use client";

import Image from "next/image";
import { motion } from "motion/react";

export default function ProductCard() {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative w-[300px] h-[420px] bg-gradient-to-br from-gray-100 via-white to-gray-50
                 shadow-xl rounded-tl-[60px] rounded-br-[60px] rounded-tr-2xl rounded-bl-2xl
                 border border-gray-200 overflow-hidden"
    >
      {/* Product Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1618354691438-cdb9a8b0b7f5?q=80&w=800&auto=format&fit=crop"
          alt="Classic Black Tee"
          fill
          className="object-cover"
        />
      </div>

      {/* Overlay Light Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/60 pointer-events-none" />

      {/* Floating Badge */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="absolute top-3 right-3 bg-black text-white text-xs px-4 py-1.5 rounded-full 
                   shadow-md tracking-wide uppercase"
      >
        Bestseller
      </motion.div>

      {/* Product Info */}
      <div className="absolute bottom-0 left-0 right-0 p-5 bg-white/70 backdrop-blur-md">
        <h3 className="text-lg font-semibold text-gray-900">Classic Black Tee</h3>
        <p className="text-sm text-gray-600 mt-1">Minimal • Premium Cotton</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xl font-bold text-gray-900">₹1299</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-black text-white text-sm font-semibold rounded-md"
          >
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
