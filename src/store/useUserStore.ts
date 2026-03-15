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
        "1km": string;
        "1mi": string;
        "5km": string;
        "10km": string;
        "10mi": string;
        "halfMarathon": string;
        "marathon": string;
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
                "1km": "",
                "1mi": "",
                "5km": "",
                "10km": "",
                "10mi": "",
                "halfMarathon": "",
                "marathon": "",
            },

            updateField: (field, value) => set((state) => ({ ...state, [field]: value })),
            updatePersonalRecord: (distance, time) => set((state) => ({
                ...state,
                personalRecords: {
                    ...state.personalRecords,
                    [distance]: time
                }
            })),
        }),
        {
            name: 'viterun-user-storage',
        }
    )
);
