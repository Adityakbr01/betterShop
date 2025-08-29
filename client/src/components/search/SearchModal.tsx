"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "@/components/ui/command";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import useDebounced from "@/hooks/useDebounced";
import SearchInput from "./SearchInput";
import SearchResults from "./SearchResults";

// ---- Mock products (replace with API) ----
type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
  handle: string;
  tags?: string[];
};

const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Classic Black T-Shirt",
    price: 699,
    image: "https://picsum.photos/seed/tee1/300/300",
    handle: "/products/classic-black-tshirt",
    tags: ["T-Shirt", "Cotton"],
  },
  {
    id: "2",
    title: "Oversized Hoodie Sand",
    price: 1799,
    image: "https://picsum.photos/seed/hoodie1/300/300",
    handle: "/products/oversized-hoodie-sand",
    tags: ["Hoodie", "Oversized"],
  },
  {
    id: "3",
    title: "Minimal Cap",
    price: 499,
    image: "https://picsum.photos/seed/cap1/300/300",
    handle: "/products/minimal-cap",
    tags: ["Accessory", "Cap"],
  },
  {
    id: "4",
    title: "Graphic Tee – Retro Wave",
    price: 899,
    image: "https://picsum.photos/seed/tee2/300/300",
    handle: "/products/graphic-tee-retro-wave",
    tags: ["T-Shirt", "Graphic"],
  },
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

  const debouncedQuery = useDebounced(query, 300);

  // Load recently viewed from localStorage
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

  // Simulate loading when searching
  React.useEffect(() => {
    if (debouncedQuery.trim()) {
      setIsLoading(true);
      // Simulate API delay
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [debouncedQuery]);

  // Filter products based on search query
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
      // Update recently viewed
      const updated = [
        product,
        ...recentlyViewed.filter((p) => p.id !== product.id),
      ].slice(0, 5); // Keep max 5 items

      setRecentlyViewed(updated);
      localStorage.setItem("recentlyViewed", JSON.stringify(updated));
    }

    onOpenChange(false);
    router.push(handle);
  };

  const hasSearched = debouncedQuery.trim().length > 0;

  return (
<Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent className="p-0 gap-0 sm:max-w-2xl  h-[60vh] md:h-[500px] overflow-hidden flex flex-col">
    <Command shouldFilter={false} className="flex flex-col h-full">
      {/* Search Input (fixed at top) */}
      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder="Search"
      />

      {/* Results take remaining space */}
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
  </DialogContent>
</Dialog>



  );
}
