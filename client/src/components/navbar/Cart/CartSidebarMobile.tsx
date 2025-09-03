"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebarMobile({ isOpen, onClose }: CartDrawerProps) {
  const [couponOpen, setCouponOpen] = useState(false);

  // Escape key closes drawer
  useEffect(() => {
    function handleEsc(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="flex flex-col h-full sm:max-w-sm sm:ml-auto rounded-t-2xl sm:rounded-l-2xl">
        {/* Header */}
        <DrawerHeader className="flex items-center justify-between border-b px-4 py-3">
          <DrawerTitle>Shopping Cart</DrawerTitle>
          <DrawerClose asChild>
            <button aria-label="Close" className="p-2 rounded-md hover:bg-muted">
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

          {/* Coupon Section */}
          <div className="w-full flex flex-col items-center justify-between px-0 mt-4">
            {/* Coupon Header */}
            <div
              className="w-full flex items-center justify-between cursor-pointer px-2 py-2"
              onClick={() => setCouponOpen(!couponOpen)}
            >
              <p className="text-gray-600 text-sm">Discount</p>
              <Plus className="text-gray-600 text-sm" />
            </div>

            {/* Animated Coupon Input */}
            <AnimatePresence>
              {couponOpen && (
                <motion.div
                  key="coupon-input"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden w-full px-2"
                >
                  <div className="flex items-center mt-2 gap-2">
                    <Input placeholder="Discount Coupon" className="flex-1 h-12" />
                    <Button className="h-12">Apply</Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Estimated Total */}
          <Separator className="my-4" />
          <div className="flex flex-col px-2 space-y-1">
            <div className="flex justify-between font-semibold text-gray-900">
              <span>Estimated Total</span>
              <span>₹1,498</span>
            </div>
            <p className="text-[0.65rem] text-gray-500">
              Taxes and shipping calculated at checkout.
            </p>
          </div>
        </div>

        {/* Checkout Button */}
        <DrawerFooter className="border-t p-4">
          <Button className="w-full">Checkout</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
