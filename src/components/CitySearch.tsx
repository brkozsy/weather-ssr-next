"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, useEffect } from "react";

type Place = {
    name: string;
    country: string;
    state: string | null;
    lat: number;
    lon: number;
};

export default function CitySearch() {
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const [q, setQ] = useState("");
    const [err, setErr] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        setMounted(true);
    }, []);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);

        const query = q.trim();
        if (query.length < 2) {
            setErr("En az 2 karakter gir.");
            return;
        }

        const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`, {
            cache: "no-store",
        });

        const json = await res.json().catch(() => null);

        if (!res.ok || !json?.ok) {
            setErr(json?.error ?? "Bir hata oluştu.");
            return;
        }

        const place: Place = json.place;
        const url = `/?lat=${place.lat}&lon=${place.lon}&q=${encodeURIComponent(place.name)}`;

        startTransition(() => {
            router.push(url);
            router.refresh();
        });
    }

    function clear() {
        setQ("");
        setErr(null);
        startTransition(() => {
            router.push(`/`);
            router.refresh();
        });
    }



    return (
        <div
            suppressHydrationWarning={true}
            className="rounded-3xl p-4 sm:p-5 ring-1 backdrop-blur-2xl bg-white/25 ring-black/10 dark:bg-white/5 dark:ring-white/10"
        >
            <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold tracking-wide opacity-80">
                    Şehir Ara
                </h3>

                <button
                    type="button"
                    onClick={clear}
                    className="text-xs opacity-70 hover:opacity-100 underline underline-offset-4"
                    disabled={isPending}
                >
                    Sıfırla
                </button>
            </div>

            <form onSubmit={onSubmit} className="mt-3 flex gap-2">
                <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Örn: Eskişehir, Ankara..."
                    suppressHydrationWarning={true}
                    className="w-full rounded-2xl px-4 py-3 ring-1 outline-none bg-white/50 ring-black/10 dark:bg-zinc-900/60 dark:ring-white/10"
                />

                <button
                    disabled={isPending}
                    suppressHydrationWarning={true}
                    className="rounded-2xl px-4 py-3 text-sm font-medium ring-1 bg-zinc-900 text-white ring-black/10 dark:bg-white/10 dark:text-zinc-50 dark:ring-white/10 disabled:opacity-60"
                >
                    {isPending ? "Aranıyor..." : "Ara"}
                </button>
            </form>

            {err && (
                <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                    {err}
                </p>
            )}
        </div>
    );
}