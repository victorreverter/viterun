"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { exchangeCodeForToken } from "@/lib/strava";
import { Activity, CheckCircle, XCircle } from "lucide-react";

type Status = "loading" | "success" | "error";

export default function StravaCallbackPage() {
    const { connectStrava } = useUserStore();
    const [status, setStatus] = useState<Status>("loading");
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const errorParam = params.get("error");

        if (errorParam === "access_denied") {
            // using a small timeout escapes the synchronous rule if we have to set state
            setTimeout(() => {
                setStatus("error");
                setErrorMsg("You declined the Strava authorization. You can try again anytime.");
            }, 0);
            return;
        }

        if (!code) {
            setTimeout(() => {
                setStatus("error");
                setErrorMsg("No authorization code was received from Strava.");
            }, 0);
            return;
        }

        exchangeCodeForToken(code)
            .then((data) => {
                connectStrava({
                    accessToken: data.access_token,
                    refreshToken: data.refresh_token,
                    expiresAt: data.expires_at,
                    athleteId: data.athlete.id,
                    athleteName: `${data.athlete.firstname} ${data.athlete.lastname}`.trim(),
                    athleteAvatar: data.athlete.profile_medium || "",
                });
                setStatus("success");
                // Redirect to app root by stripping /strava/callback from the current path
                // Works regardless of basePath: /viterun/strava/callback → /viterun/
                setTimeout(() => {
                    const segments = window.location.pathname.split("/").filter(Boolean);
                    const basePath = segments.slice(0, -2).join("/");
                    window.location.href = window.location.origin + (basePath ? `/${basePath}/` : "/");
                }, 1800);
            })
            .catch((err: Error) => {
                setStatus("error");
                setErrorMsg(err.message || "An unexpected error occurred during the Strava connection.");
            });
    }, [connectStrava]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="bg-brand-surface border border-brand-surface-light rounded-2xl p-10 max-w-md w-full text-center shadow-2xl">
                {status === "loading" && (
                    <>
                        <div className="flex justify-center mb-6">
                            <div className="p-4 bg-[#FC4C02]/10 rounded-2xl">
                                <Activity className="w-10 h-10 text-[#FC4C02] animate-pulse" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-foreground mb-2">Connecting to Strava</h1>
                        <p className="text-gray-400 text-sm">Exchanging authorization token, please wait…</p>
                        <div className="mt-6 flex justify-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-[#FC4C02] animate-bounce [animation-delay:0ms]" />
                            <span className="w-2 h-2 rounded-full bg-[#FC4C02] animate-bounce [animation-delay:150ms]" />
                            <span className="w-2 h-2 rounded-full bg-[#FC4C02] animate-bounce [animation-delay:300ms]" />
                        </div>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="flex justify-center mb-6">
                            <div className="p-4 bg-brand-lime/10 rounded-2xl">
                                <CheckCircle className="w-10 h-10 text-brand-lime" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-foreground mb-2">Connected!</h1>
                        <p className="text-gray-400 text-sm">
                            Your Strava account is now linked. Redirecting you back to the dashboard…
                        </p>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="flex justify-center mb-6">
                            <div className="p-4 bg-red-500/10 rounded-2xl">
                                <XCircle className="w-10 h-10 text-red-400" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-foreground mb-2">Connection Failed</h1>
                        <p className="text-gray-400 text-sm mb-6">{errorMsg}</p>
                        <a
                            href="../"
                            className="inline-block px-6 py-2.5 bg-brand-surface-light text-foreground rounded-xl text-sm font-medium hover:bg-brand-surface-light/80 transition-colors"
                        >
                            Back to Dashboard
                        </a>
                    </>
                )}
            </div>
        </div>
    );
}
