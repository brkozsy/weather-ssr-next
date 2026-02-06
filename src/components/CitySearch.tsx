"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TR_CITIES } from "@/lib/trCities";

export default function CitySearch() {
    const router = useRouter();
    const [q, setQ] = useState("");
    const [open, setOpen] = useState(false);
    const wrapRef = useRef<HTMLDivElement>(null);

    const suggestions = useMemo(() => {
        if (q.length < 1) return [];
        const search = q.toLocaleLowerCase("tr");
        return TR_CITIES.filter((c) => c.toLocaleLowerCase("tr").startsWith(search)).slice(0, 5);
    }, [q]);

    const handleSelect = (city: string) => {
        setQ(city);
        setOpen(false);
        router.push(`/?q=${encodeURIComponent(city)}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && q.trim()) handleSelect(q);
    };

    useEffect(() => {
        const clickOutside = (e: MouseEvent) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", clickOutside);
        return () => document.removeEventListener("mousedown", clickOutside);
    }, []);

    return (
        <div ref={wrapRef} className="relative z-50 w-full max-w-2xl">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={q}
                        onChange={(e) => { setQ(e.target.value); setOpen(true); }}
                        onFocus={() => setOpen(true)}
                        onKeyDown={handleKeyDown}
                        placeholder="Şehir ara..."
                        className="w-full rounded-2xl border-0 bg-white py-3.5 pl-5 pr-4 text-slate-800 shadow-xl shadow-slate-200/50 ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:text-white dark:shadow-none dark:ring-white/10"
                    />
                </div>

                <button
                    onClick={() => { setQ(""); router.push("/"); }}
                    className="flex items-center gap-2 rounded-2xl bg-blue-500 px-5 font-semibold text-white shadow-lg transition hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <span className="hidden sm:inline">Konumum</span>
                </button>
            </div>

            {open && suggestions.length > 0 && (
                <div className="absolute top-full mt-2 w-full overflow-hidden rounded-2xl border border-slate-100 bg-white/95 p-1 shadow-2xl backdrop-blur-xl dark:border-white/5 dark:bg-slate-900/95">
                    {suggestions.map((city) => (
                        <button
                            key={city}
                            onClick={() => handleSelect(city)}
                            className="w-full rounded-xl px-4 py-3 text-left text-slate-700 transition hover:bg-blue-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-white/5"
                        >
                            {city}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}