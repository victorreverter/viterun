"use client";

import { useUserStore } from "@/store/useUserStore";
import { Info, Footprints } from "lucide-react";

export function ShoeMileageWidget() {
    const { stravaConnected, stravaShoes } = useUserStore();

    if (!stravaConnected) {
        return null;
    }

    // Default max distance before shoe is "retired" (800km)
    const MAX_SHOE_MILEAGE = 800000;

    return (
        <div className="bg-brand-surface border border-brand-surface-light hover:border-brand-lime/50 transition-colors rounded-2xl p-6 flex flex-col gap-4 shadow-lg shadow-black/20">
            <h3 className="text-brand-lime font-mono text-sm tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></span>
                SHOE MILEAGE
            </h3>

            {!stravaShoes || stravaShoes.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
                    <Footprints className="w-8 h-8 text-gray-600 mb-2" />
                    <p className="text-sm text-gray-400">No shoes found.</p>
                    <p className="text-xs text-gray-500 mt-1">
                        Add your running shoes in the Strava app to track their mileage here.
                    </p>
                </div>
            ) : (
                <div className="flex-1 flex flex-col gap-4">
                    {stravaShoes.map((shoe) => {
                        const distanceKm = shoe.distance / 1000;
                        const percentage = Math.min((shoe.distance / MAX_SHOE_MILEAGE) * 100, 100);
                        
                        // Color scale: Green -> Yellow -> Orange -> Red
                        let progressColor = "bg-green-400 shadow-[0_0_8px_#4ade80]";
                        if (percentage > 85) progressColor = "bg-red-500 shadow-[0_0_8px_#ef4444]";
                        else if (percentage > 70) progressColor = "bg-orange-400 shadow-[0_0_8px_#fb923c]";
                        else if (percentage > 50) progressColor = "bg-yellow-400 shadow-[0_0_8px_#facc15]";

                        return (
                            <div key={shoe.id} className="flex flex-col gap-1.5 group">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-foreground truncate max-w-[150px] sm:max-w-[200px]" title={shoe.name}>
                                            {shoe.name}
                                        </span>
                                        {shoe.primary && (
                                            <span className="bg-[#FC4C02]/20 text-[#FC4C02] text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md tracking-wider">
                                                Primary
                                            </span>
                                        )}
                                    </div>
                                    <span className="font-mono text-foreground font-bold shrink-0">
                                        {distanceKm.toFixed(1)} <span className="text-gray-500 text-xs">km</span>
                                    </span>
                                </div>
                                <div className="h-2 w-full bg-brand-midnight/50 rounded-full overflow-hidden border border-brand-surface-light group-hover:border-brand-surface-light/80 transition-colors">
                                    <div 
                                        className={`h-full rounded-full ${progressColor} transition-all duration-1000 ease-in-out`} 
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                {percentage > 85 && (
                                    <p className="text-[10px] text-red-400 flex items-center gap-1 mt-0.5 animate-pulse">
                                        <Info className="w-3 h-3" /> Approaching replacement mileage.
                                    </p>
                                )}
                            </div>
                        );
                    })}
                    <div className="mt-2 text-[10px] text-gray-500 flex items-start gap-1.5 bg-brand-midnight/30 p-2 rounded-lg border border-brand-surface-light">
                        <Info className="w-3 h-3 shrink-0 mt-0.5" />
                        <p>Mileage progress is based on a standard lifetime of 800km. If you have synchronized today, refresh page to see the changes.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
