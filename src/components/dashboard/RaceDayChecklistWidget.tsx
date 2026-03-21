"use client";

import { useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { CheckSquare, Square, Sun, CloudRain, Snowflake, Plus, Trash2, ListChecks, RefreshCw } from "lucide-react";

type WeatherCondition = "Standard" | "Hot" | "Rain" | "Cold";

const STANDARD_ITEMS = [
    "Race Bib / Number",
    "Safety Pins",
    "Running Shoes",
    "Race Outfit (Shorts/Shirt)",
    "GPS Watch (Fully Charged)",
    "Gels & Nutrition",
    "Anti-chafe Balm",
    "Post-Race Dry Clothes"
];

const WEATHER_ITEMS: Record<Exclude<WeatherCondition, "Standard">, string[]> = {
    Hot: [
        "Sunscreen",
        "Sunglasses",
        "Hat or Visor",
        "Extra Electrolytes / Salt Tabs"
    ],
    Rain: [
        "Disposable Poncho / Trash Bag",
        "Hat with Brim (Keep rain off eyes)",
        "Extra Pair of Dry Socks",
        "Water-resistant run jacket"
    ],
    Cold: [
        "Running Gloves",
        "Arm Warmers",
        "Beanie / Ear bands",
        "Throw-away jumper for start line"
    ]
};

export function RaceDayChecklistWidget() {
    const { 
        raceChecklist, 
        toggleChecklistItem, 
        clearChecklist, 
        customChecklistItems, 
        addCustomChecklistItem, 
        removeCustomChecklistItem,
        hiddenChecklistItems,
        hideChecklistItem
    } = useUserStore();

    const [weather, setWeather] = useState<WeatherCondition>("Standard");
    const [newItemText, setNewItemText] = useState("");

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (newItemText.trim()) {
            addCustomChecklistItem(newItemText.trim());
            setNewItemText("");
        }
    };

    let displayedItems = [...STANDARD_ITEMS];
    if (weather !== "Standard") {
        displayedItems = [...displayedItems, ...WEATHER_ITEMS[weather]];
    }
    displayedItems = [...displayedItems, ...(customChecklistItems || [])];
    
    // Deduplicate any identical text items
    displayedItems = Array.from(new Set(displayedItems));
    
    // Filter out hidden (deleted standard/weather) items
    const hiddenSet = new Set(hiddenChecklistItems || []);
    displayedItems = displayedItems.filter(item => !hiddenSet.has(item));

    // Calculate progress
    const checkedCount = displayedItems.filter(item => raceChecklist[item]).length;
    const progressPercent = displayedItems.length > 0 ? (checkedCount / displayedItems.length) * 100 : 0;

    return (
        <div className="bg-brand-surface border border-brand-surface-light hover:border-brand-lime/50 transition-colors rounded-2xl p-6 shadow-lg shadow-black/20 flex flex-col h-full animate-in zoom-in-95 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-brand-surface-light rounded-xl text-brand-lime shadow-[0_0_15px_rgba(204,255,0,0.15)]">
                        <ListChecks className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-foreground">Race Day Checklist</h2>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-0.5">Don't forget anything</p>
                    </div>
                </div>
                <button 
                    onClick={clearChecklist}
                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-bold"
                >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Reset
                </button>
            </div>

            {/* Weather Selector */}
            <div className="flex bg-brand-midnight/50 p-1 rounded-xl border border-brand-surface-light mb-6">
                {(["Standard", "Hot", "Rain", "Cold"] as WeatherCondition[]).map((condition) => {
                    const isActive = weather === condition;
                    let Icon = ListChecks;
                    if (condition === "Hot") Icon = Sun;
                    if (condition === "Rain") Icon = CloudRain;
                    if (condition === "Cold") Icon = Snowflake;

                    return (
                        <button
                            key={condition}
                            onClick={() => setWeather(condition)}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                                isActive 
                                ? "bg-brand-surface text-brand-lime shadow-md border border-brand-lime/50" 
                                : "text-gray-500 hover:text-foreground hover:bg-brand-surface-light"
                            }`}
                        >
                            {condition !== "Standard" && <Icon className="w-3.5 h-3.5" />}
                            {condition}
                        </button>
                    );
                })}
            </div>

            {/* Checklist Items Tracker */}
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-400">{checkedCount} of {displayedItems.length} packed</span>
                <span className="text-xs font-bold text-brand-lime">{Math.round(progressPercent)}%</span>
            </div>
            
            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-brand-midnight rounded-full overflow-hidden mb-5">
                <div 
                    className="h-full bg-brand-lime transition-all duration-500 ease-out shadow-[0_0_10px_#ccff00]" 
                    style={{ width: `${progressPercent}%` }}
                />
            </div>

            {/* Checklist */}
            <div className="flex-1 space-y-1 mb-4">
                {displayedItems.map((item) => {
                    const isChecked = raceChecklist[item] || false;
                    const isCustom = (customChecklistItems || []).includes(item);

                    return (
                        <div 
                            key={item} 
                            className={`group flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
                                isChecked 
                                ? "bg-brand-lime/5 border border-brand-lime/20" 
                                : "bg-brand-midnight/30 border border-brand-surface-light hover:border-gray-500"
                            }`}
                            onClick={() => toggleChecklistItem(item)}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`transition-colors ${isChecked ? "text-brand-lime" : "text-gray-500 group-hover:text-gray-400"}`}>
                                    {isChecked ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                                </div>
                                <span className={`text-sm font-semibold transition-all ${isChecked ? "text-brand-lime line-through opacity-70" : "text-foreground"}`}>
                                    {item}
                                </span>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (isCustom) {
                                        removeCustomChecklistItem(item);
                                    } else {
                                        hideChecklistItem(item);
                                    }
                                }}
                                className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Add Custom Item */}
            <form onSubmit={handleAddItem} className="mt-auto relative">
                <input
                    type="text"
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    placeholder="Add personalized item..."
                    className="w-full p-3.5 pl-4 pr-12 bg-brand-midnight/50 border border-brand-surface-light rounded-xl text-foreground text-sm font-semibold focus:outline-none focus:border-brand-lime focus:ring-1 focus:ring-brand-lime transition-all placeholder:text-gray-600"
                />
                <button 
                    type="submit"
                    disabled={!newItemText.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-surface-light hover:bg-brand-lime hover:text-black rounded-lg text-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </form>
        </div>
    );
}
