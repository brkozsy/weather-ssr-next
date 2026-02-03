// src/components/Forecast5Day.tsx
import type { ForecastDayDTO } from "@/lib/openweather";

function t(n: number) {
    return `${Math.round(n)}°`;
}

export default function Forecast5Day({ days }: { days: ForecastDayDTO[] }) {
    return (
        <section
            className="
        rounded-3xl p-4 sm:p-5 ring-1 backdrop-blur-2xl
        bg-white/25 ring-black/10
        dark:bg-white/5 dark:ring-white/10
      "
        >
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold tracking-wide opacity-80">
                    5 GÜNLÜK TAHMİN
                </h3>
                <p className="text-xs opacity-60">Min / Max</p>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3">
                {days.map((d) => {
                    const iconUrl = `https://openweathermap.org/img/wn/${d.icon}@2x.png`;
                    const popPct = Math.round(d.pop * 100);

                    return (
                        <div
                            key={d.dateISO}
                            className="
                flex items-center justify-between gap-4 rounded-2xl px-4 py-3 ring-1
                bg-white/45 ring-black/10
                dark:bg-zinc-800/50 dark:ring-white/10
              "
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-12 text-sm font-semibold">{d.label}</div>
                                <img src={iconUrl} alt={d.main} className="h-10 w-10 drop-shadow-sm" />

                                <div className="min-w-0">
                                    <div className="truncate text-sm capitalize opacity-85">
                                        {d.description}
                                    </div>
                                    <div className="text-xs opacity-60">
                                        Yağış: {popPct}%
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <span className="opacity-80">{t(d.min)}</span>
                                <span className="opacity-40">•</span>
                                <span>{t(d.max)}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
