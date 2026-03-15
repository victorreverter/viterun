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

// Helper: "hh:mm:ss" or "mm:ss" -> Total Seconds
const timeToSeconds = (timeStr: string | { current: string; previous: string } | undefined) => {
    // Graceful backward compatibility handling
    if (!timeStr) return 0;
    const str = typeof timeStr === 'string' ? timeStr : (timeStr.current || "");
    if (!str) return 0;

    const parts = str.split(":").map(Number);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return 0;
};

// Helper: Total Seconds -> Formatted string (e.g. "1m 12s" or "15s")
const formatDiff = (totalSeconds: number) => {
    const absSeconds = Math.abs(totalSeconds);
    const h = Math.floor(absSeconds / 3600);
    const m = Math.floor((absSeconds % 3600) / 60);
    const s = absSeconds % 60;
    
    const parts = [];
    if (h > 0) parts.push(`${h}h`);
    if (m > 0 || h > 0) parts.push(`${m}m`);
    parts.push(`${s}s`);
    
    return parts.join(" ");
};

export function PersonalRecordsWidget() {
    const { personalRecords, updatePersonalRecord } = useUserStore();
    const [isEditing, setIsEditing] = useState(false);
    
    type TimeSplit = { h: string; m: string; s: string };

    const getInitialEditRecords = () => {
        const init = {} as Record<DistanceKey, TimeSplit>;
        (Object.keys(personalRecords) as DistanceKey[]).forEach(k => {
            const record = personalRecords[k];
            // Backward compatibility for old string data
            const val = typeof record === 'string' ? record : (record?.current || "");
            
            const parts = val ? val.split(":") : [];
            if (parts.length === 3) {
                init[k] = { h: parts[0], m: parts[1], s: parts[2] };
            } else if (parts.length === 2) {
                init[k] = { h: "", m: parts[0], s: parts[1] };
            } else {
                init[k] = { h: "", m: "", s: "" };
            }
        });
        return init;
    };

    const [editRecords, setEditRecords] = useState<Record<DistanceKey, TimeSplit>>(getInitialEditRecords());

    const handleSave = () => {
        (Object.entries(editRecords) as [DistanceKey, TimeSplit][]).forEach(([key, { h, m, s }]) => {
            const hv = parseInt(h) || 0;
            const mv = parseInt(m) || 0;
            const sv = parseInt(s) || 0;
            
            if (hv === 0 && mv === 0 && sv === 0 && !h && !m && !s) {
                updatePersonalRecord(key, "");
            } else {
                const formattedS = sv.toString().padStart(2, "0");
                const formattedM = hv > 0 ? mv.toString().padStart(2, "0") : mv.toString();
                const timeStr = hv > 0 ? `${hv}:${formattedM}:${formattedS}` : `${formattedM}:${formattedS}`;
                updatePersonalRecord(key, timeStr);
            }
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditRecords(getInitialEditRecords());
        setIsEditing(false);
    };

    return (
        <div className="bg-brand-surface border border-brand-surface-light hover:border-brand-lime/50 transition-colors rounded-2xl p-6 flex flex-col gap-4 shadow-lg shadow-black/20">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h3 className="text-brand-lime font-mono text-sm tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_#facc15]"></span>
                        PERSONAL RECORDS
                    </h3>
                    <span className="text-gray-500 text-[10px] uppercase font-mono tracking-wider ml-6">
                        In () will appear the diff. with previous records
                    </span>
                </div>
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
                        onClick={() => {
                            setEditRecords(getInitialEditRecords());
                            setIsEditing(true);
                        }}
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
                            <div className="flex items-center gap-1">
                                <input
                                    type="text"
                                    value={editRecords[key].h}
                                    onChange={(e) => setEditRecords(prev => ({ ...prev, [key]: { ...prev[key], h: e.target.value } }))}
                                    placeholder="hh"
                                    className="w-8 bg-brand-midnight/50 border border-brand-surface-light rounded-md px-1 py-1 text-center text-xs text-white font-mono outline-none focus:border-brand-lime transition-colors"
                                />
                                <span className="text-gray-600 font-bold">:</span>
                                <input
                                    type="text"
                                    value={editRecords[key].m}
                                    onChange={(e) => setEditRecords(prev => ({ ...prev, [key]: { ...prev[key], m: e.target.value } }))}
                                    placeholder="mm"
                                    className="w-8 bg-brand-midnight/50 border border-brand-surface-light rounded-md px-1 py-1 text-center text-xs text-white font-mono outline-none focus:border-brand-lime transition-colors"
                                />
                                <span className="text-gray-600 font-bold">:</span>
                                <input
                                    type="text"
                                    value={editRecords[key].s}
                                    onChange={(e) => setEditRecords(prev => ({ ...prev, [key]: { ...prev[key], s: e.target.value } }))}
                                    placeholder="ss"
                                    className="w-8 bg-brand-midnight/50 border border-brand-surface-light rounded-md px-1 py-1 text-center text-xs text-white font-mono outline-none focus:border-brand-lime transition-colors"
                                />
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                {(() => {
                                    const record = personalRecords[key];
                                    const currentStr = typeof record === 'string' ? record : (record?.current || "");
                                    const previousStr = typeof record === 'string' ? "" : (record?.previous || "");
                                    
                                    const currentSecs = timeToSeconds(currentStr);
                                    const previousSecs = timeToSeconds(previousStr);
                                    
                                    let diffElement = null;
                                    if (currentSecs > 0 && previousSecs > 0) {
                                        const diff = currentSecs - previousSecs;
                                        if (diff < 0) {
                                            diffElement = <span className="text-green-400 font-mono text-xs font-medium">(-{formatDiff(diff)})</span>;
                                        } else if (diff > 0) {
                                            diffElement = <span className="text-red-400 font-mono text-xs font-medium">(+{formatDiff(diff)})</span>;
                                        }
                                    }

                                    return (
                                        <>
                                            <span className={`text-sm tracking-tight font-semibold min-w-[60px] text-right ${currentStr ? 'text-white font-mono' : 'text-gray-500 italic'}`}>
                                                {currentStr || "Not set"}
                                            </span>
                                            {diffElement}
                                        </>
                                    );
                                })()}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            
            {!isEditing && Object.values(personalRecords).every(v => {
                const current = typeof v === 'string' ? v : (v?.current || "");
                return !current;
            }) && (
                <p className="text-gray-500 text-xs italic text-center mt-2">
                    Click edit to add your PRs
                </p>
            )}
        </div>
    );
}
