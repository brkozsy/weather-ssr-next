type Props = {
    city: string;
    description: string;
    temp: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    fetchedAt: string;
    tempMin: number;
    tempMax: number;
    icon: string;
};

// İstatistik kutucukları için modern bileşen
function Stat({ label, value, delay }: { label: string; value: string; delay: string }) {
    return (
        <div
            className={`
        flex flex-col items-center justify-center rounded-2xl p-3 text-center ring-1 transition-all duration-300 hover:scale-105
        /* Light Mod: Temiz beyaz kart */
        bg-white/60 ring-black/5 shadow-sm text-slate-700
        /* Dark Mod: Koyu cam, beyaz yazı */
        dark:bg-white/5 dark:ring-white/10 dark:text-slate-200
        animate-in fade-in slide-in-from-bottom-2
      `}
            style={{ animationDelay: delay }}
        >
            <p className="text-[10px] uppercase tracking-wider opacity-60 font-bold">{label}</p>
            <p className="mt-1 text-lg font-bold tracking-tight">{value}</p>
        </div>
    );
}

function t(n: number) {
    return `${Math.round(n)}°`;
}

export default function WeatherCard({
    city,
    description,
    temp,
    feelsLike,
    humidity,
    windSpeed,
    tempMin,
    tempMax,
    icon,
    fetchedAt,
}: Props) {
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@4x.png`; // @4x daha net ikon verir

    return (
        <section className="relative group">
            {/* Arka plan Glow Efekti (Sadece Dark Modda belirginleşir) */}
            <div className="absolute -inset-1 rounded-[32px] bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 blur-xl transition duration-500 group-hover:opacity-40 dark:opacity-40" />

            <div
                className="
          relative overflow-hidden rounded-[30px] p-6 sm:p-8 ring-1 transition-all duration-500
          /* Light Mod: Şık, hafif gölgeli, buzlu cam */
          bg-white/80 backdrop-blur-3xl ring-white/60 shadow-xl shadow-blue-900/5
          /* Dark Mod: Derin koyu zemin, ince beyaz kenarlık */
          dark:bg-slate-900/60 dark:ring-white/10 dark:shadow-black/50
        "
            >
                {/* Üst Kısım: Şehir ve Sıcaklık */}
                <div className="flex flex-col-reverse sm:flex-row sm:items-start sm:justify-between gap-6">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-extrabold tracking-tight text-slate-800 dark:text-white sm:text-5xl">
                            {city}
                        </h1>
                        <p className="text-lg font-medium capitalize text-blue-600 dark:text-blue-300">
                            {description}
                        </p>
                        <div className="flex items-center gap-2 pt-2">
                            <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                            <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                                {fetchedAt} itibarıyla
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                        {/* İkon */}
                        <div className="relative h-24 w-24 sm:h-28 sm:w-28 -my-4">
                            <img src={iconUrl} alt={description} className="h-full w-full object-contain drop-shadow-2xl filter" />
                        </div>

                        <div className="text-right">
                            {/* Dev Sıcaklık Yazısı */}
                            <div className="text-7xl font-bold tracking-tighter text-slate-900 dark:text-white sm:text-8xl">
                                {t(temp)}
                            </div>
                            {/* Min/Max Hapı */}
                            <div className="mt-1 inline-flex items-center gap-3 rounded-full bg-slate-100/80 px-4 py-1.5 text-sm font-semibold text-slate-600 ring-1 ring-black/5 dark:bg-white/10 dark:text-slate-300 dark:ring-white/10">
                                <span className="text-blue-500 dark:text-blue-400">L:{t(tempMin)}</span>
                                <span className="text-slate-300 dark:text-slate-600">|</span>
                                <span className="text-red-500 dark:text-red-400">H:{t(tempMax)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alt Kısım: İstatistikler */}
                <div className="mt-8 grid grid-cols-3 gap-4">
                    <Stat label="Hissedilen" value={t(feelsLike)} delay="0ms" />
                    <Stat label="Nem" value={`%${Math.round(humidity)}`} delay="100ms" />
                    <Stat label="Rüzgar" value={`${windSpeed.toFixed(1)} m/s`} delay="200ms" />
                </div>
            </div>
        </section>
    );
}