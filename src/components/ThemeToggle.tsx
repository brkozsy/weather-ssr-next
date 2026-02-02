"use client";

import { useThemeStore } from "@/store/themeStore";

export default function ThemeToggle() {
    const theme = useThemeStore((s) => s.theme);
    const toggleTheme = useThemeStore((s) => s.toggleTheme);

    return (
        <button
            onClick={toggleTheme}
            className="rounded-xl border border-black/10 px-4 py-2 text-sm
                 hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
        >
            {theme === "dark" ? "🌙 Dark" : "🌞 Light"}
        </button>
    );
}
