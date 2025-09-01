"use client";

import ClientOnly from "@/app/ClientOnly";
import { useState } from "react";
import SearchModal from "../search/SearchModal";
import Logo from "./Logo";
import SearchButton from "./SearchButton";
import Account from "./account/Account";
// import { useUser } from "@/hooks/useUser";
import { useAuthStore } from "@/store/auth";

export const DEFAULT_SEARCH = "T shirt";

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header
        className="w-full fixed top-0 z-50 font-NeuMechina bg-white text-black"
        role="banner"
      >
        <nav
          className="max-w-7xl mx-auto flex items-center justify-between px-2 sm:px-6 py-3"
          role="navigation"
          aria-label="Main Navigation"
        >
          <SearchButton
            onClick={() => setSearchOpen(!searchOpen)}
            defaultSearch={DEFAULT_SEARCH}
          />
          <Logo />

          {/* ✅ Show user info or fallback */}
          <div className="flex flex-1 items-center gap-4">
              <Account />
          </div>
        </nav>
      </header>

      <ClientOnly>
        <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
      </ClientOnly>
    </>
  );
}
