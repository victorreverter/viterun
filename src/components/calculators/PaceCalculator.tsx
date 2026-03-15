"use client";

import { useState } from "react";
import { Timer, Check } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";

export function PaceCalculator() {
    const { updateField } = useUserStore();
    const [savedPace, setSavedPace] = useState<string | null>(null);

    const handleSavePace = (pace: string) => {
        updateField("targetPace", pace);
        setSavedPace(pace);
        setTimeout(() => setSavedPace(null), 2000);
    };

    const [activeTab, setActiveTab] = useState<"pace" | "time">("pace");

    const [distance, setDistance] = useState("10");
    const [unit, setUnit] = useState<"km" | "mi">("km");

    // Time inputs
    const [hours, setHours] = useState("0");
    const [minutes, setMinutes] = useState("50");
    const [seconds, setSeconds] = useState("0");

    // Pace inputs
    const [paceMinutes, setPaceMinutes] = useState("5");
    const [paceSeconds, setPaceSeconds] = useState("0");
    const [paceUnit, setPaceUnit] = useState<"km" | "mi">("km");

    // --- Calculate Paces (Given Distance & Time) ---
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

    // --- Calculate Time (Given Distance & Pace) ---
    const calculateTime = () => {
        const distNum = parseFloat(distance);
        const pm = parseInt(paceMinutes) || 0;
        const ps = parseInt(paceSeconds) || 0;

        const totalPaceSeconds = pm * 60 + ps;

        if (!distNum || totalPaceSeconds <= 0) {
            return "--:--:--";
        }

        let distInPaceUnit = distNum;
        if (unit === "km" && paceUnit === "mi") {
            // Input is km, Pace is mi. We need distance in mi.
            distInPaceUnit = distNum * 0.621371;
        } else if (unit === "mi" && paceUnit === "km") {
            // Input is mi, Pace is km. We need distance in km.
            distInPaceUnit = distNum * 1.60934;
        }

        const totalSeconds = distInPaceUnit * totalPaceSeconds;

        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = Math.floor(totalSeconds % 60);

        if (h > 0) {
            return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
        }
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    const paces = calculatePaces();
    const calculatedTime = calculateTime();

    return (
        <div id="pace-calculator" className="bg-brand-surface rounded-2xl border border-brand-surface-light p-6 overflow-hidden relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-surface-light rounded-lg text-brand-lime">
                        <Timer className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight">Pace Calculator</h2>
                </div>

                <div className="flex bg-brand-midnight rounded-xl p-1 border border-brand-surface-light">
                    <button
                        onClick={() => setActiveTab("pace")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeTab === "pace" ? "bg-brand-lime text-black" : "text-gray-400 hover:text-white"
                            }`}
                    >
                        Find Pace
                    </button>
                    <button
                        onClick={() => setActiveTab("time")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeTab === "time" ? "bg-brand-lime text-black" : "text-gray-400 hover:text-white"
                            }`}
                    >
                        Find Time
                    </button>
                </div>
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

                {activeTab === "pace" && (
                    <div className="animate-in fade-in duration-300">
                        <label className="block text-sm font-medium text-gray-400 mb-2">Target Finish Time</label>
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

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <button
                                onClick={() => handleSavePace(`${paces.perKm}/km`)}
                                className="bg-brand-midnight rounded-xl p-4 flex flex-col items-center justify-center border border-brand-surface-light hover:border-brand-lime transition-colors group relative overflow-hidden"
                            >
                                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2 group-hover:text-brand-lime transition-colors">Required Pace</span>
                                <span className="text-2xl font-bold tracking-tighter text-cyber group-hover:scale-105 transition-transform">{paces.perKm}</span>
                                <span className="text-xs text-gray-500 mt-1">per km</span>
                                {savedPace === `${paces.perKm}/km` && (
                                    <div className="absolute inset-0 bg-brand-lime flex items-center justify-center animate-in fade-in duration-200">
                                        <Check className="w-8 h-8 text-black" />
                                    </div>
                                )}
                            </button>
                            <button
                                onClick={() => handleSavePace(`${paces.perMi}/mi`)}
                                className="bg-brand-midnight rounded-xl p-4 flex flex-col items-center justify-center border border-brand-surface-light hover:border-brand-lime transition-colors group relative overflow-hidden"
                            >
                                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2 group-hover:text-brand-lime transition-colors">Required Pace</span>
                                <span className="text-2xl font-bold tracking-tighter group-hover:scale-105 transition-transform">{paces.perMi}</span>
                                <span className="text-xs text-gray-500 mt-1">per mi</span>
                                {savedPace === `${paces.perMi}/mi` && (
                                    <div className="absolute inset-0 bg-brand-lime flex items-center justify-center animate-in fade-in duration-200">
                                        <Check className="w-8 h-8 text-black" />
                                    </div>
                                )}
                            </button>
                        </div>
                        <p className="text-center text-xs text-brand-lime/80 mt-4 h-4">
                            {savedPace ? "Pace saved to Target Pace widget!" : "Click a pace above to set as Target Pace"}
                        </p>
                    </div>
                )}

                {activeTab === "time" && (
                    <div className="animate-in fade-in duration-300">
                        <label className="block text-sm font-medium text-gray-400 mb-2">Pace (Minutes:Seconds)</label>
                        <div className="flex bg-brand-midnight rounded-xl border border-brand-surface-light p-1 mb-6">
                            <input
                                type="number"
                                value={paceMinutes}
                                onChange={(e) => setPaceMinutes(e.target.value)}
                                className="w-20 bg-transparent px-3 py-2 text-white outline-none text-right"
                                placeholder="MM"
                            />
                            <span className="text-xl font-bold text-gray-600 flex items-baseline pt-1">:</span>
                            <input
                                type="number"
                                value={paceSeconds}
                                onChange={(e) => setPaceSeconds(e.target.value)}
                                className="w-20 bg-transparent px-3 py-2 text-white outline-none text-left"
                                placeholder="SS"
                            />
                            <div className="flex-1 flex justify-end">
                                <div className="flex bg-brand-surface rounded-lg p-1">
                                    <button
                                        onClick={() => setPaceUnit("km")}
                                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${paceUnit === "km" ? "bg-brand-surface-light text-white" : "text-gray-400 hover:text-white"
                                            }`}
                                    >
                                        /km
                                    </button>
                                    <button
                                        onClick={() => setPaceUnit("mi")}
                                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${paceUnit === "mi" ? "bg-brand-surface-light text-white" : "text-gray-400 hover:text-white"
                                            }`}
                                    >
                                        /mi
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-brand-midnight rounded-xl p-4 flex flex-col items-center justify-center border border-brand-surface-light hover:border-brand-lime/50 transition-colors min-h-[142px]">
                            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">Total Time</span>
                            <span className="text-4xl font-bold tracking-tighter text-cyber">{calculatedTime}</span>
                        </div>
                        <div className="mt-4">
                            <button
                                onClick={() => {
                                    const m = parseInt(paceMinutes) || 0;
                                    const s = parseInt(paceSeconds) || 0;
                                    handleSavePace(`${m}:${s.toString().padStart(2, "0")}/${paceUnit}`);
                                }}
                                className="w-full py-3 bg-brand-surface-light hover:bg-white/10 text-white rounded-xl text-sm font-medium transition-colors border border-brand-surface-light flex items-center justify-center gap-2"
                            >
                                {savedPace ? (
                                    <><Check className="w-4 h-4 text-brand-lime" /> Saved to Target Pace</>
                                ) : (
                                    "Save as Target Pace"
                                )}
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
