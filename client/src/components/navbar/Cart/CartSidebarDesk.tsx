"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IoClose } from "react-icons/io5";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Plus } from "lucide-react";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebarDesk({ isOpen, onClose }: CartSidebarProps) {
  const [couponOpen, setCouponOpen] = useState(false);

  // Close on Escape
  useEffect(() => {
    function handleEsc(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    if (isOpen) document.addEventListener("keydown", handleEsc);
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
              {/* Header */}
              <CardHeader className="flex flex-row items-center justify-between border-b px-4 py-3">
                <CardTitle>Shopping Cart</CardTitle>
                <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition">
                  <IoClose size={22} />
                </button>
              </CardHeader>

              {/* Cart Items */}
              <CardContent className="flex-1 overflow-y-auto space-y-4 px-4 py-3">
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

              {/* Coupon Section */}

              <div className="w-full flex-col items-center justify-between px-4">
                {/* Coupon Header */}
                <div
                  className="w-full flex items-center justify-between cursor-pointer"
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
                      className="overflow-hidden"
                    >
                      <div className="flex items-center mt-4 gap-1">
                        <Input placeholder="Discount Coupon" className="flex-1 h-12" />
                        <Button className="h-12">Apply</Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Estimated Total */}
              <Separator />
              <div className="px-4 flex flex-col">
                <div className="flex justify-between items-center font-semibold text-gray-900">
                  <span>Estimated Total</span>
                  <span>₹1,498</span>

                </div>
                <p className="text-[0.5rem] font-Helvetica text-gray-600">Taxes and shipping calculated at checkout.</p>
              </div>




              {/* Checkout Button */}
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