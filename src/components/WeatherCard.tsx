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
    main: string;
};

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div
            className="
        rounded-2xl px-4 py-3 ring-1 backdrop-blur-xl
        bg-white/45 ring-black/10
        dark:bg-zinc-800/60 dark:ring-white/10 dark:text-zinc-50
      "
        >
            <p className="text-xs font-medium opacity-70">{label}</p>
            <p className="mt-1 text-base font-semibold">{value}</p>
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
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    return (
        <section className="relative overflow-hidden rounded-[28px] p-[1px] shadow-2xl">
            {/* Neutral grey glow */}
            <div
                className="
          absolute inset-0 bg-gradient-to-br
          from-zinc-300/60 via-zinc-200/40 to-zinc-300/60
          dark:from-zinc-800/80 dark:via-zinc-900/70 dark:to-zinc-800/80
        "
            />

            <div
                className="
          relative rounded-[27px] p-7 backdrop-blur-2xl ring-1
          bg-white/40 text-zinc-900 ring-black/10
          dark:bg-zinc-900/60 dark:text-zinc-50 dark:ring-white/10
        "
            >
                <div className="flex items-start justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-semibold">{city}</h1>
                        <p className="mt-1 text-sm capitalize opacity-80">
                            {description}
                        </p>
                        <p className="mt-3 text-xs opacity-65">
                            Güncellendi: <span className="font-medium">{fetchedAt}</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <img src={iconUrl} alt="" className="h-14 w-14 drop-shadow-sm" />
                        <div className="text-right">
                            <div className="text-6xl font-light leading-none">{t(temp)}</div>
                            <div
                                className="
                  mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs ring-1
                  bg-white/45 ring-black/10
                  dark:bg-zinc-800/60 dark:ring-white/10
                "
                            >
                                <span>Min {t(tempMin)}</span>
                                <span className="opacity-50">•</span>
                                <span>Max {t(tempMax)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <Stat label="Hissedilen" value={t(feelsLike)} />
                    <Stat label="Nem" value={`${Math.round(humidity)}%`} />
                    <Stat label="Rüzgar" value={`${windSpeed.toFixed(1)} m/s`} />
                </div>
            </div>
        </section>
    );
}
