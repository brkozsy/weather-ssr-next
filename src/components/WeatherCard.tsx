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
        bg-white/55 ring-black/10 text-zinc-900
        dark:bg-white/10 dark:ring-white/15 dark:text-white
      "
        >
            <p className="text-xs opacity-70">{label}</p>
            <p className="mt-1 text-sm font-semibold">{value}</p>
        </div>
    );
}

function bgByMain(main: string) {
    switch (main) {
        case "Clear":
            return "from-amber-400/60 via-pink-400/40 to-indigo-500/50";
        case "Clouds":
            return "from-sky-500/40 via-indigo-500/35 to-fuchsia-500/35";
        case "Rain":
        case "Drizzle":
            return "from-slate-600/50 via-sky-700/35 to-indigo-700/40";
        case "Snow":
            return "from-slate-200/60 via-sky-200/45 to-indigo-200/45";
        case "Thunderstorm":
            return "from-zinc-900/70 via-indigo-900/50 to-purple-900/50";
        default:
            return "from-indigo-500/45 via-purple-500/35 to-pink-500/35";
    }
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
    main,
    fetchedAt,
}: Props) {
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    return (
        <section className="relative overflow-hidden rounded-[28px] p-[1px] shadow-2xl">
            <div className={`absolute inset-0 bg-gradient-to-br ${bgByMain(main)}`} />
            <div className="absolute inset-0 bg-black/10 dark:bg-black/25" />


            <div
                className="
          relative rounded-[27px] p-6 backdrop-blur-2xl ring-1
          bg-white/35 text-zinc-900 ring-black/10
          dark:bg-black/30 dark:text-white dark:ring-white/20
        "
            >
                <div className="flex items-start justify-between gap-6">
                    <div>
                        <p className="text-xs font-semibold tracking-wide opacity-70">

                        </p>

                        <h1 className="mt-2 text-3xl font-semibold">{city}</h1>

                        <p className="mt-1 text-sm capitalize opacity-80">{description}</p>

                        <p className="mt-3 text-xs opacity-65">
                            Güncellendi: <span className="font-medium">{fetchedAt}</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <img src={iconUrl} alt={main} className="h-14 w-14" />
                        <div className="text-right">
                            <div className="text-6xl font-light leading-none">{t(temp)}</div>
                            <div className="mt-1 text-xs opacity-70">
                                Min {t(tempMin)} • Max {t(tempMax)}
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
