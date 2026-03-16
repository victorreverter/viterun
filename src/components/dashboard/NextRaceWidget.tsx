"use client";

import { useUserStore } from "@/store/useUserStore";
import { Flag, CalendarDays } from "lucide-react";
import { CustomDatePicker } from "@/components/ui/CustomDatePicker";

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
        <div className="bg-brand-surface border border-brand-surface-light hover:border-brand-lime/50 transition-colors rounded-2xl p-6 flex flex-col gap-4 shadow-lg shadow-black/20 relative">
            {/* Glow effect */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-lime/5 blur-[50px] rounded-full" />
            </div>
            
            <h3 className="text-brand-lime font-mono text-sm tracking-wider flex items-center justify-between gap-2 z-10">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-lime shadow-[0_0_8px_#CCFF00]"></span>
                    NEXT RACE TARGET
                </div>
            </h3>

            {/* Inputs always visible at the top */}
            <div className="flex flex-col gap-3 z-50 w-full relative">
                <div className="relative group w-full">
                    <Flag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-lime transition-colors z-10 pointer-events-none" />
                    <input
                        type="text"
                        value={nextRaceName}
                        onChange={(e) => updateField("nextRaceName", e.target.value)}
                        placeholder="Race Name (e.g. Valencia)"
                        className="w-full bg-brand-midnight/50 hover:bg-brand-midnight rounded-xl border border-brand-surface-light px-3 py-2.5 pl-10 text-foreground text-sm outline-none focus:border-brand-lime transition-all"
                    />
                </div>
                
                <CustomDatePicker 
                    value={nextRaceDate} 
                    onChange={(date: string) => updateField("nextRaceDate", date)} 
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
                            <div className="text-5xl font-bold text-foreground mb-0 font-mono tabular-nums tracking-tighter leading-none">
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
