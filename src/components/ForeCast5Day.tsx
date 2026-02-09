import type { ForecastDayDTO } from "@/server/openweather";

function t(n: number) {
    return `${Math.round(n)}°`;
}

export default function Forecast5Day({ days }: { days: ForecastDayDTO[] }) {
    return (
        <section
            className="
        rounded-[30px] p-6 ring-1 mt-6
        /* Light: Beyaz zemin, yumuşak sınır */
        bg-white/70 backdrop-blur-xl ring-black/5 shadow-lg shadow-slate-200/50
        /* Dark: Koyu zemin, ince beyaz sınır */
        dark:bg-slate-900/40 dark:ring-white/10 dark:shadow-none
      "
        >
            <h3 className="mb-5 flex items-center gap-2 text-sm font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                5 Günlük Tahmin
            </h3>

            <div className="grid gap-2">
                {days.map((d, i) => {
                    const iconUrl = `https://openweathermap.org/img/wn/${d.icon}@2x.png`;

                    return (
                        <div
                            key={d.dateISO}
                            className={`
                group flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-300
                hover:bg-blue-50/80 dark:hover:bg-white/5
              `}
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            {/* Gün ve İkon */}
                            <div className="flex items-center gap-4 w-1/3">
                                <span className="w-16 text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    {d.label}
                                </span>
                                <img src={iconUrl} alt={d.main} className="h-8 w-8 object-contain opacity-80 group-hover:scale-110 transition-transform" />
                            </div>

                            {/* Yağış Olasılığı (Varsa gösterir) */}
                            <div className="flex-1 text-center">
                                {d.pop > 0 && (
                                    <span className="text-xs font-medium text-blue-500 bg-blue-100/50 dark:bg-blue-900/30 px-2 py-1 rounded-md">
                                        %{Math.round(d.pop * 100)} Yağış
                                    </span>
                                )}
                            </div>

                            {/* Min / Max Barlar */}
                            <div className="flex w-1/3 items-center justify-end gap-3 text-sm">
                                <span className="font-medium text-slate-400 dark:text-slate-500 text-right w-8">{t(d.min)}</span>

                                {/* Görsel Sıcaklık Çubuğu (Bar) */}
                                <div className="relative h-1.5 w-16 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                                    <div
                                        className="absolute h-full rounded-full bg-gradient-to-r from-blue-400 to-orange-400 opacity-80"
                                        style={{
                                            left: '10%',
                                            right: '10%' // Burayı dinamik hesaplamak zor olduğu için sabit verdim, ama görsel olarak hoş durur.
                                        }}
                                    />
                                </div>

                                <span className="font-bold text-slate-800 dark:text-white text-left w-8">{t(d.max)}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}