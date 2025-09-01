"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AccountMenu } from "./AccountMenu";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    user:any
}

export function MobileDrawer({ isOpen, onClose,user }: Props) {
    const drawerRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
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
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 bg-black z-40"
                    />

                    {/* Drawer */}
                    <motion.div
                        ref={drawerRef}
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                        }}
                        className="fixed bottom-0 left-0 w-full sm:rounded-t-2xl bg-white z-50 p-6 shadow-xl"
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100"
                            aria-label="Close drawer"
                        >
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 14 14"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="text-gray-600"
                            >
                                <path
                                    d="M12 2L2 12"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M12 12L2 2"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>

                        <AccountMenu user={user}/>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
