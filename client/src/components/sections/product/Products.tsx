"use client";

import { SlidersHorizontal } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import ProductsHeader from "./ProductsHeader";
import { AvailabilityFilter, ItemsCount, LoadingIndicator, PriceRangeFilter, SortSelect, ViewToggle } from "./FilterSection";
import ProductGrid from "./ProductGrid";

export default function Products() {
  // State management
  const [availability, setAvailability] = useState({ instock: false, outofstock: false });
  const [isAvailabilityOpen, setAvailabilityOpen] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [isPriceOpen, setPriceOpen] = useState(false);
  const [sort, setSort] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Animation and accessibility
  const prefersReducedMotion = useReducedMotion();

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Animation configurations
  const springConfig = useMemo(() => ({
    type: "spring" as const,
    stiffness: prefersReducedMotion ? 200 : isMobile ? 120 : 100,
    damping: prefersReducedMotion ? 30 : isMobile ? 20 : 15,
    mass: isMobile ? 0.8 : 1
  }), [prefersReducedMotion, isMobile]);

  const fadeConfig = useMemo(() => ({
    duration: prefersReducedMotion ? 0.1 : isMobile ? 0.3 : 0.4,
    ease: "easeOut" as const
  }), [prefersReducedMotion, isMobile]);

  // Sort options data
  const sortOptions = useMemo(() => [
    { value: "featured", label: "Featured" },
    { value: "best-selling", label: "Best Selling" },
    { value: "a-z", label: "A-Z" },
    { value: "z-a", label: "Z-A" },
    { value: "price-low-high", label: "Price Low-High" },
    { value: "price-high-low", label: "Price High-Low" },
    { value: "old-new", label: "Old-New" },
    { value: "new-old", label: "New-Old" }
  ], []);

  // Enhanced filter handlers with loading states
  const handleAvailabilityChange = (type: "instock" | "outofstock") => {
    setIsLoading(true);
    setAvailability(prev => ({ ...prev, [type]: !prev[type] }));
    // Simulate API call
    setTimeout(() => setIsLoading(false), 300);
  };

  const handleSortChange = (value: string) => {
    setIsLoading(true);
    setSort(value);
    // Simulate API call
    setTimeout(() => setIsLoading(false), 300);
  };

  const handlePriceChange = (field: "min" | "max", value: string) => {
    setPriceRange(prev => ({ ...prev, [field]: value }));
  };

  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode);
  };

  // Mock products data (replace with actual data)
  const mockProducts = [
    { id: 1, name: "Product 1", price: 299 },
    { id: 2, name: "Product 2", price: 399 },
    { id: 3, name: "Product 3", price: 499 },
    { id: 4, name: "Product 4", price: 599 }
  ];

  // Computed values
  const selectedAvailabilityText = useMemo(() => {
    const selected = [
      availability.instock && "In Stock",
      availability.outofstock && "Out of Stock",
    ].filter(Boolean);
    return selected.length > 0 ? selected.join(", ") : "Availability";
  }, [availability]);

  const selectedSortLabel = useMemo(() => {
    const option = sortOptions.find(opt => opt.value === sort);
    return option ? option.label : "Sort by";
  }, [sort, sortOptions]);

  const priceRangeText = useMemo(() => {
    if (priceRange.min || priceRange.max) {
      return `₹${priceRange.min || 0} – ₹${priceRange.max || "Max"}`;
    }
    return "Price Range";
  }, [priceRange]);

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white text-black">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Products Header */}
        <ProductsHeader isMobile={isMobile} springConfig={springConfig} />

        {/* Enhanced Filter Bar with Modular Components */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springConfig, delay: 0.3 }}
          className="flex flex-col lg:flex-row justify-between font-NeuMechina gap-4 sm:gap-6 mb-6 sm:mb-8"
        >
          {/* Left Filters */}
          <motion.div
            initial={{ opacity: 0, x: isMobile ? 0 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...springConfig, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4"
          >
            <AvailabilityFilter
              availability={availability}
              isOpen={isAvailabilityOpen}
              onOpenChange={setAvailabilityOpen}
              onAvailabilityChange={handleAvailabilityChange}
              selectedText={selectedAvailabilityText}
              isMobile={isMobile}
              springConfig={springConfig}
              fadeConfig={fadeConfig}
            />

            <PriceRangeFilter
              priceRange={priceRange}
              isOpen={isPriceOpen}
              onOpenChange={setPriceOpen}
              onPriceChange={handlePriceChange}
              priceRangeText={priceRangeText}
              isMobile={isMobile}
              springConfig={springConfig}
              fadeConfig={fadeConfig}
            />
          </motion.div>

          {/* Right Filters */}
          <motion.div
            initial={{ opacity: 0, x: isMobile ? 0 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...springConfig, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4"
          >
            <ItemsCount count={mockProducts.length} springConfig={springConfig} />

            <SortSelect
              sort={sort}
              sortOptions={sortOptions}
              onSortChange={handleSortChange}
              isMobile={isMobile}
              springConfig={springConfig}
              fadeConfig={fadeConfig}
            />

            <ViewToggle
              viewMode={viewMode}
              onViewModeChange={handleViewModeChange}
              isMobile={isMobile}
              springConfig={springConfig}
            />

            <LoadingIndicator isLoading={isLoading} fadeConfig={fadeConfig} />
          </motion.div>
        </motion.div>

        {/* Products Grid */}
        <ProductGrid
          products={mockProducts}
          isMobile={isMobile}
          springConfig={springConfig}
          viewMode={viewMode}
        />
      </div>
    </section>
  );
}
