"use client";

import { useUserStore } from "@/store/useUserStore";
import { Activity, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2 } from "lucide-react";

export function TrainingLoadWidget() {
    const { stravaConnected, stravaStats } = useUserStore();

    // If no strava connection or stats, return empty/prompt state
    if (!stravaConnected || !stravaStats) {
        return (
            <div className="bg-brand-surface border border-brand-surface-light rounded-2xl p-6 shadow-lg shadow-black/20 flex flex-col h-full relative overflow-hidden group">
                <div className="flex items-center gap-3 mb-4 opacity-50">
                    <div className="p-2.5 bg-brand-surface-light rounded-xl text-brand-lime grayscale">
                        <Activity className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold tracking-tight text-foreground leading-tight">Training Load</h2>
                        <p className="text-xs text-gray-500 font-medium">Injury Predictor (ACWR)</p>
                    </div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
                    <Activity className="w-8 h-8 text-gray-600 mb-3" />
                    <p className="text-sm font-bold text-gray-400">Connect Strava</p>
                    <p className="text-xs text-gray-500 mt-1 max-w-[200px]">Sync your activities to automatically unlock your Acute-to-Chronic Workload Ratio.</p>
                </div>
            </div>
        );
    }

    // Mathematical calculations
    const acuteMeters = stravaStats.weeklyDistance || 0;
    const recentMeters = stravaStats.recentDistance || 0; // last 4 weeks total

    const acuteKm = acuteMeters / 1000;
    const chronicKm = (recentMeters / 1000) / 4; // Average weekly volume over last 4 weeks

    // Safely calculate ratio
    const ratio = chronicKm > 0 ? (acuteKm / chronicKm) : (acuteKm > 0 ? 1.5 : 0);

    // Determine Status
    let status = { text: "Undertraining", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/30", icon: TrendingDown, desc: "Fitness detraining" };
    
    if (ratio >= 0.8 && ratio <= 1.3) {
        status = { text: "Sweet Spot", color: "text-brand-lime", bg: "bg-brand-lime/10", border: "border-brand-lime/30", icon: CheckCircle2, desc: "Building fitness safely" };
    } else if (ratio > 1.3 && ratio <= 1.5) {
        status = { text: "Caution Zone", color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/30", icon: TrendingUp, desc: "Monitor fatigue levels" };
    } else if (ratio > 1.5) {
        status = { text: "Danger Zone", color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/30", icon: AlertTriangle, desc: "High injury risk" };
    }
    
    // If absolutely zero running data
    if (acuteKm === 0 && chronicKm === 0) {
        status = { text: "No Data", color: "text-gray-400", bg: "bg-gray-400/10", border: "border-gray-400/30", icon: Activity, desc: "Log a run to start" };
    }

    // Gauge math (clamp between 0 and 2.5 for visualization)
    const gaugeFillPercent = Math.min((ratio / 2.0) * 100, 100);

    return (
        <div className={`bg-brand-surface border border-brand-surface-light hover:${status.border} transition-colors rounded-2xl p-6 shadow-lg shadow-black/20 flex flex-col h-full overflow-hidden relative group`}>
            {/* Dynamic Ambient Glow */}
            <div className={`absolute -bottom-20 -right-20 w-48 h-48 blur-[80px] pointer-events-none rounded-full transition-colors ${status.bg}`} />

            {/* Header */}
            <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className={`p-2.5 bg-brand-surface-light rounded-xl ${status.color}`}>
                    <Activity className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-lg font-bold tracking-tight text-foreground leading-tight">Training Load</h2>
                    <p className="text-xs text-gray-500 font-medium tracking-wide">ACWR INJURY PREDICTOR</p>
                </div>
            </div>

            {/* Gauge Display */}
            <div className="flex flex-col items-center justify-center mb-6 relative z-10">
                <div className="relative w-32 h-16 flex items-end justify-center overflow-hidden mb-2">
                    {/* Background Arc */}
                    <div className="absolute top-0 w-32 h-32 rounded-full border-[12px] border-brand-surface-light/50" />
                    
                    {/* Foreground Colored Arc */}
                    <div 
                        className="absolute top-0 w-32 h-32 rounded-full border-[12px] border-transparent"
                        style={{
                            borderTopColor: "currentColor",
                            borderRightColor: "currentColor",
                            transform: `rotate(${ -45 + (gaugeFillPercent * 1.8) }deg)`,
                            transition: "transform 1s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                    >
                        <div className={`w-full h-full ${status.color}`} style={{ color: "inherit" }} />
                    </div>
                    
                    {/* Inner Readout */}
                    <div className="absolute bottom-1 bg-brand-surface w-20 h-10 rounded-t-full flex items-end justify-center pb-1">
                        <span className="text-3xl font-black tracking-tighter text-foreground">{ratio.toFixed(2)}</span>
                    </div>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${status.bg} ${status.border} ${status.color}`}>
                    <status.icon className="w-3.5 h-3.5" />
                    {status.text}
                </div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2">{status.desc}</p>
            </div>

            {/* Data Breakdown */}
            <div className="grid grid-cols-2 gap-3 mt-auto relative z-10">
                <div className="bg-brand-midnight/60 border border-brand-surface-light rounded-xl p-3 flex flex-col items-center text-center">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-1">Acute (7 Days)</span>
                    <span className="text-sm font-black text-foreground">{acuteKm.toFixed(1)} <span className="text-[10px] font-bold text-gray-500">km</span></span>
                </div>
                <div className="bg-brand-midnight/60 border border-brand-surface-light rounded-xl p-3 flex flex-col items-center text-center">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-1">Chronic (4 Wks avg)</span>
                    <span className="text-sm font-black text-foreground">{chronicKm.toFixed(1)} <span className="text-[10px] font-bold text-gray-500">km</span></span>
                </div>
            </div>
            
        </div>
    );
}
