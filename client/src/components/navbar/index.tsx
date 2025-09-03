"use client";

import ClientOnly from "@/app/ClientOnly";
import { useState, useEffect } from "react";
import SearchModal from "../search/SearchModal";
import Logo from "./Logo";
import SearchButton from "./SearchButton";
import Account from "./account/Account";
import { useAuthStore } from "@/store/auth";
import Image from "next/image";

export const DEFAULT_SEARCH = "T shirt";

/* -------------------------------
   Fake Timer Hook (utility)
-------------------------------- */
function useFakeTimer(initialMinutes: number = 15) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return {
    minutes,
    seconds,
    isExpired: timeLeft <= 0,
  };
}

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { minutes, seconds, isExpired } = useFakeTimer(15); // fake 15min countdown

  return (
    <>
      <header
        className="w-full fixed top-0 z-50 font-NeuMechina bg-white text-black"
        role="banner"
      >
        {/* ✅ Offer Banner with Timer */}
        <div className="bg-black text-white text-xs sm:text-sm flex justify-center items-center h-7 px-3 space-x-3">
          {isExpired ? (
            <span className="animate-pulse">
              ⏰ Offer expired! Stay tuned for the next drop.
            </span>
          ) : (
            <>
              <div className="flex items-center space-x-2">
                <Image
                  src="/fire_1f525.png"
                  alt="Offer Flame"
                  width={16}
                  height={16}
                  className="animate-pulse"
                />
                <span>Limited Time Offer: 20% OFF</span>
              </div>
              <span className="font-bold text-accent tabular-nums">
                {String(minutes).padStart(2, "0")}:
                {String(seconds).padStart(2, "0")}
              </span>
            </>
          )}
        </div>


        {/* ✅ Main Navbar */}
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
          <div className="flex flex-1 items-center gap-4 justify-end">
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
