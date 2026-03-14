"use client";

import { useUserStore } from "@/store/useUserStore";

export function NextRaceWidget() {
    const { nextRaceName, nextRaceDate, updateField } = useUserStore();

    // Math for countdown
    const getDaysRemaining = () => {
        if (!nextRaceDate) return null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const target = new Date(nextRaceDate);
        const diffTime = target.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const daysRemaining = getDaysRemaining();
    const isPast = daysRemaining !== null && daysRemaining < 0;

    return (
        <div className="bg-brand-surface border border-brand-surface-light hover:border-brand-lime/50 transition-colors rounded-2xl p-6 flex flex-col gap-4 shadow-lg shadow-black/20 relative overflow-hidden">
            {/* Glow effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-lime/5 blur-[50px] pointer-events-none rounded-full" />
            
            <h3 className="text-brand-lime font-mono text-sm tracking-wider flex items-center justify-between gap-2 z-10">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-lime shadow-[0_0_8px_#CCFF00]"></span>
                    NEXT RACE TARGET
                </div>
            </h3>

            {/* Inputs always visible at the top */}
            <div className="flex flex-col gap-3 z-10">
                <input
                    type="text"
                    value={nextRaceName}
                    onChange={(e) => updateField("nextRaceName", e.target.value)}
                    placeholder="Race Name (e.g. Valencia)"
                    className="w-full bg-brand-midnight rounded-lg border border-brand-surface-light px-3 py-2 text-white text-sm outline-none focus:border-brand-lime transition-colors"
                />
                <input
                    type="date"
                    value={nextRaceDate}
                    onChange={(e) => updateField("nextRaceDate", e.target.value)}
                    className="w-full bg-brand-midnight rounded-lg border border-brand-surface-light px-3 py-2 text-gray-400 text-sm outline-none focus:border-brand-lime transition-colors [color-scheme:dark]"
                />
            </div>

            {/* Countdown Display Below */}
            {daysRemaining !== null ? (
                <div className="flex-1 flex flex-col justify-center pt-2 z-10 border-t border-brand-surface-light mt-2">
                    {isPast ? (
                        <>
                            <div className="text-4xl font-bold text-gray-500 mb-1 font-mono tabular-nums tracking-tighter">
                                DONE
                            </div>
                            <p className="text-gray-400 text-sm font-medium tracking-tight">
                                {nextRaceName || "Race"} has finished!
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="text-5xl font-bold text-white mb-0 font-mono tabular-nums tracking-tighter leading-none">
                                {daysRemaining}
                                <span className="text-2xl text-gray-500 ml-2 font-sans tracking-normal">days</span>
                            </div>
                            <p className="text-brand-lime text-sm font-medium tracking-tight mt-2">
                                Until {nextRaceName || "Race Day"}
                            </p>
                        </>
                    )}
                </div>
            ) : (
                <div className="flex-1 flex flex-col justify-center pt-2 z-10 border-t border-brand-surface-light mt-2">
                    <div className="text-3xl font-bold text-gray-500 mb-1 font-mono">TBD</div>
                    <p className="text-gray-400 text-xs leading-relaxed">Select a future date above to begin your countdown.</p>
                </div>
            )}
        </div>
    );
}
