"use client";

import { useUserStore } from "@/store/useUserStore";
import { Info, Footprints, Zap, Flame, Mountain, ActivitySquare } from "lucide-react";

type CategoryType = "daily" | "speed" | "race" | "trail";

const CATEGORY_META: Record<CategoryType, { label: string, color: string, icon: React.FC<any>, maxDistance: number, desc: string }> = {
    daily: { label: "Daily Trainer", color: "text-blue-400 bg-blue-400/10 border-blue-400/30", icon: Footprints, maxDistance: 800000, desc: "Built for durability." },
    speed: { label: "Speed/Tempo", color: "text-orange-400 bg-orange-400/10 border-orange-400/30", icon: Zap, maxDistance: 500000, desc: "Loses pop around 500km." },
    race: { label: "Race Day", color: "text-brand-lime bg-brand-lime/10 border-brand-lime/30", icon: Flame, maxDistance: 300000, desc: "Carbon plates die fast!" },
    trail: { label: "Trail", color: "text-green-600 bg-green-600/10 border-green-600/30", icon: Mountain, maxDistance: 600000, desc: "Lugs wear down natively." },
};

export function ShoeMileageWidget() {
    const { stravaConnected, stravaShoes, shoeCategories, setShoeCategory } = useUserStore();

    if (!stravaConnected) {
        return null; // Strava generic widget handles the CTA
    }

    return (
        <div className="bg-brand-surface border border-brand-surface-light hover:border-brand-lime/50 transition-colors rounded-2xl p-6 flex flex-col gap-4 shadow-lg shadow-black/20 group h-full">
            <h3 className="text-brand-lime font-mono text-sm tracking-wider flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></span>
                    SHOE ROTATION
                </div>
                <ActivitySquare className="w-4 h-4 text-gray-500 opacity-50 group-hover:opacity-100 transition-opacity" />
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
                <div className="flex-1 flex flex-col gap-5">
                    {stravaShoes.map((shoe) => {
                        const category = shoeCategories?.[shoe.id] || "daily";
                        const meta = CATEGORY_META[category];
                        
                        const distanceKm = shoe.distance / 1000;
                        const percentage = Math.min((shoe.distance / meta.maxDistance) * 100, 100);
                        
                        // Color scale: Green -> Yellow -> Orange -> Red
                        let progressColor = "bg-green-400 shadow-[0_0_8px_#4ade80]";
                        if (percentage > 85) progressColor = "bg-red-500 shadow-[0_0_8px_#ef4444]";
                        else if (percentage > 70) progressColor = "bg-orange-400 shadow-[0_0_8px_#fb923c]";
                        else if (percentage > 50) progressColor = "bg-yellow-400 shadow-[0_0_8px_#facc15]";

                        return (
                            <div key={shoe.id} className="flex flex-col gap-2 relative bg-brand-midnight/40 p-3 rounded-xl border border-brand-surface-light hover:border-brand-lime/30 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-foreground truncate max-w-[140px] sm:max-w-[180px]" title={shoe.name}>
                                                {shoe.name}
                                            </span>
                                            {shoe.primary && (
                                                <span className="bg-[#FC4C02]/20 text-[#FC4C02] text-[9px] uppercase font-bold px-1.5 py-0.5 rounded tracking-wider">
                                                    Primary
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <select 
                                                value={category}
                                                onChange={(e) => setShoeCategory(shoe.id, e.target.value as CategoryType)}
                                                className={`text-[10px] uppercase font-bold tracking-wider rounded-md px-1.5 py-0.5 border outline-none cursor-pointer hover:opacity-80 transition-opacity ${meta.color} bg-transparent appearance-none text-center`}
                                            >
                                                <option value="daily" className="bg-brand-midnight text-gray-300">Daily</option>
                                                <option value="speed" className="bg-brand-midnight text-gray-300">Speed</option>
                                                <option value="race" className="bg-brand-midnight text-gray-300">Race</option>
                                                <option value="trail" className="bg-brand-midnight text-gray-300">Trail</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="font-mono text-foreground font-black tracking-tight shrink-0">
                                            {distanceKm.toFixed(1)} <span className="text-gray-500 text-xs">km</span>
                                        </span>
                                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">
                                            / {meta.maxDistance / 1000}km Limit
                                        </span>
                                    </div>
                                </div>
                                <div className="h-1.5 w-full bg-brand-midnight/80 rounded-full overflow-hidden border border-brand-surface-light mt-1">
                                    <div 
                                        className={`h-full rounded-full ${progressColor} transition-all duration-1000 ease-in-out`} 
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                {percentage > 85 ? (
                                    <p className="text-[10px] font-bold text-red-400 flex items-center gap-1 mt-0.5 uppercase tracking-wider">
                                        <Info className="w-3 h-3" /> RETIRE SOON: {meta.desc}
                                    </p>
                                ) : (
                                    <p className="text-[10px] font-bold text-gray-600 flex items-center gap-1 mt-0.5 uppercase tracking-wider">
                                        {meta.desc}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
