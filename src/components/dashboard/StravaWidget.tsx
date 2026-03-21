"use client";

import { useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import {
    buildStravaAuthUrl,
    fetchAthleteStats,
    fetchAllActivities,
    extractPRsFromActivities,
    getValidToken,
    metersToKm,
    fetchAthleteProfile,
    fetchGear,
    type StravaTokenResponse,
} from "@/lib/strava";
import { RefreshCw, LogOut, Zap, MapPin, TrendingUp, Calendar, Activity } from "lucide-react";

// ─── Strava SVG Logo ─────────────────────────────────────────
function StravaLogo({ size = 20 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066l-2.084 4.116zM11.109 0L5.955 10.172h5.15l4.004-7.98 4 7.98h5.15L17.259 0h-6.15z" />
        </svg>
    );
}

type SyncState = "idle" | "syncing" | "success" | "error";

export function StravaWidget() {
    const {
        stravaConnected,
        stravaAccessToken,
        stravaRefreshToken,
        stravaTokenExpiresAt,
        stravaAthleteId,
        stravaAthleteName,
        stravaAthleteAvatar,
        stravaSyncedAt,
        stravaStats,
        connectStrava,
        disconnectStrava,
        updateStravaStats,
        updateStravaShoes,
        setSyncedAt,
        updatePersonalRecord,
    } = useUserStore();

    const [syncState, setSyncState] = useState<SyncState>("idle");
    const [syncError, setSyncError] = useState("");
    const [prsFound, setPrsFound] = useState(0);

    const handleConnect = () => {
        const url = buildStravaAuthUrl();
        window.location.href = url;
    };

    const handleSync = async () => {
        if (!stravaAthleteId || !stravaAccessToken) return;

        setSyncState("syncing");
        setSyncError("");
        setPrsFound(0);

        try {
            // Get a valid token (auto-refresh if needed)
            const token = await getValidToken(
                stravaAccessToken,
                stravaRefreshToken,
                stravaTokenExpiresAt,
                (freshData: StravaTokenResponse) => {
                    connectStrava({
                        accessToken: freshData.access_token,
                        refreshToken: freshData.refresh_token,
                        expiresAt: freshData.expires_at,
                        athleteId: freshData.athlete.id,
                        athleteName: `${freshData.athlete.firstname} ${freshData.athlete.lastname}`.trim(),
                        athleteAvatar: freshData.athlete.profile_medium || "",
                    });
                }
            );

            // 1. Fetch athlete profile (includes shoes)
            const profile = await fetchAthleteProfile(token);
            
            // Strava's /athlete endpoint often returns outdated distances for shoes. 
            // Querying /gear/{id} explicitly gives the true, up-to-date mileage.
            const detailedShoes = await Promise.all((profile.shoes || []).map(async (shoe) => {
                try {
                    const gearInfo = await fetchGear(shoe.id, token);
                    return { ...shoe, distance: gearInfo.distance || shoe.distance };
                } catch (e) {
                    console.error("Failed to fetch detailed gear for", shoe.id, e);
                    return shoe;
                }
            }));

            updateStravaShoes(detailedShoes);

            // 2. Fetch athlete stats (still needed for YTD and recent stats)
            const stats = await fetchAthleteStats(stravaAthleteId, token);
            
            // 3. Fetch ALL activities to extract PRs (up to 5000 runs)
            const activities = await fetchAllActivities(token);
            const prs = extractPRsFromActivities(activities);

            // Calculate true ALL-TIME totals from the raw activity feed.
            // Strava's athlete stats API often excludes "Trail Runs" or "Virtual Runs" from all_run_totals.
            // By summing manually from our full activity list, we get the real >6000km number.
            const trueAllTimeRuns = activities.filter(a => a.type === 'Run' || a.sport_type === 'Run').length;
            const runActivities = activities.filter(a => a.type === 'Run' || a.sport_type === 'Run');
            
            const trueAllTimeDistance = runActivities.reduce((sum, current) => sum + current.distance, 0);
            const trueAllTimeElevation = runActivities.reduce((sum, current) => sum + (current.total_elevation_gain || 0), 0);
            const trueAllTimeMovingTime = runActivities.reduce((sum, current) => sum + (current.moving_time || 0), 0);
            const trueLongestRun = runActivities.reduce((max, current) => current.distance > max ? current.distance : max, 0);

            // Calculate Last 7 Days manually
            const now = new Date();
            const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            
            const weeklyRunsFilter = runActivities.filter(a => new Date(a.start_date) >= sevenDaysAgo);
            const weeklyRunsCount = weeklyRunsFilter.length;
            const weeklyDistanceCount = weeklyRunsFilter.reduce((sum, current) => sum + current.distance, 0);

            updateStravaStats({
                allTimeRuns: trueAllTimeRuns,
                allTimeDistance: trueAllTimeDistance,
                allTimeElevation: trueAllTimeElevation,
                allTimeMovingTime: trueAllTimeMovingTime,
                longestRunDistance: trueLongestRun,
                ytdRuns: stats.ytd_run_totals.count,
                ytdDistance: stats.ytd_run_totals.distance,
                recentRuns: stats.recent_run_totals.count,
                recentDistance: stats.recent_run_totals.distance,
                weeklyRuns: weeklyRunsCount,
                weeklyDistance: weeklyDistanceCount,
            });

            let updatedCount = 0;
            for (const [distance, time] of Object.entries(prs)) {
                updatePersonalRecord(distance as "1km" | "1mi" | "5km" | "10km" | "10mi" | "halfMarathon" | "marathon", time);
                updatedCount++;
            }
            setPrsFound(updatedCount);

            setSyncedAt();
            setSyncState("success");

            // Reset to idle after 4 seconds
            setTimeout(() => setSyncState("idle"), 4000);
        } catch (err) {
            setSyncError(err instanceof Error ? err.message : "Unknown error during sync.");
            setSyncState("error");
            setTimeout(() => setSyncState("idle"), 5000);
        }
    };

    const formatSyncTime = (isoDate: string): string => {
        if (!isoDate) return "Never";
        const d = new Date(isoDate);
        return d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) +
            " at " + d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
    };

    // ─── NOT CONNECTED STATE ──────────────────────────────────────
    if (!stravaConnected) {
        return (
            <div className="bg-brand-surface border border-brand-surface-light hover:border-[#FC4C02]/40 transition-colors rounded-2xl p-6 flex flex-col gap-4 shadow-lg shadow-black/20 relative overflow-hidden">
                {/* Background glow */}
                <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-[#FC4C02]/8 blur-[80px] pointer-events-none rounded-full" />

                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#FC4C02]/10 rounded-lg text-[#FC4C02]">
                        <StravaLogo size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-foreground text-sm tracking-tight">Strava Integration</h3>
                        <p className="text-gray-500 text-xs">Connect to sync your real running data</p>
                    </div>
                </div>

                <div className="flex flex-col gap-2 text-xs text-gray-500 bg-brand-midnight/50 rounded-xl p-3 border border-brand-surface-light">
                    <div className="flex items-center gap-2"><Zap className="w-3 h-3 text-[#FC4C02]" /> Auto-populate PRs from your race history</div>
                    <div className="flex items-center gap-2"><TrendingUp className="w-3 h-3 text-[#FC4C02]" /> All-time &amp; YTD running totals</div>
                    <div className="flex items-center gap-2"><MapPin className="w-3 h-3 text-[#FC4C02]" /> All data stays in your local browser</div>
                </div>

                <button
                    onClick={handleConnect}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white text-sm transition-all bg-[#FC4C02] hover:bg-[#E84402] active:scale-[0.98] shadow-[0_4px_20px_rgba(252,76,2,0.35)] hover:shadow-[0_4px_30px_rgba(252,76,2,0.55)]"
                >
                    <StravaLogo size={18} />
                    Connect with Strava
                </button>
            </div>
        );
    }

    // ─── CONNECTED STATE ──────────────────────────────────────────
    return (
        <div className="bg-brand-surface border border-[#FC4C02]/30 hover:border-[#FC4C02]/60 transition-colors rounded-2xl p-6 flex flex-col gap-4 shadow-lg shadow-black/20 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#FC4C02]/5 blur-[100px] pointer-events-none rounded-full" />

            {/* Header with athlete info */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {stravaAthleteAvatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={stravaAthleteAvatar}
                            alt={stravaAthleteName}
                            className="w-10 h-10 rounded-full border-2 border-[#FC4C02]/40"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-[#FC4C02]/10 flex items-center justify-center text-[#FC4C02]">
                            <StravaLogo size={18} />
                        </div>
                    )}
                    <div>
                        <p className="font-bold text-foreground text-sm leading-tight">{stravaAthleteName}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FC4C02]" />
                            <span className="text-xs text-[#FC4C02] font-medium tracking-wide">STRAVA CONNECTED</span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={disconnectStrava}
                    title="Disconnect Strava"
                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                </button>
            </div>

            {/* Stats Grid */}
            {stravaStats && (
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-brand-midnight rounded-xl p-3 text-center border border-brand-surface-light hover:border-[#FC4C02]/30 transition-colors">
                        <p className="text-xl md:text-2xl font-black text-foreground leading-tight">{stravaStats.allTimeRuns}</p>
                        <p className="text-[10px] sm:text-xs text-gray-500 uppercase font-bold tracking-wider mt-0.5">Total Runs</p>
                    </div>
                    <div className="bg-brand-midnight rounded-xl p-3 text-center border border-brand-surface-light hover:border-[#FC4C02]/30 transition-colors">
                        <p className="text-xl md:text-2xl font-black text-foreground leading-tight">{metersToKm(stravaStats.allTimeDistance)}</p>
                        <p className="text-[10px] sm:text-xs text-gray-500 uppercase font-bold tracking-wider mt-0.5">km Total</p>
                    </div>
                    <div className="bg-brand-midnight rounded-xl p-3 text-center border border-brand-surface-light hover:border-[#FC4C02]/30 transition-colors">
                        <p className="text-xl md:text-2xl font-black text-foreground leading-tight">{metersToKm(stravaStats.ytdDistance)}</p>
                        <p className="text-[10px] sm:text-xs text-gray-500 uppercase font-bold tracking-wider mt-0.5">km YTD</p>
                    </div>
                    <div className="bg-brand-midnight rounded-xl p-3 text-center border border-brand-surface-light hover:border-[#FC4C02]/30 transition-colors">
                        <p className="text-xl md:text-2xl font-black text-foreground leading-tight">{Math.floor((stravaStats.allTimeMovingTime || 0) / 3600)}</p>
                        <p className="text-[10px] sm:text-xs text-gray-500 uppercase font-bold tracking-wider mt-0.5">Hours Run</p>
                    </div>
                    <div className="bg-brand-midnight rounded-xl p-3 text-center border border-brand-surface-light hover:border-[#FC4C02]/30 transition-colors">
                        <p className="text-xl md:text-2xl font-black text-foreground leading-tight">{metersToKm(stravaStats.longestRunDistance || 0)}</p>
                        <p className="text-[10px] sm:text-xs text-gray-500 uppercase font-bold tracking-wider mt-0.5">Longest Dist.</p>
                    </div>
                    <div className="bg-brand-midnight rounded-xl p-3 text-center border border-brand-surface-light hover:border-[#FC4C02]/30 transition-colors">
                        <p className="text-xl md:text-2xl font-black text-foreground leading-tight">{Math.round(stravaStats.allTimeElevation || 0).toLocaleString()}</p>
                        <p className="text-[10px] sm:text-xs text-gray-500 uppercase font-bold tracking-wider mt-0.5">m Elevation</p>
                    </div>
                </div>
            )}

            {/* 7-Day & 4-Week Summary */}
            {stravaStats && (
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between bg-brand-lime/10 rounded-xl p-3 border border-brand-lime/30 shadow-[inset_0_0_15px_rgba(204,255,0,0.05)]">
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-brand-lime shrink-0" />
                            <p className="text-xs text-brand-lime font-bold uppercase tracking-wider">Last 7 Days</p>
                        </div>
                        <p className="text-sm">
                            <span className="text-foreground font-bold">{stravaStats.weeklyRuns ?? 0} runs</span>
                            <span className="text-brand-lime/50 mx-1.5">•</span>
                            <span className="text-brand-lime font-black">{metersToKm(stravaStats.weeklyDistance ?? 0)} km</span>
                        </p>
                    </div>
                    <div className="flex items-center justify-between bg-brand-midnight/50 rounded-xl p-2.5 px-3 border border-brand-surface-light">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Last 4 Weeks</p>
                        </div>
                        <p className="text-xs">
                            <span className="text-gray-300 font-bold">{stravaStats.recentRuns} runs</span>
                            <span className="text-gray-600 mx-1.5">•</span>
                            <span className="text-gray-300 font-bold">{metersToKm(stravaStats.recentDistance)} km</span>
                        </p>
                    </div>
                </div>
            )}

            {/* Prompt when not yet synced */}
            {!stravaStats && syncState === "idle" && (
                <div className="flex items-center gap-2 bg-[#FC4C02]/5 border border-[#FC4C02]/20 rounded-xl p-3">
                    <Zap className="w-4 h-4 text-[#FC4C02] shrink-0" />
                    <p className="text-xs text-gray-400">
                        Click <span className="text-[#FC4C02] font-bold">Sync Data</span> to load your Strava stats and auto-populate your PRs.
                    </p>
                </div>
            )}

            {/* Sync feedback */}
            {syncState === "success" && (
                <div className="text-xs text-brand-lime bg-brand-lime/10 border border-brand-lime/20 rounded-xl px-3 py-2 text-center font-medium">
                    ✓ Synced! {prsFound > 0 ? `${prsFound} PR(s) updated in your Personal Records.` : "No new PRs found in recent activities."}
                </div>
            )}
            {syncState === "error" && (
                <div className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-3 py-2 text-center">
                    ✗ {syncError}
                </div>
            )}

            {/* Sync button + timestamp */}
            <div className="flex items-center gap-2">
                <button
                    onClick={handleSync}
                    disabled={syncState === "syncing"}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white bg-[#FC4C02] hover:bg-[#E84402] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                >
                    <RefreshCw className={`w-4 h-4 ${syncState === "syncing" ? "animate-spin" : ""}`} />
                    {syncState === "syncing" ? "Syncing…" : "Sync Data"}
                </button>
            </div>

            {stravaSyncedAt && (
                <p className="text-center text-[10px] text-gray-600 -mt-2">
                    Last synced: {formatSyncTime(stravaSyncedAt)}
                </p>
            )}
        </div>
    );
}
