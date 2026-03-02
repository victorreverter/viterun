"use client";

import { useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { Timer, TrendingUp } from "lucide-react";

export function PacePredictor() {
    const { baselineDistance, baselineTime, updateField } = useUserStore();

    const [distance, setDistance] = useState("10");
    const [unit, setUnit] = useState<"km" | "mi">("km");

    const [hours, setHours] = useState("0");
    const [minutes, setMinutes] = useState("50");
    const [seconds, setSeconds] = useState("0");

    const [activeTab, setActiveTab] = useState<"pace" | "predictor">("pace");

    // --- Pace Calculator Logic ---
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

    // --- Race Predictor Logic ---
    const calculatePrediction = () => {
        if (!baselineDistance || !baselineTime) return "--:--:--";
        const d1 = Number(baselineDistance);
        const t1 = Number(baselineTime);
        if (d1 <= 0 || t1 <= 0) return "--:--:--";

        const d2 = 42.195; // Full marathon in km
        const t2 = t1 * Math.pow(d2 / d1, 1.06);

        const formatTime = (mins: number) => {
            const h = Math.floor(mins / 60);
            const m = Math.floor(mins % 60);
            const s = Math.floor((mins * 60) % 60);
            return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
        };

        return formatTime(t2);
    };

    const prediction = calculatePrediction();

    return (
        <div className="bg-brand-surface rounded-2xl border border-brand-surface-light p-6 overflow-hidden relative col-span-1 md:col-span-2 lg:col-span-2">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-lime opacity-5 blur-[120px] pointer-events-none rounded-full" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-surface-light rounded-lg text-brand-lime">
                        {activeTab === 'pace' ? <Timer className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                    </div>
                    <h2 className="text-xl font-bold tracking-tight">Runner&apos;s Math</h2>
                </div>

                <div className="flex bg-brand-midnight rounded-xl p-1 border border-brand-surface-light">
                    <button
                        onClick={() => setActiveTab("pace")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "pace" ? "bg-brand-lime text-black" : "text-gray-400 hover:text-white"
                            }`}
                    >
                        Pace Calculator
                    </button>
                    <button
                        onClick={() => setActiveTab("predictor")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "predictor" ? "bg-brand-lime text-black" : "text-gray-400 hover:text-white"
                            }`}
                    >
                        Race Predictor
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* --- LEFT COLUMN: INPUTS --- */}
                <div className="space-y-5">
                    {activeTab === "pace" && (
                        <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                            <div className="mb-4 text-sm text-gray-400 bg-brand-midnight p-3 rounded-lg border border-brand-surface-light">
                                Simple math to find your required pace splits for a target distance and time.
                            </div>
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
                                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${unit === "km" ? "bg-brand-surface-light text-white" : "text-gray-400 hover:text-white"
                                                }`}
                                        >
                                            km
                                        </button>
                                        <button
                                            onClick={() => setUnit("mi")}
                                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${unit === "mi" ? "bg-brand-surface-light text-white" : "text-gray-400 hover:text-white"
                                                }`}
                                        >
                                            mi
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5">
                                <label className="block text-sm font-medium text-gray-400 mb-2">Goal Time (HH:MM:SS)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={hours}
                                        onChange={(e) => setHours(e.target.value)}
                                        className="w-1/3 bg-brand-midnight rounded-xl border border-brand-surface-light px-4 py-3 text-white outline-none text-center focus:border-brand-lime transition-colors"
                                        placeholder="HH"
                                    />
                                    <span className="text-xl font-bold text-gray-600 flex items-center">:</span>
                                    <input
                                        type="number"
                                        value={minutes}
                                        onChange={(e) => setMinutes(e.target.value)}
                                        className="w-1/3 bg-brand-midnight rounded-xl border border-brand-surface-light px-4 py-3 text-white outline-none text-center focus:border-brand-lime transition-colors"
                                        placeholder="MM"
                                    />
                                    <span className="text-xl font-bold text-gray-600 flex items-center">:</span>
                                    <input
                                        type="number"
                                        value={seconds}
                                        onChange={(e) => setSeconds(e.target.value)}
                                        className="w-1/3 bg-brand-midnight rounded-xl border border-brand-surface-light px-4 py-3 text-white outline-none text-center focus:border-brand-lime transition-colors"
                                        placeholder="SS"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "predictor" && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="mb-4 text-sm text-gray-400 bg-brand-midnight p-3 rounded-lg border border-brand-surface-light">
                                Forecasts your marathon finish time using the <strong>Riegel Formula</strong>, accounting for physiological decay over longer distances.
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Recent Race Distance</label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => updateField("baselineDistance", 5)}
                                        className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors border ${baselineDistance === 5 ? "bg-brand-lime text-black border-brand-lime" : "bg-brand-midnight text-gray-400 border-brand-surface-light hover:text-white"
                                            }`}
                                    >
                                        5K
                                    </button>
                                    <button
                                        onClick={() => updateField("baselineDistance", 10)}
                                        className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors border ${baselineDistance === 10 ? "bg-brand-lime text-black border-brand-lime" : "bg-brand-midnight text-gray-400 border-brand-surface-light hover:text-white"
                                            }`}
                                    >
                                        10K
                                    </button>
                                    <button
                                        onClick={() => updateField("baselineDistance", 21.0975)}
                                        className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors border ${baselineDistance === 21.0975 ? "bg-brand-lime text-black border-brand-lime" : "bg-brand-midnight text-gray-400 border-brand-surface-light hover:text-white"
                                            }`}
                                    >
                                        Half
                                    </button>
                                    <input
                                        type="number"
                                        value={baselineDistance}
                                        onChange={(e) => updateField("baselineDistance", e.target.value ? parseFloat(e.target.value) : "")}
                                        className="w-20 bg-brand-midnight rounded-xl border border-brand-surface-light px-3 py-2 text-white outline-none focus:border-brand-lime text-center transition-colors"
                                        placeholder="km"
                                    />
                                </div>
                            </div>

                            <div className="mt-5">
                                <label className="block text-sm font-medium text-gray-400 mb-2">Completion Time (Minutes)</label>
                                <input
                                    type="number"
                                    value={baselineTime}
                                    onChange={(e) => updateField("baselineTime", e.target.value ? parseFloat(e.target.value) : "")}
                                    className="w-full bg-brand-midnight rounded-xl border border-brand-surface-light px-4 py-3 text-white outline-none focus:border-brand-lime transition-colors"
                                    placeholder="e.g. 50"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* --- RIGHT COLUMN: OUTPUTS --- */}
                <div className="flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-brand-surface-light pt-8 lg:pt-0 lg:pl-8">
                    {activeTab === "pace" && (
                        <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-500">
                            <div className="bg-brand-midnight rounded-xl p-6 flex flex-col items-center justify-center border border-brand-surface-light h-40 group hover:border-brand-lime/50 transition-colors">
                                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">Per KM</span>
                                <span className="text-3xl font-bold tracking-tighter text-cyber">{paces.perKm}</span>
                            </div>
                            <div className="bg-brand-midnight rounded-xl p-6 flex flex-col items-center justify-center border border-brand-surface-light h-40 group hover:border-brand-lime/50 transition-colors">
                                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">Per Mi</span>
                                <span className="text-3xl font-bold tracking-tighter">{paces.perMi}</span>
                            </div>
                        </div>
                    )}

                    {activeTab === "predictor" && (
                        <div className="text-center animate-in fade-in duration-500 flex flex-col items-center justify-center h-full min-h-[160px]">
                            <span className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-4 block">Predicted Marathon Finish</span>
                            <div className="inline-block relative">
                                <span className="text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-cyber drop-shadow-[0_0_15px_rgba(204,255,0,0.3)]">
                                    {prediction}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
