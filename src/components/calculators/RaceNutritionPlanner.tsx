"use client";

import { useState, useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import { Info, Coffee, Droplets, Zap, Activity } from "lucide-react";

export function RaceNutritionPlanner() {
    const { weight: storeWeight } = useUserStore();

    // Inputs
    const [raceType, setRaceType] = useState<string>("marathon");
    const [weight, setWeight] = useState<number | "">(storeWeight || 70);
    const [hours, setHours] = useState<number | "">(3);
    const [minutes, setMinutes] = useState<number | "">(30);
    const [strategy, setStrategy] = useState<"standard" | "aggressive" | "elite">("aggressive");
    const [gelSize, setGelSize] = useState<number | "">(30); // e.g. Maurten 100 is 25g, SIS Beta is 40g, standard is ~30g
    const [customDistance, setCustomDistance] = useState<number | "">("");
    const [distanceUnit, setDistanceUnit] = useState<"km" | "mi">("km");

    const handleRaceChange = (type: string) => {
        setRaceType(type);
        if (type === "5k") { setHours(0); setMinutes(25); }
        else if (type === "10k") { setHours(0); setMinutes(55); }
        else if (type === "half") { setHours(1); setMinutes(55); }
        else if (type === "marathon") { setHours(4); setMinutes(0); }
        // custom leaves them alone
    };

    useEffect(() => {
        if (storeWeight && weight === 70 && typeof storeWeight === 'number') {
            setWeight(storeWeight);
        }
    }, [storeWeight, weight]);

    // Math
    const totalMinutes = (Number(hours) || 0) * 60 + (Number(minutes) || 0);
    const w = Number(weight) || 70;
    
    // Strategy mappings (Carbs per Hour)
    const strategyCarbs = {
        standard: 60,
        aggressive: 90,
        elite: 120
    };
    const carbsPerHour = strategyCarbs[strategy];

    // Calculations
    const totalCarbsRace = (totalMinutes / 60) * carbsPerHour;
    const gSize = Number(gelSize) || 30;
    
    // Calculate total gels. We assume 1 gel is taken 15 mins before race. 
    // The rest are taken during.
    const totalGelsRequired = Math.max(1, Math.ceil(totalCarbsRace / gSize));
    
    // Let's create a timeline for the race
    // We take 1 gel 15 mins before (T-15min). 
    // Remaining gels are distributed evenly across the race duration.
    const gelsDuringRace = totalGelsRequired - 1;
    const gelIntervalMinutes = gelsDuringRace > 0 ? Math.floor(totalMinutes / gelsDuringRace) : 0;

    // Carb loading (2 days before) - 8g to 10g per kg. Only needed for >90 mins.
    const needsCarbLoad = totalMinutes >= 90;
    const carbLoadDaily = w * 8; 
    // Race morning (2-3 hrs before) - 2g to 3g per kg
    const raceMorningCarbs = w * 2;

    return (
        <div className="bg-brand-surface border border-brand-surface-light hover:border-brand-lime/50 transition-colors rounded-2xl p-6 shadow-lg shadow-black/20 flex flex-col h-full animate-in zoom-in-95 duration-500">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-brand-surface-light rounded-xl text-brand-lime">
                    <Zap className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-foreground">Race Fueling Strategy</h2>
                    <p className="text-sm text-gray-500">Based on sports science guidelines</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 relative">
                <div className="col-span-2 space-y-2">
                    <label className="text-xs font-semibold text-gray-400 pl-1 uppercase tracking-wider">Race Type</label>
                    <div className="flex flex-wrap gap-2">
                        {[
                            { id: "5k", label: "5K" },
                            { id: "10k", label: "10K" },
                            { id: "half", label: "Half" },
                            { id: "marathon", label: "Marathon" },
                            { id: "custom", label: "Custom" }
                        ].map((rt) => (
                            <button
                                key={rt.id}
                                onClick={() => handleRaceChange(rt.id)}
                                className={`flex-1 min-w-[50px] py-2 px-1 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                                    raceType === rt.id 
                                    ? "bg-brand-lime text-black shadow-[0_0_10px_rgba(204,255,0,0.3)] border border-brand-lime" 
                                    : "bg-brand-midnight/50 text-gray-400 hover:text-foreground hover:bg-brand-surface-light border border-brand-surface-light"
                                }`}
                            >
                                {rt.label}
                            </button>
                        ))}
                    </div>
                    {raceType === "custom" && (
                        <div className="flex items-center gap-2 mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
                            <input
                                type="number"
                                value={customDistance === "" ? "" : customDistance}
                                onChange={(e) => setCustomDistance(e.target.value === "" ? "" : Number(e.target.value))}
                                className="w-full p-3 bg-brand-midnight/50 border border-brand-surface-light rounded-xl text-foreground font-mono font-bold appearance-none focus:outline-none focus:border-brand-lime focus:ring-1 focus:ring-brand-lime transition-all"
                                placeholder="Enter distance"
                            />
                            <div className="flex bg-brand-midnight/50 border border-brand-surface-light rounded-xl p-1 shrink-0">
                                <button
                                    onClick={() => setDistanceUnit("km")}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${distanceUnit === "km" ? "bg-brand-surface-light text-foreground" : "text-gray-500 hover:text-gray-300"}`}
                                >
                                    km
                                </button>
                                <button
                                    onClick={() => setDistanceUnit("mi")}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${distanceUnit === "mi" ? "bg-brand-surface-light text-foreground" : "text-gray-500 hover:text-gray-300"}`}
                                >
                                    mi
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-1.5 focus-within:z-10">
                    <label className="text-xs font-semibold text-gray-400 pl-1 uppercase tracking-wider">Target Finish Time</label>
                    <div className="relative flex items-center">
                        <input
                            type="number"
                            value={hours === "" ? "" : hours}
                            onChange={(e) => setHours(e.target.value === "" ? "" : Number(e.target.value))}
                            className="w-1/2 p-3 bg-brand-midnight/50 dark:bg-brand-midnight/50 border border-brand-surface-light rounded-l-xl text-foreground font-mono font-bold text-center appearance-none focus:outline-none focus:ring-1 focus:ring-brand-lime transition-all overflow-hidden"
                            placeholder="hh"
                            min="0"
                            max="24"
                        />
                        <span className="w-px h-6 bg-brand-surface-light absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10" />
                        <input
                            type="number"
                            value={minutes === "" ? "" : minutes}
                            onChange={(e) => setMinutes(e.target.value === "" ? "" : Number(e.target.value))}
                            className="w-1/2 p-3 bg-brand-midnight/50 dark:bg-brand-midnight/50 border border-brand-surface-light rounded-r-xl text-foreground font-mono font-bold text-center appearance-none focus:outline-none focus:border-l-0 focus:ring-1 focus:ring-brand-lime transition-all"
                            placeholder="mm"
                            min="0"
                            max="59"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 pl-1 uppercase tracking-wider">Weight (kg)</label>
                    <input
                        type="number"
                        value={weight === "" ? "" : weight}
                        onChange={(e) => setWeight(e.target.value === "" ? "" : Number(e.target.value))}
                        className="w-full p-3 bg-brand-midnight/50 dark:bg-brand-midnight/50 border border-brand-surface-light rounded-xl text-foreground font-mono font-bold text-center appearance-none focus:outline-none focus:border-brand-lime focus:ring-1 focus:ring-brand-lime transition-all"
                        placeholder="70"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 pl-1 uppercase tracking-wider">Carb Strategy</label>
                    <select
                        value={strategy}
                        onChange={(e) => setStrategy(e.target.value as "standard" | "aggressive" | "elite")}
                        className="w-full p-3 bg-brand-midnight/50 dark:bg-brand-midnight/50 border border-brand-surface-light rounded-xl text-foreground font-semibold text-center appearance-none focus:outline-none focus:border-brand-lime focus:ring-1 focus:ring-brand-lime transition-all"
                    >
                        <option value="standard">Standard (60g/hr)</option>
                        <option value="aggressive">Aggressive (90g/hr) - Recommended</option>
                        <option value="elite">Elite (120g/hr)</option>
                    </select>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 pl-1 uppercase tracking-wider">Gel Size (g carbs)</label>
                    <input
                        type="number"
                        value={gelSize === "" ? "" : gelSize}
                        onChange={(e) => setGelSize(e.target.value === "" ? "" : Number(e.target.value))}
                        className="w-full p-3 bg-brand-midnight/50 dark:bg-brand-midnight/50 border border-brand-surface-light rounded-xl text-foreground font-mono font-bold text-center appearance-none focus:outline-none focus:border-brand-lime focus:ring-1 focus:ring-brand-lime transition-all"
                        placeholder="30"
                    />
                </div>
            </div>

            {totalMinutes > 0 ? (
                <div className="flex-1 space-y-4">
                    <div className="p-4 bg-brand-midnight/30 border border-brand-surface-light rounded-xl">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-brand-lime mb-3">
                            <Activity className="w-4 h-4" /> Prep & Morning
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">T-48hrs (Diet)</p>
                                {needsCarbLoad ? (
                                    <p className="font-mono text-xl text-foreground font-black">
                                        {Math.round(carbLoadDaily)} <span className="text-sm font-sans font-medium text-gray-400">g/day carbs</span>
                                    </p>
                                ) : (
                                    <p className="font-mono text-lg text-foreground font-black tracking-tight" style={{ fontSize: '15px' }}>
                                        Normal Diet
                                    </p>
                                )}
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">T-3hrs (Breakfast)</p>
                                <p className="font-mono text-xl text-foreground font-black">
                                    {Math.round(raceMorningCarbs)} <span className="text-sm font-sans font-medium text-gray-400">g</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-brand-midnight to-brand-midnight/80 border border-brand-surface-light rounded-xl">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-[#FC4C02] mb-3">
                            <Coffee className="w-4 h-4" /> Race Strategy
                        </h4>
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-brand-surface-light/50">
                            <div>
                                <p className="text-xs text-gray-500 mb-0.5">Total Carbs Needed</p>
                                <p className="font-mono text-2xl text-foreground font-black">
                                    {Math.round(totalCarbsRace)} <span className="text-sm font-sans font-medium text-gray-400">g</span>
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500 mb-0.5">Total Gels to Carry</p>
                                <p className="font-mono text-2xl text-foreground font-black">
                                    {totalGelsRequired} <span className="text-sm font-sans font-medium text-gray-400">gels</span>
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3 relative">
                            <div className="absolute top-2 bottom-2 left-[5px] w-px bg-brand-surface-light"></div>
                            
                            <div className="flex gap-4 relative">
                                <div className="w-3 h-3 rounded-full bg-brand-lime absolute left-0 top-1.5 shadow-[0_0_8px_#16A34A]"></div>
                                <div className="pl-6">
                                    <p className="text-sm font-bold text-foreground">T-15 mins before start</p>
                                    <p className="text-xs text-gray-400 mt-0.5">Take 1 gel ({gSize}g carbs) on start line</p>
                                </div>
                            </div>

                            {gelsDuringRace > 0 && (
                                <div className="flex gap-4 relative mt-3">
                                    <div className="w-3 h-3 rounded-full bg-[#FC4C02] absolute left-0 top-1.5 shadow-[0_0_8px_rgba(252,76,2,0.8)]"></div>
                                    <div className="pl-6">
                                        <p className="text-sm font-bold text-foreground">During the Race</p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            Take 1 gel every <span className="font-bold text-brand-lime">{gelIntervalMinutes} minutes</span>
                                        </p>
                                        <p className="text-[10px] text-gray-500 mt-1 italic">
                                            ({gelsDuringRace} gels total during the run)
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-start gap-2 bg-brand-midnight/50 border border-brand-surface-light rounded-xl p-3">
                        <Droplets className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs font-bold text-blue-400">Hydration Target</p>
                            <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">Aim for 500-750ml of fluids per hour alongside your gels to optimize absorption and prevent GI distress.</p>
                        </div>
                    </div>

                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-brand-surface-light border-dashed rounded-xl">
                    <Info className="w-8 h-8 text-gray-500 mb-3" />
                    <p className="text-sm text-gray-400 max-w-[250px]">
                        Enter your target finish time to generate a precise fueling strategy.
                    </p>
                </div>
            )}
        </div>
    );
}
