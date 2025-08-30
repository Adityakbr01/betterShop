"use client";

import { useState } from "react";
import SearchModal from "../search/SearchModal";
import ClientOnly from "@/app/ClientOnly";
import SearchButton from "./SearchButton";
import Logo from "./Logo";
import UserActions from "./UserActions";

export const DEFAULT_SEARCH = "T shirt"; // Default search value

export default function Navbar() {
    const [cartOpen, setCartOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <>


            <header
                className="w-full fixed top-0 z-50 font-NeuMechina bg-white"
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

                    <UserActions onCartClick={() => setCartOpen(true)} />
                </nav>

            </header>

            <ClientOnly>
                <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
            </ClientOnly>

        </>
    );
}
