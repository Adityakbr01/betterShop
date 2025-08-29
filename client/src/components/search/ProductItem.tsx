import Image from "next/image";
import { CommandItem } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";

type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
  handle: string;
  tags?: string[];
};

interface ProductItemProps {
  product: Product;
  onSelect: (handle: string) => void;
}

export default function ProductItem({ product, onSelect }: ProductItemProps) {
  return (
    <CommandItem
      key={product.id}
      value={product.title}
      onSelect={() => onSelect(product.handle)}
      className="py-3 px-2 cursor-pointer"
    >
      <div className="flex items-center gap-4 w-full">
        {/* Product Image */}
        <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-muted/40 shrink-0">
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="56px"
            className="object-cover"
            unoptimized
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="truncate font-medium text-sm md:text-base">
              {product.title}
            </p>
            <span className="text-sm md:text-base font-semibold tabular-nums">
              ₹{product.price}
            </span>
          </div>
          {product.tags && product.tags.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {product.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="px-1.5 py-0 text-[10px] md:text-xs"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </CommandItem>
  );
}
