"use client";

import Link from "next/link";
import { Medal } from "lucide-react";
import { StravaWidget } from "@/components/dashboard/StravaWidget";

export function Sidebar() {
    return (
        <aside className="w-[380px] max-lg:hidden flex flex-col h-screen fixed top-0 left-0 bg-brand-surface border-r border-brand-surface-light overflow-y-auto z-40">
            <div className="p-6 flex-shrink-0">
                <Link href="/" className="flex items-center gap-3">
                    <Medal className="w-8 h-8 text-brand-lime" />
                    <span className="text-2xl font-bold tracking-tighter text-foreground">Vite<span className="text-cyber">Run</span></span>
                </Link>
            </div>

            <div className="flex-1 px-4 mt-2 mb-6">
                <StravaWidget />
            </div>
        </aside>
    );
}
