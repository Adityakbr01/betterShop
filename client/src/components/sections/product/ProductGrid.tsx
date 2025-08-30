"use client";

import { motion, AnimatePresence } from "motion/react";
import { SlidersHorizontal } from "lucide-react";

// Types
interface AnimationConfig {
  type: "spring";
  stiffness: number;
  damping: number;
  mass: number;
}

interface Product {
  id: number;
  name?: string;
  price?: number;
  image?: string;
}

// ProductCard Component
interface ProductCardProps {
  product: Product;
  index: number;
  isMobile: boolean;
  springConfig: AnimationConfig;
}

export function ProductCard({ product, index, isMobile, springConfig }: ProductCardProps) {
  return (
    <motion.div
      key={product.id}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        ...springConfig, 
        delay: 0.9 + (index * 0.1),
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        scale: isMobile ? 1.02 : 1.05,
        y: isMobile ? -2 : -5,
        transition: { duration: 0.2 }
      }}
      className="group cursor-pointer"
    >
      <div className="relative h-48 sm:h-56 lg:h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        {/* Placeholder content with loading animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
        
        {/* Product placeholder */}
        <div className="absolute inset-4 bg-gray-300/50 rounded-md" />
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        
        {/* Product info placeholder */}
        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <div className="h-3 bg-gray-400/60 rounded w-3/4" />
          <div className="h-2 bg-gray-400/40 rounded w-1/2" />
        </div>
      </div>
    </motion.div>
  );
}

// EmptyState Component
interface EmptyStateProps {
  springConfig: AnimationConfig;
}

export function EmptyState({ springConfig }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={springConfig}
      className="text-center py-12"
    >
      <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
        <SlidersHorizontal className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
      <p className="text-gray-500">Try adjusting your filters or search terms.</p>
    </motion.div>
  );
}

// ProductGrid Component
interface ProductGridProps {
  products: Product[];
  isMobile: boolean;
  springConfig: AnimationConfig;
  viewMode?: "grid" | "list";
}

export default function ProductGrid({ 
  products, 
  isMobile, 
  springConfig,
  viewMode = "grid"
}: ProductGridProps) {
  const hasProducts = products.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springConfig, delay: 0.8 }}
      className={`
        ${viewMode === "grid" 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6" 
          : "flex flex-col gap-4"
        }
      `}
    >
      {hasProducts ? (
        products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            index={index}
            isMobile={isMobile}
            springConfig={springConfig}
          />
        ))
      ) : (
        <div className="col-span-full">
          <AnimatePresence>
            <EmptyState springConfig={springConfig} />
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
