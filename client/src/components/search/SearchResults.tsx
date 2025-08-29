import { CommandEmpty, CommandGroup, CommandList } from "@/components/ui/command";
import ProductItem from "./ProductItem";
import SearchSkeleton from "./SearchSkeleton";

type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
  handle: string;
  tags?: string[];
};

interface SearchResultsProps {
  products: Product[];
  recentlyViewed: Product[];
  isLoading: boolean;
  onProductSelect: (handle: string) => void;
  hasSearched: boolean;
  query: string;
}

export default function SearchResults({
  products,
  recentlyViewed,
  isLoading,
  onProductSelect,
  hasSearched,
  query
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <CommandList className="flex-1 h-full">
        <SearchSkeleton />
      </CommandList>
    );
  }

  if (!hasSearched && !query.trim()) {
    return (
      <CommandList className="flex-1 h-full">
        {recentlyViewed.length > 0 ? (
          <CommandGroup heading="Recently Viewed">
            {recentlyViewed.map((product) => (
              <ProductItem
                key={product.id}
                product={product}
                onSelect={onProductSelect}
              />
            ))}
          </CommandGroup>
        ) : (
          <div className="p-6 text-center text-muted-foreground">
            <p>Start typing to search for products...</p>
          </div>
        )}
      </CommandList>
    );
  }

  if (products.length === 0) {
    return (
      <CommandList className="flex-1 h-full">
        <CommandEmpty>No products found.</CommandEmpty>
      </CommandList>
    );
  }

  return (
    <CommandList className="flex-1 h-full">
      <CommandGroup heading="Products">
        {products.map((product) => (
          <ProductItem
            key={product.id}
            product={product}
            onSelect={onProductSelect}
          />
        ))}
      </CommandGroup>
    </CommandList>
  );
}
