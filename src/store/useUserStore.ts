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

    updateField: (field: keyof Omit<UserState, 'updateField'>, value: number | string) => void;
    updatePersonalRecord: (distance: keyof UserState['personalRecords'], time: string) => void;
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

            personalRecords: {
                "1km": { current: "", previous: "" },
                "1mi": { current: "", previous: "" },
                "5km": { current: "", previous: "" },
                "10km": { current: "", previous: "" },
                "10mi": { current: "", previous: "" },
                "halfMarathon": { current: "", previous: "" },
                "marathon": { current: "", previous: "" },
            },

            updateField: (field, value) => set((state) => ({ ...state, [field]: value })),
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
        }),
        {
            name: 'viterun-user-storage',
        }
    )
);
