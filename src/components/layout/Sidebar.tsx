import Link from "next/link";
import { Activity, Timer, TrendingUp, User, Medal } from "lucide-react";

export function Sidebar() {
    return (
        <aside className="w-64 max-lg:hidden flex flex-col h-screen fixed top-0 left-0 bg-brand-surface border-r border-brand-surface-light">
            <div className="p-6">
                <Link href="/" className="flex items-center gap-3">
                    <Medal className="w-8 h-8 text-brand-lime" />
                    <span className="text-2xl font-bold tracking-tighter text-white">Vite<span className="text-cyber">Run</span></span>
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-surface-light text-brand-lime font-medium transition-colors">
                    <Activity className="w-5 h-5" />
                    Dashboard
                </Link>
                <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-brand-surface-light transition-colors">
                    <Timer className="w-5 h-5" />
                    Calculators
                </Link>
                <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-brand-surface-light transition-colors">
                    <TrendingUp className="w-5 h-5" />
                    Predictions
                </Link>
                <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-brand-surface-light transition-colors">
                    <User className="w-5 h-5" />
                    Physiology Lab
                </Link>
            </nav>
        </aside>
    );
}
