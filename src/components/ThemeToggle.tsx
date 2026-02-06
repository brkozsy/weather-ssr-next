"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Hydration mismatch hatasını önlemek için:
    // Bileşen sadece tarayıcıda yüklendikten sonra render edilmeli.
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // Layout kaymasını önlemek için boş ama aynı boyutta bir div
        return <div className="h-9 w-24 rounded-2xl bg-black/5 dark:bg-white/5" />;
    }

    // resolvedTheme: Sistem ayarını da dikkate alır (Auto/Dark/Light)
    const isDark = resolvedTheme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition-colors
      bg-white/50 text-zinc-800 hover:bg-white/80
      dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700
      ring-1 ring-zinc-900/5 dark:ring-white/10"
            aria-label="Temayı değiştir"
        >
            <span>{isDark ? "☀️" : "🌙"}</span>
            <span>{isDark ? "Açık" : "Koyu"}</span>
        </button>
    );
}