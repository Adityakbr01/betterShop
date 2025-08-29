import Link from "next/link";
import { motion } from "motion/react";

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center justify-center flex-1"
      aria-label="Go to homepage"
    >
      <div className="relative h-16 w-[200px] sm:w-[250px] flex items-center justify-center">
        <motion.div
          aria-hidden="true"
          className="absolute pointer-events-none -z-10 rounded-full"
          animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative z-10 flex flex-col items-center gap-1">
          <motion.h1
            className="md:text-3xl text-xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-black via-gray-800 to-gray-900 bg-[length:200%_100%]"
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            BetterShop
          </motion.h1>
          <span className="text-xs text-black -mt-1">Premium Clothing</span>
        </div>
      </div>
    </Link>
  );
}
