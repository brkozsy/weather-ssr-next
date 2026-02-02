"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setTheme } from "@/app/actions/setTheme";

type Theme = "light" | "dark";

export default function ThemeToggle({ initialTheme }: { initialTheme: Theme }) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [theme, setLocalTheme] = useState<Theme>(initialTheme);

    useEffect(() => {
        setLocalTheme(initialTheme);
        document.documentElement.classList.toggle("dark", initialTheme === "dark");
    }, [initialTheme]);

    const nextTheme: Theme = theme === "dark" ? "light" : "dark";

    return (
        <button
            disabled={pending}
            onClick={() => {
                setLocalTheme(nextTheme);
                document.documentElement.classList.toggle("dark", nextTheme === "dark");

                startTransition(async () => {
                    await setTheme(nextTheme);
                    router.refresh();
                });
            }}
            className="
        inline-flex items-center gap-2
        rounded-full border px-4 py-2 text-sm font-medium
        bg-white/70 dark:bg-white/5
        border-black/10 dark:border-white/10
        backdrop-blur
        hover:bg-black/5 dark:hover:bg-white/10
        transition disabled:opacity-60
      "
        >
            {theme === "dark" ? "🌙 Dark" : "🌞 Light"}
        </button>
    );
}
