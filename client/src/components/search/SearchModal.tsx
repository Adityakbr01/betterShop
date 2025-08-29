"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "@/components/ui/command";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import useDebounced from "@/hooks/useDebounced";
import SearchInput from "./SearchInput";
import SearchResults from "./SearchResults";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { AnimatePresence, motion } from "motion/react"; // ✅ framer-motion
import gsap from "gsap";

type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
  handle: string;
  tags?: string[];
};

const MOCK_PRODUCTS: Product[] = [
  { id: "1", title: "Classic Black T-Shirt", price: 699, image: "https://picsum.photos/seed/tee1/300/300", handle: "/products/classic-black-tshirt", tags: ["T-Shirt", "Cotton"] },
  { id: "2", title: "Oversized Hoodie Sand", price: 1799, image: "https://picsum.photos/seed/hoodie1/300/300", handle: "/products/oversized-hoodie-sand", tags: ["Hoodie", "Oversized"] },
  { id: "3", title: "Minimal Cap", price: 499, image: "https://picsum.photos/seed/cap1/300/300", handle: "/products/minimal-cap", tags: ["Accessory", "Cap"] },
  { id: "4", title: "Graphic Tee – Retro Wave", price: 899, image: "https://picsum.photos/seed/tee2/300/300", handle: "/products/graphic-tee-retro-wave", tags: ["T-Shirt", "Graphic"] },
];

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [recentlyViewed, setRecentlyViewed] = React.useState<Product[]>([]);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const debouncedQuery = useDebounced(query, 300);

  const drawerRef = React.useRef<HTMLDivElement>(null);

  // Load recently viewed
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("recentlyViewed");
    if (saved) {
      try {
        setRecentlyViewed(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to parse recently viewed:", error);
      }
    }
  }, [open]);

  // Simulate loading
  React.useEffect(() => {
    if (debouncedQuery.trim()) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [debouncedQuery]);

  // Filter products
  const filteredProducts = React.useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return [];
    return MOCK_PRODUCTS.filter(
      (product) =>
        product.title.toLowerCase().includes(q) ||
        product.tags?.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [debouncedQuery]);

  const handleProductSelect = (handle: string) => {
    const product = MOCK_PRODUCTS.find((p) => p.handle === handle);
    if (product) {
      const updated = [product, ...recentlyViewed.filter((p) => p.id !== product.id)].slice(0, 5);
      setRecentlyViewed(updated);
      localStorage.setItem("recentlyViewed", JSON.stringify(updated));
    }
    onOpenChange(false);
    router.push(handle);
  };

  const hasSearched = debouncedQuery.trim().length > 0;

  // ---- Drawer snapping logic ----
  const snapPoints = [window.innerHeight * 0.5, window.innerHeight * 0.9]; // 50% and 90%
  const [snapIndex, setSnapIndex] = React.useState(1); // start at 90%

  const handleDragEnd = (_: any, info: any) => {
    const velocity = info.velocity.y;
    const offset = info.offset.y;

    if (offset > 100 || velocity > 800) {
      onOpenChange(false); // close if fast drag down
      return;
    }

    let nearest = snapIndex;
    let minDist = Infinity;
    snapPoints.forEach((p, i) => {
      const dist = Math.abs(info.point.y - (window.innerHeight - p));
      if (dist < minDist) {
        minDist = dist;
        nearest = i;
      }
    });
    setSnapIndex(nearest);

    if (drawerRef.current) {
      gsap.to(drawerRef.current, {
        y: window.innerHeight - snapPoints[nearest],
        duration: 0.35,
        ease: "power3.out",
      });
    }
  };

  return (
    <AnimatePresence>
      {open && isMobile && (
        <div className="fixed inset-0 z-50 flex flex-col md:hidden">
          {/* backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => onOpenChange(false)}
          />

          {/* drawer */}
          <motion.div
            key="drawer"
            ref={drawerRef}
            initial={{ y: "100%" }}
            animate={{ y: window.innerHeight - snapPoints[snapIndex] }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 35 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="relative mt-auto w-full h-[90vh] bg-background rounded-t-2xl shadow-lg flex flex-col"
          >
            {/* handle bar */}
            <div className="p-2 flex justify-center cursor-grab active:cursor-grabbing">
              <div className="h-1 w-12 rounded-full bg-muted" />
            </div>

            <Command shouldFilter={false} className="flex flex-col flex-1">
              <SearchInput value={query} onChange={setQuery} placeholder="Search" />
              <div className="flex-1 overflow-y-auto">
                <SearchResults
                  products={filteredProducts}
                  recentlyViewed={recentlyViewed}
                  isLoading={isLoading}
                  onProductSelect={handleProductSelect}
                  hasSearched={hasSearched}
                  query={debouncedQuery}
                />
              </div>
            </Command>
          </motion.div>
        </div>
      )}

      {/* --- Desktop Dialog with Animation --- */}
      {!isMobile && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <AnimatePresence>
            {open && (
              <DialogContent className="p-0 gap-0 sm:max-w-2xl h-[60vh] md:h-[500px] overflow-hidden flex flex-col bg-background">
                <motion.div
                  key="dialog"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="flex flex-col h-full"
                >
                  <Command shouldFilter={false} className="flex flex-col h-full">
                    <SearchInput value={query} onChange={setQuery} placeholder="Search" />
                    <div className="flex-1 overflow-y-auto">
                      <SearchResults
                        products={filteredProducts}
                        recentlyViewed={recentlyViewed}
                        isLoading={isLoading}
                        onProductSelect={handleProductSelect}
                        hasSearched={hasSearched}
                        query={debouncedQuery}
                      />
                    </div>
                  </Command>
                </motion.div>
              </DialogContent>
            )}
          </AnimatePresence>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
