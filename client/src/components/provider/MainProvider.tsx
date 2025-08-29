"use client";

import { ThemeProvider } from "@/components/theme/theme-provider";
import Navbar from "@/components/navbar";

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
            <Navbar />
            {children}
        </ThemeProvider>
    );
}
