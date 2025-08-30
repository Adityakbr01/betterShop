"use client";

import { ThemeProvider } from "@/components/theme/theme-provider";
import Navbar from "@/components/navbar";
import LenisProvider from "./LenisProvider";

export default function MainProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
        >
            <LenisProvider>
                <Navbar />
                {children}
            </LenisProvider>
        </ThemeProvider>
    );
}
