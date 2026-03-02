"use client";

import { useState } from "react";
import { Timer } from "lucide-react";

export function PaceCalculator() {
    const [distance, setDistance] = useState("10"); // Default 10
    const [unit, setUnit] = useState<"km" | "mi">("km");

    const [hours, setHours] = useState("0");
    const [minutes, setMinutes] = useState("50");
    const [seconds, setSeconds] = useState("0");

    const calculatePaces = () => {
        const distNum = parseFloat(distance);
        const h = parseInt(hours) || 0;
        const m = parseInt(minutes) || 0;
        const s = parseInt(seconds) || 0;

        const totalSeconds = h * 3600 + m * 60 + s;

        if (!distNum || totalSeconds <= 0) {
            return { perKm: "--:--", perMi: "--:--" };
        }

        const distInKm = unit === "km" ? distNum : distNum * 1.60934;
        const distInMi = unit === "mi" ? distNum : distNum * 0.621371;

        const formatPace = (secsPerDist: number) => {
            const paceMins = Math.floor(secsPerDist / 60);
            const paceSecs = Math.floor(secsPerDist % 60);
            return `${paceMins}:${paceSecs.toString().padStart(2, "0")}`;
        };

        return {
            perKm: formatPace(totalSeconds / distInKm),
            perMi: formatPace(totalSeconds / distInMi),
        };
    };

    const paces = calculatePaces();

    return (
        <div className="bg-brand-surface rounded-2xl border border-brand-surface-light p-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-lime opacity-5 blur-[100px] pointer-events-none rounded-full" />

            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-brand-surface-light rounded-lg text-brand-lime">
                    <Timer className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight">Pace Calculator</h2>
            </div>

            <div className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Distance</label>
                    <div className="flex bg-brand-midnight rounded-xl border border-brand-surface-light p-1">
                        <input
                            type="number"
                            value={distance}
                            onChange={(e) => setDistance(e.target.value)}
                            className="flex-1 bg-transparent px-3 py-2 text-white outline-none"
                            placeholder="e.g. 10"
                        />
                        <div className="flex bg-brand-surface rounded-lg p-1">
                            <button
                                onClick={() => setUnit("km")}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${unit === "km" ? "bg-brand-lime text-black" : "text-gray-400 hover:text-white"
                                    }`}
                            >
                                km
                            </button>
                            <button
                                onClick={() => setUnit("mi")}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${unit === "mi" ? "bg-brand-lime text-black" : "text-gray-400 hover:text-white"
                                    }`}
                            >
                                mi
                            </button>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Time (HH:MM:SS)</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            value={hours}
                            onChange={(e) => setHours(e.target.value)}
                            className="w-1/3 bg-brand-midnight rounded-xl border border-brand-surface-light px-4 py-3 text-white outline-none text-center focus:border-brand-lime"
                            placeholder="HH"
                        />
                        <span className="text-xl font-bold text-gray-600 flex items-center">:</span>
                        <input
                            type="number"
                            value={minutes}
                            onChange={(e) => setMinutes(e.target.value)}
                            className="w-1/3 bg-brand-midnight rounded-xl border border-brand-surface-light px-4 py-3 text-white outline-none text-center focus:border-brand-lime"
                            placeholder="MM"
                        />
                        <span className="text-xl font-bold text-gray-600 flex items-center">:</span>
                        <input
                            type="number"
                            value={seconds}
                            onChange={(e) => setSeconds(e.target.value)}
                            className="w-1/3 bg-brand-midnight rounded-xl border border-brand-surface-light px-4 py-3 text-white outline-none text-center focus:border-brand-lime"
                            placeholder="SS"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-brand-surface-light">
                    <div className="bg-brand-midnight rounded-xl p-4 flex flex-col items-center justify-center border border-brand-surface-light">
                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Per KM</span>
                        <span className="text-2xl font-bold tracking-tighter text-cyber">{paces.perKm}</span>
                    </div>
                    <div className="bg-brand-midnight rounded-xl p-4 flex flex-col items-center justify-center border border-brand-surface-light">
                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Per Mi</span>
                        <span className="text-2xl font-bold tracking-tighter">{paces.perMi}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
