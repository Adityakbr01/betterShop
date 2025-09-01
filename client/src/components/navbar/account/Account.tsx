"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useState } from "react";
import { CiUser } from "react-icons/ci";
import { IoBagOutline } from "react-icons/io5";
import { DesktopPopover } from "./DesktopPopover";
import { MobileDrawer } from "./MobileDrawer";
import { CartSidebarMobile } from "../Cart/CartSidebarMobile";
import { CartSidebarDesk } from "../Cart/CartSidebarDesk";
import { useAuthStore } from "@/store/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Account() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const user = useAuthStore((state) => state.user); // ✅ reactive


  return (
    <div className="flex items-center gap-4 flex-1 justify-end relative">
      {/* Toggle account */}

      {!user ? (
        <CiUser
          size={22}
          className="cursor-pointer"
          onClick={() => setIsOpen((prev) => !prev)}
        />
      ) : (
        <div className="w-6 h-6 cursor-pointer flex justify-center items-center rounded-full bg-black text-white" onClick={() => setIsOpen((prev) => !prev)}>

          {user?.email?.charAt(0).toUpperCase()}

        </div>
      )}

      {/* Desktop popover */}
      {!isMobile && isOpen && <DesktopPopover user={user} isOpen={isOpen} onClose={() => setIsOpen(false)} />}

      {/* Mobile drawer */}
      {isMobile && (
        <MobileDrawer user={user} isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}

      {/* Cart button */}
      <button
        className="relative"
        aria-label="Open cart"
        onClick={() => setIsCartOpen(true)}
      >
        <IoBagOutline size={22} aria-hidden="true" />
      </button>

      {/* Cart Sidebar */}
      {isMobile ? (
        <CartSidebarMobile isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      ) : (<CartSidebarDesk isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />)}

    </div>
  );
}
