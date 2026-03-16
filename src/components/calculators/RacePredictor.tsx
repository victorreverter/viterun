"use client";

import { useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { TrendingUp } from "lucide-react";

export function RacePredictor() {
    const { baselineDistance, baselineTime, updateField } = useUserStore();

    const [hours, setHours] = useState(() => Math.floor(Number(baselineTime || 0) / 60).toString());
    const [minutes, setMinutes] = useState(() => Math.floor(Number(baselineTime || 0) % 60).toString());
    const [seconds, setSeconds] = useState(() => Math.round((Number(baselineTime || 0) * 60) % 60).toString());

    const handleTimeChange = (type: "h" | "m" | "s", value: string) => {
        let newH = parseInt(hours) || 0;
        let newM = parseInt(minutes) || 0;
        let newS = parseInt(seconds) || 0;

        if (type === "h") { setHours(value); newH = parseInt(value) || 0; }
        if (type === "m") { setMinutes(value); newM = parseInt(value) || 0; }
        if (type === "s") { setSeconds(value); newS = parseInt(value) || 0; }

        const totalMins = newH * 60 + newM + newS / 60;
        updateField("baselineTime", totalMins > 0 ? totalMins : "");
    };

    const calculatePredictions = () => {
        if (!baselineDistance || !baselineTime) {
            return { p5k: "--:--:--", p10k: "--:--:--", pHalf: "--:--:--", pFull: "--:--:--" };
        }
        const d1 = Number(baselineDistance);
        const t1 = Number(baselineTime);
        if (d1 <= 0 || t1 <= 0) {
            return { p5k: "--:--:--", p10k: "--:--:--", pHalf: "--:--:--", pFull: "--:--:--" };
        }

        const formatTime = (mins: number) => {
            if (mins <= 0) return "--:--:--";
            const h = Math.floor(mins / 60);
            const m = Math.floor(mins % 60);
            const s = Math.floor((mins * 60) % 60);
            if (h > 0) {
                return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
            }
            return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
        };

        const predictForDistance = (d2: number) => {
            if (d1 === d2) return formatTime(t1); // It's the baseline race!
            const t2 = t1 * Math.pow(d2 / d1, 1.06);
            return formatTime(t2);
        };

        return {
            p5k: predictForDistance(5),
            p10k: predictForDistance(10),
            pHalf: predictForDistance(21.0975),
            pFull: predictForDistance(42.195),
        };
    };

    const preds = calculatePredictions();

    return (
        <div className="bg-brand-surface rounded-2xl border border-brand-surface-light p-6 overflow-hidden relative md:col-span-2">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-lime opacity-5 blur-[120px] pointer-events-none rounded-full" />

            <div className="flex flex-col mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-surface-light rounded-lg text-brand-lime">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight">Race Predictor</h2>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                    Forecasts slower pace over distance using the Riegel Formula physiological decay logic.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* LEFT COMPONENT: Baseline Input */}
                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Previous Race Distance</label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => updateField("baselineDistance", 5)}
                                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors border ${baselineDistance === 5 ? "bg-brand-lime text-black border-brand-lime" : "bg-brand-midnight text-gray-400 border-brand-surface-light hover:text-foreground"
                                    }`}
                            >
                                5K
                            </button>
                            <button
                                onClick={() => updateField("baselineDistance", 10)}
                                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors border ${baselineDistance === 10 ? "bg-brand-lime text-black border-brand-lime" : "bg-brand-midnight text-gray-400 border-brand-surface-light hover:text-foreground"
                                    }`}
                            >
                                10K
                            </button>
                            <button
                                onClick={() => updateField("baselineDistance", 21.0975)}
                                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors border ${baselineDistance === 21.0975 ? "bg-brand-lime text-black border-brand-lime" : "bg-brand-midnight text-gray-400 border-brand-surface-light hover:text-foreground"
                                    }`}
                            >
                                Half
                            </button>
                            <input
                                type="number"
                                value={baselineDistance}
                                onChange={(e) => updateField("baselineDistance", e.target.value ? parseFloat(e.target.value) : "")}
                                className="w-20 bg-brand-midnight rounded-xl border border-brand-surface-light px-3 py-2 text-foreground outline-none focus:border-brand-lime text-center transition-colors"
                                placeholder="km"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Completion Time</label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={hours}
                                onChange={(e) => handleTimeChange("h", e.target.value)}
                                className="w-1/3 bg-brand-midnight rounded-xl border border-brand-surface-light px-4 py-3 text-foreground outline-none text-center focus:border-brand-lime transition-colors"
                                placeholder="HH"
                            />
                            <span className="text-xl font-bold text-gray-600 flex items-center">:</span>
                            <input
                                type="number"
                                value={minutes}
                                onChange={(e) => handleTimeChange("m", e.target.value)}
                                className="w-1/3 bg-brand-midnight rounded-xl border border-brand-surface-light px-4 py-3 text-foreground outline-none text-center focus:border-brand-lime transition-colors"
                                placeholder="MM"
                            />
                            <span className="text-xl font-bold text-gray-600 flex items-center">:</span>
                            <input
                                type="number"
                                value={seconds}
                                onChange={(e) => handleTimeChange("s", e.target.value)}
                                className="w-1/3 bg-brand-midnight rounded-xl border border-brand-surface-light px-4 py-3 text-foreground outline-none text-center focus:border-brand-lime transition-colors"
                                placeholder="SS"
                            />
                        </div>
                    </div>
                </div>

                {/* RIGHT COMPONENT: Visual Output Table */}
                <div className="bg-brand-midnight p-5 rounded-xl border border-brand-surface-light pt-6 lg:pt-5 w-full">
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider block mb-4">Predicted Results</span>

                    <div className="space-y-3">
                        {/* 5K row */}
                        {baselineDistance !== 5 && (
                            <div className={`flex items-center justify-between p-3 rounded-lg border border-transparent bg-brand-surface/50`}>
                                <span className="text-sm font-bold text-gray-500">5K</span>
                                <span className="text-lg font-bold tracking-tight text-foreground">{preds.p5k}</span>
                            </div>
                        )}

                        {/* 10K Component row */}
                        <div className={`flex items-center justify-between p-3 rounded-lg border ${baselineDistance === 10 ? 'border-brand-lime/30 bg-brand-lime/5' : 'border-transparent bg-brand-surface/50'} `}>
                            <span className="text-sm font-bold text-gray-500">10K</span>
                            <span className="text-lg font-bold tracking-tight text-foreground">{preds.p10k}</span>
                        </div>

                        {/* Half Marathon row */}
                        <div className={`flex items-center justify-between p-3 rounded-lg border ${baselineDistance === 21.0975 ? 'border-brand-lime/30 bg-brand-lime/5' : 'border-transparent bg-brand-surface/50'} `}>
                            <span className="text-sm font-bold text-gray-500">Half Marathon</span>
                            <span className="text-lg font-bold tracking-tight text-foreground">{preds.pHalf}</span>
                        </div>

                        {/* Full Marathon row (Highlighted) */}
                        <div className="flex items-center justify-between p-4 rounded-lg bg-brand-surface border border-brand-lime/20 relative overflow-hidden group hover:border-brand-lime/60 transition-colors">
                            <div className="absolute inset-0 bg-brand-lime/5 opacity-50"></div>
                            <span className="text-base font-bold text-brand-lime z-10 flex items-center gap-2">
                                Marathon <span className="text-[10px] bg-brand-lime/20 text-brand-lime px-2 py-0.5 rounded-full uppercase">Goal</span>
                            </span>
                            <span className="text-2xl font-black tracking-tighter text-brand-lime drop-shadow-[0_0_10px_rgba(204,255,0,0.2)] z-10">
                                {preds.pFull}
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
