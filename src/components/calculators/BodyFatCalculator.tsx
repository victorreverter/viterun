"use client";

import { useUserStore } from "@/store/useUserStore";
import { Activity } from "lucide-react";

export function BodyFatCalculator() {
    const { gender, height, neck, waist, hips, updateField } = useUserStore();

    const calculateBodyFat = () => {
        if (!height || !neck || !waist || (gender === "female" && !hips)) {
            return "--";
        }

        const h = Number(height);
        const n = Number(neck);
        const w = Number(waist);
        const hip = Number(hips);

        let bf = 0;

        if (gender === "male") {
            // U.S. Navy Method for Men (measurements in cm)
            // 495 / (1.0324 - 0.19077 * log10(waist - neck) + 0.15456 * log10(height)) - 450
            bf = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450;
        } else {
            // U.S. Navy Method for Women
            // 495 / (1.29579 - 0.35004 * log10(waist + hip - neck) + 0.22100 * log10(height)) - 450
            bf = 495 / (1.29579 - 0.35004 * Math.log10(w + hip - n) + 0.22100 * Math.log10(h)) - 450;
        }

        if (isNaN(bf) || bf < 0 || bf > 100) return "--";
        return bf.toFixed(1);
    };

    const bodyFat = calculateBodyFat();

    return (
        <div className="bg-brand-surface rounded-2xl border border-brand-surface-light p-6 overflow-hidden relative">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-brand-surface-light rounded-lg text-brand-lime">
                    <Activity className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-xl font-bold tracking-tight">Body Composition</h2>
                    <p className="text-xs text-gray-400 mt-1">U.S. Navy Method Estimation</p>
                </div>
            </div>

            <div className="space-y-4">
                {/* Gender Toggle */}
                <div className="flex bg-brand-midnight rounded-xl p-1 border border-brand-surface-light w-full">
                    <button
                        onClick={() => updateField("gender", "male")}
                        className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${gender === "male" ? "bg-brand-lime text-black" : "text-gray-400 hover:text-white"
                            }`}
                    >
                        Male
                    </button>
                    <button
                        onClick={() => updateField("gender", "female")}
                        className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${gender === "female" ? "bg-brand-lime text-black" : "text-gray-400 hover:text-white"
                            }`}
                    >
                        Female
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Height (cm)</label>
                        <input
                            type="number"
                            value={height}
                            onChange={(e) => updateField("height", e.target.value ? parseFloat(e.target.value) : "")}
                            className="w-full bg-brand-midnight rounded-xl border border-brand-surface-light px-3 py-2 text-white outline-none focus:border-brand-lime transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Neck (cm)</label>
                        <input
                            type="number"
                            value={neck}
                            onChange={(e) => updateField("neck", e.target.value ? parseFloat(e.target.value) : "")}
                            className="w-full bg-brand-midnight rounded-xl border border-brand-surface-light px-3 py-2 text-white outline-none focus:border-brand-lime transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Waist (cm)</label>
                        <input
                            type="number"
                            value={waist}
                            onChange={(e) => updateField("waist", e.target.value ? parseFloat(e.target.value) : "")}
                            className="w-full bg-brand-midnight rounded-xl border border-brand-surface-light px-3 py-2 text-white outline-none focus:border-brand-lime transition-colors"
                        />
                    </div>

                    {gender === "female" && (
                        <div className="col-span-1">
                            <label className="block text-xs font-medium text-gray-400 mb-1">Hips (cm)</label>
                            <input
                                type="number"
                                value={hips}
                                onChange={(e) => updateField("hips", e.target.value ? parseFloat(e.target.value) : "")}
                                className="w-full bg-brand-midnight rounded-xl border border-brand-surface-light px-3 py-2 text-white outline-none focus:border-brand-lime transition-colors"
                            />
                        </div>
                    )}
                </div>

                <div className="mt-4 pt-4 border-t border-brand-surface-light flex items-center justify-between">
                    <span className="text-sm text-gray-400 font-medium">Estimated Body Fat</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold tracking-tighter text-white">{bodyFat}</span>
                        <span className="text-brand-lime font-bold">%</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
