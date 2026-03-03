"use client";

import { useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { Activity } from "lucide-react";

export function HRZoneGenerator() {
    const { age, restingHR, maxHR, updateField } = useUserStore();
    const [useCustomMax, setUseCustomMax] = useState(!!maxHR && maxHR > 0);

    // Karvonen Formula calculates zones based on Heart Rate Reserve (HRR)
    // HRR = Max HR - Resting HR
    // Target HR = (HRR * %Intensity) + Resting HR

    const calculateZones = () => {
        const defaultMaxHr = age ? 220 - Number(age) : 190; // Fallback to 190 if no age
        const effectiveMaxHr = useCustomMax && maxHR ? Number(maxHR) : defaultMaxHr;
        const effectiveRestHr = restingHR ? Number(restingHR) : 60; // Fallback to 60 if no rest HR provided

        // Heart Rate Reserve
        const hrr = effectiveMaxHr - effectiveRestHr;

        // Define standard 5 zones based on Karvonen percentages
        const zones = [
            { name: "Zone 1 (Recovery)", minPct: 0.50, maxPct: 0.60, color: "bg-blue-500/20 text-blue-400 border-blue-500/30", description: "Very light, easy effort" },
            { name: "Zone 2 (Aerobic)", minPct: 0.60, maxPct: 0.70, color: "bg-brand-lime/20 text-brand-lime border-brand-lime/30", description: "Conversational pace, fat burning" },
            { name: "Zone 3 (Tempo)", minPct: 0.70, maxPct: 0.80, color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", description: "Moderate effort, comfortably hard" },
            { name: "Zone 4 (Threshold)", minPct: 0.80, maxPct: 0.90, color: "bg-orange-500/20 text-orange-400 border-orange-500/30", description: "Hard effort, improving lactate threshold" },
            { name: "Zone 5 (VO2 Max)", minPct: 0.90, maxPct: 1.00, color: "bg-red-500/20 text-red-400 border-red-500/30", description: "Maximum effort, very hard breathing" },
        ];

        return zones.map(z => ({
            ...z,
            minBpm: Math.round((hrr * z.minPct) + effectiveRestHr),
            maxBpm: Math.round((hrr * z.maxPct) + effectiveRestHr),
        }));
    };

    const calculatedZones = calculateZones();

    return (
        <div className="bg-brand-surface rounded-2xl border border-brand-surface-light p-6 overflow-hidden relative">
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-red-500/10 blur-[100px] pointer-events-none rounded-full" />

            <div className="flex flex-col mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-surface-light rounded-lg text-red-400">
                        <Activity className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight">HR Zones (Karvonen)</h2>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                    Calculates your training zones using Heart Rate Reserve for more personalized targets.
                </p>
            </div>

            <div className="space-y-6">
                {/* INPUTS ROW */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Age</label>
                        <input
                            type="number"
                            value={age}
                            onChange={(e) => updateField("age", e.target.value ? parseFloat(e.target.value) : "")}
                            className="w-full bg-brand-midnight rounded-xl border border-brand-surface-light px-4 py-2.5 text-white outline-none focus:border-brand-lime transition-colors"
                            placeholder="Years"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Resting HR</label>
                        <input
                            type="number"
                            value={restingHR}
                            onChange={(e) => updateField("restingHR", e.target.value ? parseFloat(e.target.value) : "")}
                            className="w-full bg-brand-midnight rounded-xl border border-brand-surface-light px-4 py-2.5 text-white outline-none focus:border-red-400 transition-colors"
                            placeholder="bpm"
                        />
                    </div>
                    <div className="col-span-2 lg:col-span-1">
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-400">Max HR</label>
                            <button
                                onClick={() => setUseCustomMax(!useCustomMax)}
                                className="text-[10px] text-gray-500 hover:text-white uppercase font-bold tracking-wider"
                            >
                                {useCustomMax ? "Use Age Formula" : "Enter Custom"}
                            </button>
                        </div>

                        {useCustomMax ? (
                            <input
                                type="number"
                                value={maxHR}
                                onChange={(e) => updateField("maxHR", e.target.value ? parseFloat(e.target.value) : "")}
                                className="w-full bg-brand-midnight rounded-xl border border-brand-surface-light px-4 py-2.5 text-white outline-none focus:border-red-400 transition-colors"
                                placeholder="Max bpm"
                            />
                        ) : (
                            <div className="w-full bg-brand-midnight rounded-xl border border-brand-surface-light px-4 py-2.5 flex items-center justify-between opacity-50">
                                <span className="text-gray-400 text-sm">Est: {age ? 220 - Number(age) : 190} bpm</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* ZONES OUTPUT */}
                <div className="space-y-3 pt-4 border-t border-brand-surface-light">
                    {calculatedZones.map((zone, idx) => (
                        <div key={idx} className={`flex items-center justify-between p-3 rounded-xl border ${zone.color} bg-brand-midnight relative overflow-hidden`}>
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-current opacity-50" />
                            <div className="flex flex-col ml-2">
                                <span className="text-sm font-bold">{zone.name}</span>
                                <span className="text-xs opacity-75 hidden sm:block">{zone.description}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-sm md:text-base font-black tracking-tight font-mono">{zone.minBpm} - {zone.maxBpm}</span>
                                <span className="text-[10px] uppercase font-bold tracking-wider opacity-60 block">bpm</span>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
