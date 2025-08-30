import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

interface PremiumBadgeProps {
  isMobile?: boolean;
}

export default function PremiumBadge({ isMobile = false }: PremiumBadgeProps) {
  return (
    <motion.div
      initial={{ scale: isMobile ? 0.9 : 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{
        duration: isMobile ? 0.5 : 0.6,
        delay: isMobile ? 0.3 : 0.5,
        type: "spring",
        stiffness: 120,
      }}
      className="inline-flex items-center gap-2 md:px-5 md:py-3 px-3 py-2 rounded-full text-sm sm:text-base font-semibold relative overflow-hidden cursor-pointer"
      style={{
        background: "linear-gradient(167deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
      }}
    >
      {/* Sparkles icon with pulse */}
      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 text-yellow-500 animate-pulse" />

      {/* Text with subtle depth shadow */}
      <span
        className="relative z-10 text-gray-900"
        style={{
          textShadow: "0 1px 2px rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        Premium Quality Materials
      </span>

      {/* Diagonal shimmer overlay */}
      <span
        className="absolute inset-0 pointer-events-none rounded-full"
        style={{
          background:
            "linear-gradient(45deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 60%)",
          transform: "translateX(-120%) translateY(-20%)",
          animation: "diagonalShimmer 3s infinite",
          filter: "blur(6px)",
        }}
      ></span>

      {/* Horizontal shimmer following icon */}
      <span
        className="absolute top-0 left-0 w-12 h-full pointer-events-none"
        style={{
          background:
            "linear-gradient(120deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 100%)",
          transform: "translateX(-150%)",
          animation: "iconShimmer 2s infinite",
          borderRadius: "50%",
          filter: "blur(4px)",
        }}
      ></span>

      {/* Subtle animated gradient background */}
      <span
        className="absolute inset-0 pointer-events-none rounded-full"
        style={{
          background: "linear-gradient(135deg, #fef3c7, #fde68a, #fcd34d)",
          animation: "gradientShift 8s ease-in-out infinite",
          opacity: 0.2,
        }}
      ></span>

      <style jsx>{`
        @keyframes iconShimmer {
          0% {
            transform: translateX(-150%);
          }
          50% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-150%);
          }
        }
        @keyframes diagonalShimmer {
          0% {
            transform: translateX(-120%) translateY(-20%);
          }
          50% {
            transform: translateX(120%) translateY(20%);
          }
          100% {
            transform: translateX(-120%) translateY(-20%);
          }
        }
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </motion.div>
  );
}
