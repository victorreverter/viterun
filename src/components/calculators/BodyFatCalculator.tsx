"use client";

import { useUserStore } from "@/store/useUserStore";
import { Activity } from "lucide-react";

export function BodyFatCalculator() {
    const { gender, weight, height, neck, waist, hips, updateField } = useUserStore();

    const calculateVariables = () => {
        let bf = "--";
        let bmiValue = "--";

        const wKg = Number(weight);
        const hCm = Number(height);
        const n = Number(neck);
        const w = Number(waist);
        const hip = Number(hips);

        // Calculate BMI if height and weight exist
        if (wKg > 0 && hCm > 0) {
            const hM = hCm / 100;
            const bmiCalc = wKg / (hM * hM);
            if (!isNaN(bmiCalc) && bmiCalc > 0 && bmiCalc < 100) {
                bmiValue = bmiCalc.toFixed(1);
            }
        }

        // Calculate Body Fat if measurements exist
        if (hCm && n && w && (gender === "male" || hip)) {
            let bfCalc = 0;
            if (gender === "male") {
                // U.S. Navy Method for Men
                bfCalc = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(hCm)) - 450;
            } else {
                // U.S. Navy Method for Women
                bfCalc = 495 / (1.29579 - 0.35004 * Math.log10(w + hip - n) + 0.22100 * Math.log10(hCm)) - 450;
            }

            if (!isNaN(bfCalc) && bfCalc >= 0 && bfCalc <= 100) {
                bf = bfCalc.toFixed(1);
            }
        }

        return { bf, bmi: bmiValue };
    };

    const { bf, bmi } = calculateVariables();

    return (
        <div className="bg-brand-surface rounded-2xl border border-brand-surface-light p-6 overflow-hidden relative">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-brand-surface-light rounded-lg text-brand-lime">
                    <Activity className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-xl font-bold tracking-tight">Body Composition</h2>
                    <p className="text-xs text-gray-400 mt-1">BMI & U.S. Navy Body Fat Method</p>
                </div>
            </div>

            <div className="space-y-4">
                {/* Gender Toggle */}
                <div className="flex bg-brand-midnight rounded-xl p-1 border border-brand-surface-light w-full">
                    <button
                        onClick={() => updateField("gender", "male")}
                        className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${gender === "male" ? "bg-brand-lime text-black" : "text-gray-400 hover:text-foreground"
                            }`}
                    >
                        Male
                    </button>
                    <button
                        onClick={() => updateField("gender", "female")}
                        className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${gender === "female" ? "bg-brand-lime text-black" : "text-gray-400 hover:text-foreground"
                            }`}
                    >
                        Female
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Weight (kg)</label>
                        <input
                            type="number"
                            value={weight}
                            onChange={(e) => updateField("weight", e.target.value ? parseFloat(e.target.value) : "")}
                            className="w-full bg-brand-midnight rounded-xl border border-brand-surface-light px-3 py-2 text-foreground outline-none focus:border-brand-lime transition-colors"
                            placeholder="e.g. 70"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Height (cm)</label>
                        <input
                            type="number"
                            value={height}
                            onChange={(e) => updateField("height", e.target.value ? parseFloat(e.target.value) : "")}
                            className="w-full bg-brand-midnight rounded-xl border border-brand-surface-light px-3 py-2 text-foreground outline-none focus:border-brand-lime transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Neck (cm)</label>
                        <input
                            type="number"
                            value={neck}
                            onChange={(e) => updateField("neck", e.target.value ? parseFloat(e.target.value) : "")}
                            className="w-full bg-brand-midnight rounded-xl border border-brand-surface-light px-3 py-2 text-foreground outline-none focus:border-brand-lime transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Waist (cm)</label>
                        <input
                            type="number"
                            value={waist}
                            onChange={(e) => updateField("waist", e.target.value ? parseFloat(e.target.value) : "")}
                            className="w-full bg-brand-midnight rounded-xl border border-brand-surface-light px-3 py-2 text-foreground outline-none focus:border-brand-lime transition-colors"
                        />
                    </div>

                    {gender === "female" && (
                        <div className="col-span-2">
                            <label className="block text-xs font-medium text-gray-400 mb-1">Hips (cm)</label>
                            <input
                                type="number"
                                value={hips}
                                onChange={(e) => updateField("hips", e.target.value ? parseFloat(e.target.value) : "")}
                                className="w-full bg-brand-midnight rounded-xl border border-brand-surface-light px-3 py-2 text-foreground outline-none focus:border-brand-lime transition-colors"
                            />
                        </div>
                    )}
                </div>

                <div className="mt-4 pt-4 border-t border-brand-surface-light grid grid-cols-2 gap-4">
                    {/* BMI Output */}
                    <div className="flex flex-col items-center justify-center p-3 bg-brand-midnight rounded-xl border border-brand-surface-light">
                        <span className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">BMI</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold tracking-tighter text-foreground">{bmi}</span>
                        </div>
                    </div>

                    {/* Body Fat Output */}
                    <div className="flex flex-col items-center justify-center p-3 bg-brand-midnight rounded-xl border border-brand-surface-light">
                        <span className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Body Fat</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold tracking-tighter text-brand-lime">{bf}</span>
                            <span className="text-brand-lime font-bold text-sm">%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
