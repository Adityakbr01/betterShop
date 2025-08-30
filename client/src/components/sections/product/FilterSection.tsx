"use client";

import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown, Filter, SlidersHorizontal, LayoutGrid, Grip } from "lucide-react";

// Types
interface AvailabilityState {
  instock: boolean;
  outofstock: boolean;
}

interface PriceRangeState {
  min: string;
  max: string;
}

interface SortOption {
  value: string;
  label: string;
}

interface AnimationConfig {
  type: "spring";
  stiffness: number;
  damping: number;
  mass: number;
}

interface FadeConfig {
  duration: number;
  ease: "easeOut";
}

// AvailabilityFilter Component
interface AvailabilityFilterProps {
  availability: AvailabilityState;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAvailabilityChange: (type: "instock" | "outofstock") => void;
  selectedText: string;
  isMobile: boolean;
  springConfig: AnimationConfig;
  fadeConfig: FadeConfig;
}

export function AvailabilityFilter({
  availability,
  isOpen,
  onOpenChange,
  onAvailabilityChange,
  selectedText,
  isMobile,
  springConfig,
  fadeConfig
}: AvailabilityFilterProps) {
  return (
    <motion.div
      whileHover={{ scale: isMobile ? 1 : 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={springConfig}
    >
      <Popover open={isOpen} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild className="bg-transparent border-none shadow-none hover:bg-transparent cursor-pointer">
          <Button
            variant="ghost"
            className="flex items-center gap-2 min-h-[44px] px-3 sm:px-4 text-sm sm:text-base border rounded-lg transition-all duration-200"
          >
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="truncate max-w-[120px] sm:max-w-none">{selectedText}</span>
            <motion.span
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={fadeConfig}
            >
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </motion.span>
          </Button>
        </PopoverTrigger>

        <AnimatePresence>
          {isOpen && (
            <PopoverContent asChild forceMount>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={fadeConfig}
                className="w-48 sm:w-56 p-4 flex flex-col gap-3 shadow-lg border border-gray-200 rounded-lg"
              >
                {[
                  { key: "instock", label: "In Stock", checked: availability.instock },
                  { key: "outofstock", label: "Out of Stock", checked: availability.outofstock }
                ].map((item, index) => (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...fadeConfig, delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <Checkbox
                      id={item.key}
                      checked={item.checked}
                      onCheckedChange={() => onAvailabilityChange(item.key as "instock" | "outofstock")}
                      className="data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"
                    />
                    <Label
                      htmlFor={item.key}
                      className="cursor-pointer text-sm font-medium flex-1 select-none"
                    >
                      {item.label}
                    </Label>
                  </motion.div>
                ))}
              </motion.div>
            </PopoverContent>
          )}
        </AnimatePresence>
      </Popover>
    </motion.div>
  );
}

// PriceRangeFilter Component
interface PriceRangeFilterProps {
  priceRange: PriceRangeState;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPriceChange: (field: "min" | "max", value: string) => void;
  priceRangeText: string;
  isMobile: boolean;
  springConfig: AnimationConfig;
  fadeConfig: FadeConfig;
}

export function PriceRangeFilter({
  priceRange,
  isOpen,
  onOpenChange,
  onPriceChange,
  priceRangeText,
  isMobile,
  springConfig,
  fadeConfig
}: PriceRangeFilterProps) {
  return (
    <motion.div
      whileHover={{ scale: isMobile ? 1 : 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={springConfig}
    >
      <Popover open={isOpen} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild className="bg-transparent border-none shadow-none hover:bg-transparent cursor-pointer">
          <Button
            variant="ghost"
            className="flex items-center gap-2 min-h-[44px] px-3 sm:px-4 text-sm sm:text-base border border-gray-200 hover:border-gray-300 rounded-lg transition-all duration-200"
          >
            <SlidersHorizontal className="w-4 h-4 text-gray-500" />
            <span className="truncate max-w-[120px] sm:max-w-none">{priceRangeText}</span>
            <motion.span
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={fadeConfig}
            >
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </motion.span>
          </Button>
        </PopoverTrigger>

        <AnimatePresence>
          {isOpen && (
            <PopoverContent asChild forceMount>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={fadeConfig}
                className="p-4 flex flex-col gap-4 w-64 shadow-lg border border-gray-200 rounded-lg"
              >
                <div className="flex gap-3">
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...fadeConfig, delay: 0.1 }}
                    className="relative flex-1"
                  >
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                    <Input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => onPriceChange("min", e.target.value)}
                      placeholder="Min"
                      className="pl-7 min-h-[44px] border-gray-200 focus:border-gray-400"
                    />
                  </motion.div>
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ ...fadeConfig, delay: 0.15 }}
                    className="self-center text-gray-600 font-medium"
                  >
                    to
                  </motion.span>
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...fadeConfig, delay: 0.2 }}
                    className="relative flex-1"
                  >
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                    <Input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => onPriceChange("max", e.target.value)}
                      placeholder="Max"
                      className="pl-7 min-h-[44px] border-gray-200 focus:border-gray-400"
                    />
                  </motion.div>
                </div>
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...fadeConfig, delay: 0.25 }}
                  className="text-xs text-gray-500 text-center"
                >
                  The highest price is Rs. 799.00
                </motion.p>
              </motion.div>
            </PopoverContent>
          )}
        </AnimatePresence>
      </Popover>
    </motion.div>
  );
}

