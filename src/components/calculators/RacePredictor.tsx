"use client";

import { useUserStore } from "@/store/useUserStore";
import { TrendingUp } from "lucide-react";

export function RacePredictor() {
    const { baselineDistance, baselineTime, updateField } = useUserStore();

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
        <div className="bg-brand-surface rounded-2xl border border-brand-surface-light p-6 overflow-hidden relative">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-brand-surface-light rounded-lg text-brand-lime">
                    <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-xl font-bold tracking-tight">Race Predictor</h2>
                    <p className="text-xs text-gray-400 mt-1">Riegel Formula (T₂ = T₁ × (D₂/D₁)^1.06)</p>
                </div>
            </div>

            <div className="space-y-5">
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
                            className="w-20 bg-brand-midnight rounded-xl border border-brand-surface-light px-3 py-2 text-white outline-none focus:border-brand-lime text-center"
                            placeholder="km"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Completion Time (Minutes)</label>
                    <input
                        type="number"
                        value={baselineTime}
                        onChange={(e) => updateField("baselineTime", e.target.value ? parseFloat(e.target.value) : "")}
                        className="w-full bg-brand-midnight rounded-xl border border-brand-surface-light px-4 py-3 text-white outline-none focus:border-brand-lime"
                        placeholder="e.g. 50"
                    />
                </div>

                <div className="mt-6 pt-6 border-t border-brand-surface-light text-center">
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2 block">Predicted Marathon Finish</span>
                    <div className="inline-block relative">
                        <span className="text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-cyber drop-shadow-[0_0_15px_rgba(204,255,0,0.3)]">
                            {prediction}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
