import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserState {
    age: number | '';
    restingHR: number | '';
    maxHR: number | '';
    weight: number | '';
    height: number | ''; // in cm
    neck: number | '';
    waist: number | '';
    hips: number | ''; // for females
    gender: 'male' | 'female';

    // Target Next Race Tracker
    nextRaceName: string;
    nextRaceDate: string; // ISO String Date

    // Base Race times (e.g. 10k, HM) in minutes to predict full marathon
    baselineDistance: number | ''; // km
    baselineTime: number | ''; // minutes

    // Target Pace
    targetPace: string;
    shouldHighlightPaceCalculator: boolean;

    // Theme
    theme: 'dark' | 'light';

    // Personal Records
    personalRecords: {
        "1km": { current: string; previous: string };
        "1mi": { current: string; previous: string };
        "5km": { current: string; previous: string };
        "10km": { current: string; previous: string };
        "10mi": { current: string; previous: string };
        "halfMarathon": { current: string; previous: string };
        "marathon": { current: string; previous: string };
    };

    // ─── Strava Integration ─────────────────────────────────────
    stravaConnected: boolean;
    stravaAccessToken: string;
    stravaRefreshToken: string;
    stravaTokenExpiresAt: number; // Unix timestamp in seconds
    stravaAthleteId: number | null;
    stravaAthleteName: string;
    stravaAthleteAvatar: string;
    stravaSyncedAt: string; // ISO date string, empty if never synced
    stravaShoes: { id: string; name: string; distance: number; primary: boolean }[] | null;
    stravaStats: {
        allTimeRuns: number;
        allTimeDistance: number;   // meters
        allTimeElevation: number;  // meters
        allTimeMovingTime: number; // seconds
        longestRunDistance: number; // meters
        ytdRuns: number;
        ytdDistance: number;       // meters
        recentRuns: number;
        recentDistance: number;    // meters
        weeklyRuns: number;
        weeklyDistance: number;    // meters
    } | null;

    // ─── Actions ─────────────────────────────────────────────────
    updateField: (field: keyof Omit<UserState, 'updateField' | 'triggerPaceHighlight' | 'toggleTheme' | 'updatePersonalRecord' | 'connectStrava' | 'disconnectStrava' | 'updateStravaStats' | 'setSyncedAt'>, value: number | string | boolean) => void;
    updatePersonalRecord: (distance: keyof UserState['personalRecords'], time: string) => void;
    triggerPaceHighlight: () => void;
    toggleTheme: () => void;

    connectStrava: (data: { accessToken: string; refreshToken: string; expiresAt: number; athleteId: number; athleteName: string; athleteAvatar: string }) => void;
    disconnectStrava: () => void;
    updateStravaStats: (stats: NonNullable<UserState['stravaStats']>) => void;
    updateStravaShoes: (shoes: NonNullable<UserState['stravaShoes']>) => void;
    setSyncedAt: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            age: '',
            restingHR: '',
            maxHR: '',
            weight: '',
            height: '',
            neck: '',
            waist: '',
            hips: '',
            gender: 'male',

            nextRaceName: '',
            nextRaceDate: '',

            baselineDistance: 10,
            baselineTime: 50,
            targetPace: '',
            shouldHighlightPaceCalculator: false,
            
            theme: 'dark',

            personalRecords: {
                "1km": { current: "", previous: "" },
                "1mi": { current: "", previous: "" },
                "5km": { current: "", previous: "" },
                "10km": { current: "", previous: "" },
                "10mi": { current: "", previous: "" },
                "halfMarathon": { current: "", previous: "" },
                "marathon": { current: "", previous: "" },
            },

            // Strava defaults
            stravaConnected: false,
            stravaAccessToken: '',
            stravaRefreshToken: '',
            stravaTokenExpiresAt: 0,
            stravaAthleteId: null,
            stravaAthleteName: '',
            stravaAthleteAvatar: '',
            stravaSyncedAt: '',
            stravaShoes: null,
            stravaStats: null,

            // ─── Actions ────────────────────────────────────────────
            updateField: (field, value) => set((state) => ({ ...state, [field]: value })),
            
            triggerPaceHighlight: () => {
                set({ shouldHighlightPaceCalculator: true });
                setTimeout(() => {
                    set({ shouldHighlightPaceCalculator: false });
                }, 2000);
            },
            
            toggleTheme: () => set((state) => ({ 
                theme: state.theme === 'dark' ? 'light' : 'dark' 
            })),

            updatePersonalRecord: (distance, time) => set((state) => {
                const existing = state.personalRecords[distance];
                
                // Handle backwards compatibility for users who might have old string records
                // If it's a string, treat it as the 'current' to be pushed to 'previous'
                let prevTime = "";
                if (typeof existing === 'string') {
                    prevTime = existing;
                } else if (existing?.current) {
                    prevTime = existing.current;
                }

                // If they enter the exact same time, don't update previous
                if (prevTime === time) {
                    return state;
                }

                return {
                    ...state,
                    personalRecords: {
                        ...state.personalRecords,
                        [distance]: {
                            current: time,
                            previous: prevTime
                        }
                    }
                };
            }),

            // Strava actions
            connectStrava: ({ accessToken, refreshToken, expiresAt, athleteId, athleteName, athleteAvatar }) =>
                set({
                    stravaConnected: true,
                    stravaAccessToken: accessToken,
                    stravaRefreshToken: refreshToken,
                    stravaTokenExpiresAt: expiresAt,
                    stravaAthleteId: athleteId,
                    stravaAthleteName: athleteName,
                    stravaAthleteAvatar: athleteAvatar,
                }),

            disconnectStrava: () =>
                set({
                    stravaConnected: false,
                    stravaAccessToken: '',
                    stravaRefreshToken: '',
                    stravaTokenExpiresAt: 0,
                    stravaAthleteId: null,
                    stravaAthleteName: '',
                    stravaAthleteAvatar: '',
                    stravaSyncedAt: '',
                    stravaShoes: null,
                    stravaStats: null,
                }),

            updateStravaStats: (stats) => set({ stravaStats: stats }),
            updateStravaShoes: (shoes) => set({ stravaShoes: shoes }),

            setSyncedAt: () => set({ stravaSyncedAt: new Date().toISOString() }),
        }),
        {
            name: 'viterun-user-storage',
        }
    )
);
