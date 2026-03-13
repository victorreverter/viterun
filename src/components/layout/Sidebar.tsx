"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Timer, TrendingUp, User, Medal } from "lucide-react";
import { clsx } from "clsx";

export function Sidebar() {
    const pathname = usePathname();

    const links = [
        { href: "/", label: "Dashboard", icon: Activity },
        { href: "/calculators", label: "Calculators", icon: Timer },
        { href: "/predictions", label: "Predictions", icon: TrendingUp },
        { href: "/physiology", label: "Physiology Lab", icon: User },
    ];

    return (
        <aside className="w-64 max-lg:hidden flex flex-col h-screen fixed top-0 left-0 bg-brand-surface border-r border-brand-surface-light">
            <div className="p-6">
                <Link href="/" className="flex items-center gap-3">
                    <Medal className="w-8 h-8 text-brand-lime" />
                    <span className="text-2xl font-bold tracking-tighter text-white">Vite<span className="text-cyber">Run</span></span>
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    const Icon = link.icon;
                    return (
                        <Link 
                            key={link.href}
                            href={link.href} 
                            className={clsx(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium",
                                isActive 
                                    ? "bg-brand-surface-light text-brand-lime" 
                                    : "text-gray-400 hover:text-white hover:bg-brand-surface-light"
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            {link.label}
                        </Link>
                    )
                })}
            </nav>
        </aside>
    );
}
