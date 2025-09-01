"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AccountMenu } from "./AccountMenu";

export function DesktopPopover({
  onClose,
  isOpen,
  user,
}: {
  onClose: () => void;
  isOpen: boolean;
  user:any
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Outside click close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute right-8 top-10 z-50 w-64 bg-white rounded-md shadow-md border p-4"
        >
          <AccountMenu user={user}/>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
