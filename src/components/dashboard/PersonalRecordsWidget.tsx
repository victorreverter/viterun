"use client";

import { useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { Trophy, Edit2, Check } from "lucide-react";
import type { UserState } from "@/store/useUserStore";

type DistanceKey = keyof UserState['personalRecords'];

const DISTANCES: { key: DistanceKey; label: string; color: string }[] = [
    { key: "1km", label: "1 km", color: "bg-blue-400 shadow-[0_0_8px_#60a5fa]" },
    { key: "1mi", label: "1 mi", color: "bg-indigo-400 shadow-[0_0_8px_#818cf8]" },
    { key: "5km", label: "5 km", color: "bg-purple-400 shadow-[0_0_8px_#c084fc]" },
    { key: "10km", label: "10 km", color: "bg-fuchsia-400 shadow-[0_0_8px_#e879f9]" },
    { key: "10mi", label: "10 mi", color: "bg-pink-400 shadow-[0_0_8px_#f472b6]" },
    { key: "halfMarathon", label: "Half Marathon", color: "bg-rose-400 shadow-[0_0_8px_#fb7185]" },
    { key: "marathon", label: "Marathon", color: "bg-red-400 shadow-[0_0_8px_#f87171]" },
];

export function PersonalRecordsWidget() {
    const { personalRecords, updatePersonalRecord } = useUserStore();
    const [isEditing, setIsEditing] = useState(false);
    
    // Local state to avoid updating the store on every keystroke
    const [localRecords, setLocalRecords] = useState(personalRecords);

    const handleSave = () => {
        // Save all local updates to the store
        (Object.entries(localRecords) as [DistanceKey, string][]).forEach(([key, value]) => {
            updatePersonalRecord(key, value);
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        // Revert to store values
        setLocalRecords(personalRecords);
        setIsEditing(false);
    };

    return (
        <div className="bg-brand-surface border border-brand-surface-light hover:border-brand-lime/50 transition-colors rounded-2xl p-6 flex flex-col gap-4 shadow-lg shadow-black/20">
            <div className="flex items-center justify-between">
                <h3 className="text-brand-lime font-mono text-sm tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_#facc15]"></span>
                    PERSONAL RECORDS
                </h3>
                {isEditing ? (
                    <div className="flex gap-2">
                        <button 
                            onClick={handleCancel}
                            className="text-gray-400 hover:text-white transition-colors text-xs font-medium"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSave}
                            className="bg-brand-lime text-black p-1.5 rounded-lg hover:bg-white transition-colors"
                        >
                            <Check className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="text-gray-400 hover:text-brand-lime transition-colors"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                )}
            </div>

            <div className="flex-1 flex flex-col gap-3 py-2">
                {DISTANCES.map(({ key, label, color }) => (
                    <div key={key} className="flex items-center justify-between group">
                        <div className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${color}`}></span>
                            <span className="text-gray-300 text-sm font-medium">{label}</span>
                        </div>
                        
                        {isEditing ? (
                            <input
                                type="text"
                                value={localRecords[key]}
                                onChange={(e) => setLocalRecords(prev => ({ ...prev, [key]: e.target.value }))}
                                placeholder="--:--:--"
                                className="w-24 bg-brand-midnight/50 border border-brand-surface-light rounded-md px-2 py-1 text-right text-sm text-white font-mono outline-none focus:border-brand-lime transition-colors"
                            />
                        ) : (
                            <span className="text-white font-mono text-sm tracking-tight font-semibold">
                                {personalRecords[key] || "--:--:--"}
                            </span>
                        )}
                    </div>
                ))}
            </div>
            
            {!isEditing && Object.values(personalRecords).every(v => !v) && (
                <p className="text-gray-500 text-xs italic text-center mt-2">
                    Click edit to add your PRs
                </p>
            )}
        </div>
    );
}
