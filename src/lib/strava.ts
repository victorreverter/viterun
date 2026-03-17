// Strava OAuth & API utility functions for client-side integration.
// Note: for a purely static/GitHub Pages app, the client secret is baked into
// the JS bundle via NEXT_PUBLIC_ env vars. This is an accepted tradeoff for
// frontend-only apps. If this app later moves to a backend, the token exchange
// should be moved server-side.

const CLIENT_ID = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID || '';
const CLIENT_SECRET = process.env.NEXT_PUBLIC_STRAVA_CLIENT_SECRET || '';
const REDIRECT_URI = process.env.NEXT_PUBLIC_STRAVA_REDIRECT_URI || '';

export const STRAVA_API_BASE = 'https://www.strava.com/api/v3';

// ─── Auth ────────────────────────────────────────────────────

export function buildStravaAuthUrl(): string {
    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        response_type: 'code',
        approval_prompt: 'auto',
        scope: 'read,activity:read_all,profile:read_all',
    });
    return `https://www.strava.com/oauth/authorize?${params.toString()}`;
}

export interface StravaAthlete {
    id: number;
    firstname: string;
    lastname: string;
    profile_medium: string; // Avatar URL
    weight?: number; // kg
    sex?: 'M' | 'F';
}

export interface StravaTokenResponse {
    access_token: string;
    refresh_token: string;
    expires_at: number; // Unix timestamp (seconds)
    athlete: StravaAthlete;
}

export async function exchangeCodeForToken(code: string): Promise<StravaTokenResponse> {
    const res = await fetch('https://www.strava.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code,
            grant_type: 'authorization_code',
        }),
    });
    if (!res.ok) {
        const body = await res.text();
        throw new Error(`Strava token exchange failed: ${body}`);
    }
    return res.json();
}

export async function refreshStravaToken(refreshToken: string): Promise<StravaTokenResponse> {
    const res = await fetch('https://www.strava.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
        }),
    });
    if (!res.ok) throw new Error('Strava token refresh failed');
    return res.json();
}

// Returns a valid access token, refreshing if within 5 min of expiry
export async function getValidToken(
    accessToken: string,
    refreshToken: string,
    expiresAt: number,
    onRefreshed: (data: StravaTokenResponse) => void
): Promise<string> {
    const nowSeconds = Math.floor(Date.now() / 1000);
    if (expiresAt - nowSeconds < 300) {
        const fresh = await refreshStravaToken(refreshToken);
        onRefreshed(fresh);
        return fresh.access_token;
    }
    return accessToken;
}

// ─── API Calls ───────────────────────────────────────────────

export interface StravaRunTotals {
    count: number;
    distance: number;       // meters
    elevation_gain: number; // meters
    elapsed_time: number;   // seconds
}

export interface StravaAthleteStats {
    all_run_totals: StravaRunTotals;
    ytd_run_totals: StravaRunTotals;
    recent_run_totals: StravaRunTotals;
    biggest_run_distance: number;
}

export async function fetchAthleteStats(athleteId: number, accessToken: string): Promise<StravaAthleteStats> {
    const res = await fetch(`${STRAVA_API_BASE}/athletes/${athleteId}/stats`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error('Failed to fetch athlete stats');
    return res.json();
}

export interface StravaActivity {
    id: number;
    name: string;
    type: string;
    sport_type: string;
    distance: number;     // meters
    moving_time: number;  // seconds
    elapsed_time: number; // seconds
    start_date: string;
    total_elevation_gain: number; // meters
    average_heartrate?: number;
    max_heartrate?: number;
}

export async function fetchActivities(accessToken: string, perPage = 200): Promise<StravaActivity[]> {
    // Fetch only running activities to speed up PR extraction
    const res = await fetch(`${STRAVA_API_BASE}/athlete/activities?per_page=${perPage}&sport_type=Run`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error('Failed to fetch activities');
    return res.json();
}

// ─── Data Conversion ─────────────────────────────────────────

export function secondsToTime(totalSeconds: number): string {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

// Converts meters to "X.X km"
export function metersToKm(meters: number): string {
    return (meters / 1000).toFixed(1);
}

// Extracts approximate PRs by finding the fastest run per standard race distance.
// Uses a tolerance window (e.g., 5K race = 4.8k–5.2k) since GPS isn't perfect.
export function extractPRsFromActivities(activities: StravaActivity[]): Record<string, string> {
    const runActivities = activities.filter(
        (a) => (a.type === 'Run' || a.sport_type === 'Run') && a.distance > 0 && a.moving_time > 0
    );

    // [minMeters, maxMeters] for each PR category.
    // Wider windows account for GPS drift on watches and irregular course markings.
    const DISTANCE_RANGES: Record<string, [number, number]> = {
        '1km':          [800,   1200],   // 0.8k–1.2k (track 1k efforts vary)
        '1mi':          [1500,  1750],   // standard mile with tolerance
        '5km':          [4500,  5600],   // 4.5k–5.6k (GPS, road races vary)
        '10km':         [9200,  11000],  // 9.2k–11k
        '10mi':         [15400, 16900],  // 15.4k–16.9k
        'halfMarathon': [20000, 22000],  // 20k–22k
        'marathon':     [41000, 43500],  // 41k–43.5k
    };

    const bests: Record<string, { seconds: number; time: string }> = {};

    for (const activity of runActivities) {
        for (const [prKey, [minM, maxM]] of Object.entries(DISTANCE_RANGES)) {
            if (activity.distance >= minM && activity.distance <= maxM) {
                const existing = bests[prKey];
                if (!existing || activity.moving_time < existing.seconds) {
                    bests[prKey] = {
                        seconds: activity.moving_time,
                        time: secondsToTime(activity.moving_time),
                    };
                }
            }
        }
    }

    return Object.fromEntries(Object.entries(bests).map(([k, v]) => [k, v.time]));
}
