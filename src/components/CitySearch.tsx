"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { TR_CITIES } from "@/lib/trCities";
type Suggestion = { label: string; value: string };

export default function CitySearch() {
    const router = useRouter();
    const [q, setQ] = useState("");
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(0);
    const wrapRef = useRef<HTMLDivElement>(null);

    const suggestions: Suggestion[] = useMemo(() => {
        const s = q.trim().toLocaleLowerCase("tr");
        if (s.length < 1) return [];
        return TR_CITIES.filter((c) => c.toLocaleLowerCase("tr").startsWith(s))
            .slice(0, 8)
            .map((c) => ({ label: c, value: c }));
    }, [q]);

    // dışarı tıklayınca kapat
    useEffect(() => {
        function onDoc(e: MouseEvent) {
            if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener("mousedown", onDoc);
        return () => document.removeEventListener("mousedown", onDoc);
    }, []);

    function select(value: string) {
        setQ(value);
        setOpen(false);
        setActive(0);
        router.push(`/?q=${encodeURIComponent(value)}`);
    }

    function goMyLocation() {
        setQ("");
        setOpen(false);
        setActive(0);
        router.push("/");
    }

    function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) setOpen(true);

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((i) => Math.min(i + 1, suggestions.length - 1));
        }
        if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((i) => Math.max(i - 1, 0));
        }
        if (e.key === "Enter") {
            if (open && suggestions[active]) {
                e.preventDefault();
                select(suggestions[active].value);
            } else if (q.trim()) {
                e.preventDefault();
                select(q.trim());
            }
        }
        if (e.key === "Escape") setOpen(false);
    }

    return (
        <div ref={wrapRef} className="relative w-full max-w-3xl">
            <div className="flex items-center gap-2">
                <input
                    value={q}
                    onChange={(e) => {
                        setQ(e.target.value);
                        setOpen(true);
                        setActive(0);
                    }}
                    onFocus={() => setOpen(true)}
                    onKeyDown={onKeyDown}
                    placeholder="Şehir ara… (örn. Ankara)"
                    className="w-full flex-1 rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-black/10 backdrop-blur-xl dark:ring-white/15"
                />

                <button
                    type="button"
                    onClick={goMyLocation}
                    className="shrink-0 rounded-2xl px-4 py-3 text-sm font-medium ring-1 ring-black/10 backdrop-blur-xl hover:bg-black/5 dark:ring-white/15 dark:hover:bg-white/5"
                    title="Kendi konumunun hava durumuna dön"
                >
                    Konumuma dön
                </button>
            </div>

            {open && suggestions.length > 0 && (
                <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl bg-white/80 ring-1 ring-black/10 backdrop-blur-xl dark:bg-black/60 dark:ring-white/15">
                    {suggestions.map((s, idx) => (
                        <button
                            key={s.value}
                            type="button"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                select(s.value);
                            }}
                            className={[
                                "flex w-full items-center justify-between px-4 py-2 text-left text-sm",
                                idx === active
                                    ? "bg-black/10 dark:bg-white/10"
                                    : "hover:bg-black/5 dark:hover:bg-white/5",
                            ].join(" ")}
                        >
                            <span className="font-medium">{s.label}</span>
                            <span className="text-xs opacity-60">TR</span>
                        </button>

                    ))}
                </div>
            )}
        </div>
    );
}
