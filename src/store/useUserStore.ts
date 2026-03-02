import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
    age: number | '';
    restingHR: number | '';
    maxHR: number | '';
    weight: number | '';
    height: number | ''; // in cm
    neck: number | '';
    waist: number | '';
    hips: number | ''; // for females
    gender: 'male' | 'female';

    // Base Race times (e.g. 10k, HM) in minutes to predict full marathon
    baselineDistance: number | ''; // km
    baselineTime: number | ''; // minutes

    updateField: (field: keyof Omit<UserState, 'updateField'>, value: number | string) => void;
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

            baselineDistance: 10,
            baselineTime: 50,

            updateField: (field, value) => set((state) => ({ ...state, [field]: value })),
        }),
        {
            name: 'viterun-user-storage',
        }
    )
);
