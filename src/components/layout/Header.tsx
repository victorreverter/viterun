import { Bell, Menu, Search } from "lucide-react";

export function Header() {
    return (
        <header className="h-20 border-b border-brand-surface-light bg-brand-midnight/80 backdrop-blur-md sticky top-0 z-50 flex flex-col justify-center px-8 max-lg:px-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-brand-surface-light">
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="relative max-md:hidden">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search features..."
                            className="bg-brand-surface border border-brand-surface-light rounded-full pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-lime focus:ring-1 focus:ring-brand-lime transition-all w-64"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 max-sm:hidden">
                        <div className="px-3 py-1 bg-brand-surface rounded-lg border border-brand-surface-light flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-brand-lime shadow-[0_0_8px_#CCFF00]"></span>
                            <span className="text-xs font-mono text-gray-300">SYNCED</span>
                        </div>
                    </div>

                    <button className="relative p-2 text-gray-400 hover:text-white rounded-full hover:bg-brand-surface-light transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-lime"></span>
                    </button>

                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-lime to-cyan-400 p-[2px]">
                        <div className="w-full h-full rounded-full bg-brand-surface border-2 border-brand-midnight overflow-hidden">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Runner&backgroundColor=1A1A1A" alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
