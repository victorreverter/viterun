"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";

export function ThemeProvider() {
    const { theme } = useUserStore();

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    return null;
}
