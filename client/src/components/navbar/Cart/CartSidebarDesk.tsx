"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IoClose } from "react-icons/io5";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebarDesk({ isOpen, onClose }: CartSidebarProps) {
  // Escape key par close
  useEffect(() => {
    function handleEsc(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            className="fixed right-0 top-0 h-full w-80 z-50"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Card className="h-full rounded-none flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between border-b">
                <CardTitle>Shopping Cart</CardTitle>
                <button onClick={onClose} className="p-1">
                  <IoClose size={22} />
                </button>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto space-y-4">
                {/* Example cart items */}
                <div className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">Black T-Shirt</p>
                    <p className="text-sm text-gray-500">Size M</p>
                  </div>
                  <p className="font-semibold">₹499</p>
                </div>

                <div className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">Blue Jeans</p>
                    <p className="text-sm text-gray-500">Size 32</p>
                  </div>
                  <p className="font-semibold">₹999</p>
                </div>
              </CardContent>

              <div className="p-4 border-t">
                <Button className="w-full">Checkout</Button>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
