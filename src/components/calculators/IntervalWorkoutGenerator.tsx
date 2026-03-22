"use client";

import { useState, useMemo } from "react";
import { Zap, Timer, Flame, Activity } from "lucide-react";

export function IntervalWorkoutGenerator() {
    const [distance, setDistance] = useState<"5K" | "10K">("5K");
    const [minutes, setMinutes] = useState("20");
    const [seconds, setSeconds] = useState("00");

    // Math Logic
    const generateWorkouts = () => {
        const mins = parseInt(minutes) || 0;
        const secs = parseInt(seconds) || 0;
        if (mins === 0 && secs === 0) return null;

        const totalSeconds = (mins * 60) + secs;

        // Convert 10K to 5K equivalent benchmark using Riegel's formula: T2 = T1 * (D2/D1)^1.06
        let equivalent5KSeconds = totalSeconds;
        if (distance === "10K") {
            equivalent5KSeconds = totalSeconds * Math.pow(5 / 10, 1.06);
        }

        const pace5KPerKm = equivalent5KSeconds / 5; // seconds per km

        // Speed/Repetition Pace (Faster by ~15s/km than 5K pace)
        const repPaceKm = pace5KPerKm - 15;
        // Interval Pace (Faster by ~5s/km than 5K pace)
        const intPaceKm = pace5KPerKm - 5;
        // Tempo/Threshold Pace (Slower by ~15s/km than 5K pace)
        const tempoPaceKm = pace5KPerKm + 15;

        // Formats seconds into MM:SS
        const formatTime = (totalSecs: number) => {
            if (totalSecs <= 0) return "--:--";
            const m = Math.floor(totalSecs / 60);
            const s = Math.round(totalSecs % 60);
            return `${m}:${s.toString().padStart(2, '0')}`;
        };

        return [
            {
                title: "Short Speed (400m)",
                icon: Zap,
                color: "text-yellow-400",
                bg: "bg-yellow-400/10",
                border: "border-yellow-400/30",
                workout: "8 x 400m Repeats",
                timeTarget: formatTime((repPaceKm / 1000) * 400),
                paceDesc: `${formatTime(repPaceKm)}/km pace`,
                rest: "60-90s standing rest",
                benefit: "Boosts V02 Max, running economy, and top-end speed."
            },
            {
                title: "Medium Intervals (800m)",
                icon: Flame,
                color: "text-orange-400",
                bg: "bg-orange-400/10",
                border: "border-orange-400/30",
                workout: "6 x 800m Repeats",
                timeTarget: formatTime((intPaceKm / 1000) * 800),
                paceDesc: `${formatTime(intPaceKm)}/km pace`,
                rest: "2 minutes active jog",
                benefit: "Increases lactate threshold and mental toughness for 5K/10K."
            },
            {
                title: "Long Intervals (1000m)",
                icon: Activity,
                color: "text-red-400",
                bg: "bg-red-400/10",
                border: "border-red-400/30",
                workout: "5 x 1km Repeats",
                timeTarget: formatTime(intPaceKm),
                paceDesc: `${formatTime(intPaceKm)}/km pace`,
                rest: "2.5 minutes active jog",
                benefit: "Simulates race fatigue and builds late-race kick power."
            },
            {
                title: "Tempo Run (20+ mins)",
                icon: Timer,
                color: "text-blue-400",
                bg: "bg-blue-400/10",
                border: "border-blue-400/30",
                workout: "20-30 Min Tempo",
                timeTarget: formatTime(tempoPaceKm),
                paceDesc: `/km holding pace`,
                rest: "Continuous effort",
                benefit: "Pushes your lactate threshold higher for half/full marathons."
            }
        ];
    };

    const workouts = useMemo(() => generateWorkouts(), [distance, minutes, seconds]);

    return (
        <div className="bg-brand-surface border border-brand-surface-light hover:border-brand-lime/50 transition-colors rounded-2xl p-6 shadow-lg shadow-black/20 flex flex-col h-full overflow-hidden relative group">
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-brand-lime/5 blur-[100px] pointer-events-none rounded-full group-hover:bg-brand-lime/10 transition-colors" />

            {/* Header section */}
            <div className="mb-6 relative z-10">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 bg-brand-surface-light rounded-xl text-brand-lime">
                        <Zap className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-foreground leading-tight">Interval Generator</h2>
                        <p className="text-xs text-gray-500 font-medium">Bespoke track sheets</p>
                    </div>
                </div>
                <p className="text-sm text-gray-400 mt-2 max-w-lg">
                    Enter a recent or target race time below. ViteRun will scientifically reverse-engineer your V02 max and generate an exact, mathematically optimal speed workout sheet for you to take to the track.
                </p>
            </div>

            {/* Input Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-brand-midnight/40 p-4 rounded-xl border border-brand-surface-light relative z-10 w-fit">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Benchmark</label>
                    <div className="flex bg-brand-midnight border border-brand-surface-light rounded-lg p-1">
                        <button
                            onClick={() => setDistance("5K")}
                            className={`px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${distance === "5K" ? "bg-brand-lime text-black" : "text-gray-400 hover:text-foreground"}`}
                        >
                            5K
                        </button>
                        <button
                            onClick={() => setDistance("10K")}
                            className={`px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${distance === "10K" ? "bg-brand-lime text-black" : "text-gray-400 hover:text-foreground"}`}
                        >
                            10K
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Time (MM:SS)</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            min="10"
                            max="99"
                            value={minutes}
                            onChange={(e) => setMinutes(e.target.value)}
                            className="w-16 bg-brand-midnight border border-brand-surface-light rounded-lg px-3 py-1.5 text-center font-mono font-bold text-lg text-foreground focus:outline-none focus:border-brand-lime focus:ring-1 focus:ring-brand-lime transition-all"
                        />
                        <span className="text-gray-500 font-bold">:</span>
                        <input
                            type="number"
                            min="0"
                            max="59"
                            value={seconds}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val.length <= 2) setSeconds(val);
                            }}
                            className="w-16 bg-brand-midnight border border-brand-surface-light rounded-lg px-3 py-1.5 text-center font-mono font-bold text-lg text-foreground focus:outline-none focus:border-brand-lime focus:ring-1 focus:ring-brand-lime transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Workout Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10 w-full mb-2">
                {workouts?.map((w, idx) => (
                    <div key={idx} className={`bg-brand-midnight/40 border border-brand-surface-light hover:${w.border} rounded-2xl p-4 transition-all group/card flex flex-col`}>
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <div className={`p-1.5 rounded-lg ${w.bg} ${w.color}`}>
                                    <w.icon className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">{w.title}</span>
                            </div>
                        </div>

                        <div className="mb-4 flex-1">
                            <div className="text-lg font-black text-foreground mb-1 leading-none">{w.workout}</div>
                            <div className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                                <span>Target:</span>
                                <span className={`font-mono text-base ${w.color}`}>{w.timeTarget}</span>
                                <span className="text-xs uppercase">({w.paceDesc})</span>
                            </div>
                        </div>

                        <div className="border-t border-brand-surface-light/50 pt-3 flex flex-col gap-1.5">
                            <div className="flex items-start gap-2 text-xs">
                                <span className="font-bold text-gray-500 min-w-[35px]">REST:</span>
                                <span className="text-gray-300 font-medium">{w.rest}</span>
                            </div>
                            <div className="flex items-start gap-2 text-xs">
                                <span className="font-bold text-gray-500 min-w-[35px]">GOAL:</span>
                                <span className="text-gray-400">{w.benefit}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
        </div>
    );
}