// SortSelect Component
interface SortSelectProps {
  sort: string;
  sortOptions: SortOption[];
  onSortChange: (value: string) => void;
  isMobile: boolean;
  springConfig: AnimationConfig;
  fadeConfig: FadeConfig;
}

export function SortSelect({
  sort,
  sortOptions,
  onSortChange,
  isMobile,
  springConfig,
  fadeConfig
}: SortSelectProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ ...springConfig, delay: 0.7 }}
      whileHover={{ scale: isMobile ? 1 : 1.02 }}
      whileTap={{ scale: 0.98 }}
    >

      <Select value={sort} onValueChange={onSortChange}>
        <SelectTrigger className="bg-transparent border-none shadow-none hover:bg-transparent cursor-pointer sm:w-[180px] min-h-[44px]  transition-colors">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent className="min-w-[180px]">
          {sortOptions.map((option, index) => (
            <motion.div
              key={option.value}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...fadeConfig, delay: index * 0.05 }}
            >
              <SelectItem
                value={option.value}
                className="cursor-pointer hover:bg-gray-50 focus:bg-gray-50 transition-colors"
              >
                {option.label}
              </SelectItem>
            </motion.div>
          ))}
        </SelectContent>
      </Select>
    </motion.div>
  );
}

// ItemsCount Component
interface ItemsCountProps {
  count: number;
  springConfig: AnimationConfig;
}

export function ItemsCount({ count, springConfig }: ItemsCountProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ ...springConfig, delay: 0.6 }}
      className="flex items-center gap-2"
    >
      <SlidersHorizontal className="w-4 h-4 text-gray-500" />
      <span className="text-sm text-gray-600 font-medium">{count} items</span>
    </motion.div>
  );
}

// ViewToggle Component
interface ViewToggleProps {
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  isMobile: boolean;
  springConfig: AnimationConfig;
}

export function ViewToggle({
  viewMode,
  onViewModeChange,
  isMobile,
  springConfig
}: ViewToggleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ ...springConfig, delay: 0.8 }}
      className="flex items-center gap-1 border border-gray-200 rounded-lg p-1"
    >
      <motion.button
        onClick={() => onViewModeChange("grid")}
        whileHover={{ scale: isMobile ? 1 : 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={`p-2 rounded-md transition-colors ${viewMode === "grid"
            ? "bg-gray-900 text-white"
            : "text-gray-500 hover:bg-gray-100"
          }`}
        aria-label="Grid view"
      >
        <LayoutGrid className="w-4 h-4" />
      </motion.button>
      <motion.button
        onClick={() => onViewModeChange("list")}
        whileHover={{ scale: isMobile ? 1 : 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={`p-2 rounded-md transition-colors ${viewMode === "list"
            ? "bg-gray-900 text-white"
            : "text-gray-500 hover:bg-gray-100"
          }`}
        aria-label="List view"
      >
        <Grip className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
}

// LoadingIndicator Component
interface LoadingIndicatorProps {
  isLoading: boolean;
  fadeConfig: FadeConfig;
}

export function LoadingIndicator({ isLoading, fadeConfig }: LoadingIndicatorProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={fadeConfig}
          className="flex items-center gap-2"
        >
          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          <span className="text-xs text-gray-500">Updating...</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
