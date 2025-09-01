"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebarMobile({ isOpen, onClose }: CartDrawerProps) {
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="flex flex-col h-full sm:max-w-sm sm:ml-auto rounded-t-2xl sm:rounded-l-2xl">
        <DrawerHeader className="flex items-center justify-between border-b">
          <DrawerTitle>Shopping Cart</DrawerTitle>
          <DrawerClose asChild>
            <button
              aria-label="Close"
              className="p-2 rounded-md hover:bg-muted"
            >
              ✕
            </button>
          </DrawerClose>
        </DrawerHeader>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <p className="font-medium">Black T-Shirt</p>
              <p className="text-sm text-muted-foreground">Size M</p>
            </div>
            <p className="font-semibold">₹499</p>
          </div>

          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <p className="font-medium">Blue Jeans</p>
              <p className="text-sm text-muted-foreground">Size 32</p>
            </div>
            <p className="font-semibold">₹999</p>
          </div>
        </div>

        <DrawerFooter className="border-t">
          <Button className="w-full">Checkout</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
