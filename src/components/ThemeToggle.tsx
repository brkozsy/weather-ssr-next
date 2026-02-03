"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

type Theme = "light" | "dark";

export default function ThemeToggle({ initialTheme }: { initialTheme: Theme }) {
    const router = useRouter();
    const [theme, setTheme] = useState<Theme>(initialTheme);
    const [mounted, setMounted] = useState(false);
    const [isPending, startTransition] = useTransition();

    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    async function toggle() {
        const next: Theme = theme === "dark" ? "light" : "dark";

        setTheme(next);
        document.documentElement.classList.toggle("dark", next === "dark");

        await fetch("/api/theme", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
            cache: "no-store",
            body: JSON.stringify({ theme: next }),
        });

        startTransition(() => router.refresh());


    }

    const icon = theme === "dark" ? "🌙" : "☀️";
    const label = theme === "dark" ? "Dark" : "Light";

    return (
        <button
            disabled={isPending}
            onClick={toggle}
            className="
        inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium
        backdrop-blur-xl ring-1 transition active:scale-[0.97] disabled:opacity-60
        bg-white/30 ring-black/10 hover:bg-white/40
        dark:bg-white/10 dark:ring-white/10 dark:hover:bg-white/15
      "
        >
            <span className="text-base">{icon}</span>
            <span>{label}</span>
        </button>
    );
}
