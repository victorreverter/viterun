"use client";

import { Menu, Search, Sun, Moon } from "lucide-react";
import { useSearchStore } from "@/store/useSearchStore";
import { useUserStore } from "@/store/useUserStore";

export function Header() {
    const { query, setQuery } = useSearchStore();
    const { theme, toggleTheme } = useUserStore();

    return (
        <header className="h-20 border-b border-brand-surface-light bg-brand-midnight/80 backdrop-blur-md sticky top-0 z-50 flex flex-col justify-center px-8 max-lg:px-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button className="lg:hidden p-2 text-gray-400 hover:text-foreground rounded-lg hover:bg-brand-surface-light">
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="relative max-md:hidden">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search features..."
                            className="bg-brand-surface border border-brand-surface-light rounded-full pl-10 pr-4 py-2 text-sm text-foreground placeholder-gray-500 focus:outline-none focus:border-brand-lime focus:ring-1 focus:ring-brand-lime transition-all w-64"
                        />
                    </div>
                </div>

                    <div className="flex items-center gap-4">
                        <button 
                            onClick={toggleTheme}
                            className="p-2 text-gray-400 hover:text-foreground rounded-lg hover:bg-brand-surface-light transition-colors"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        
                        <div className="flex items-center gap-2 max-sm:hidden">
                            <div className="flex flex-col items-end gap-1">
                                <div className="px-3 py-1 bg-brand-surface rounded-lg border border-brand-surface-light flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-brand-lime shadow-[0_0_8px_#16A34A] dark:shadow-[0_0_8px_#CCFF00]"></span>
                                    <span className="text-xs font-mono text-gray-500 dark:text-gray-300">SYNCED WITH LOCAL STORAGE</span>
                                </div>
                                <span className="text-[10px] text-gray-500 font-medium">All data stays exclusively on your machine.</span>
                            </div>
                        </div>
                    </div>
            </div>
        </header>
    );
}
