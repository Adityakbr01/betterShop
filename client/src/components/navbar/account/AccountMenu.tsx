"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CiUser } from "react-icons/ci";
import { CONFIG } from "@/config/_config";

export function AccountMenu({ user }: { user: any }) {

    return (
        <div>
            {/* Header */}
            <header className="mb-4">
                <h2 className="text-lg font-semibold">Account</h2>
            </header>

            {/* Sign in */}
            {!user &&(
                <div className="mb-4">
                    <Link href={CONFIG.CONSTANT.ROUTES.SIGNIN}>
                        <Button className="w-full">Sign In</Button>
                    </Link>
                </div>
            )}

            {/* Nav links */}
            <nav>
                <ul className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                    <li className="w-full">
                        <Link
                            href="/orders"
                            className="flex w-full items-center gap-2 px-3 py-2 rounded-md border bg-gray-100 hover:bg-gray-200 transition"
                        >
                            {/* Orders Icon */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="none"
                                className="h-5 w-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    d="M2.929 7.705c0-.482.154-.95.44-1.338L5.06 4.08c.303-.41.783-.652 1.293-.652h7.42c.525 0 1.018.257 1.319.69l1.577 2.266c.262.377.403.826.403 1.285v8.294c0 .888-.72 1.608-1.608 1.608H4.536c-.888 0-1.607-.72-1.607-1.608V7.705Z"
                                />
                                <path
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    d="M2.929 6.965h14.143M10 3.428v3.535M6.143 14.035v-2.571c0-.178.143-.321.321-.321h3.857c.178 0 .322.143.322.321v2.571a.321.321 0 0 1-.322.322H6.464a.321.321 0 0 1-.321-.322Z"
                                />
                            </svg>
                            Orders
                        </Link>
                    </li>
                    <li className="w-full">
                        <Link
                            href="/profile"
                            className="flex items-center gap-2 px-3 py-2 rounded-md border bg-gray-100 hover:bg-gray-200 transition"
                        >
                            <CiUser size={20} />
                            Profile
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
