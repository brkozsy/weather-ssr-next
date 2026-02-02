type Props = {
    city: string;
    description: string;
    temp: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    fetchedAt: string;
};

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-black/10 bg-white/60 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            <p className="text-xs font-medium text-zinc-600 dark:text-zinc-300">{label}</p>
            <p className="mt-1 text-base font-semibold text-zinc-900 dark:text-zinc-50">{value}</p>
        </div>
    );
}

export default function WeatherCard({
    city,
    description,
    temp,
    feelsLike,
    humidity,
    windSpeed,
    fetchedAt,
}: Props) {
    return (
        <section className="relative overflow-hidden rounded-3xl border border-black/10 bg-white/70 p-6 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
            {/* glow */}
            <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-sky-300/30 blur-3xl dark:bg-sky-500/15" />
            <div className="pointer-events-none absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-fuchsia-300/25 blur-3xl dark:bg-fuchsia-500/10" />

            <div className="relative">
                {/* header */}
                <div className="flex items-start justify-between gap-6">
                    <div className="min-w-0">
                        <p className="text-xs font-semibold tracking-wide text-zinc-500 dark:text-zinc-400">
                            Current Weather
                        </p>

                        <h1 className="mt-2 truncate text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                            {city}
                        </h1>

                        <p className="mt-2 text-sm capitalize text-zinc-600 dark:text-zinc-300">
                            {description}
                        </p>

                        <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
                            fetchedAt: <span className="font-medium">{fetchedAt}</span>
                        </p>
                    </div>

                    <div className="text-right">
                        <div className="text-5xl font-semibold leading-none tracking-tight text-zinc-900 dark:text-zinc-50">
                            {Math.round(temp)}°
                            <span className="align-top text-2xl text-zinc-500 dark:text-zinc-400">C</span>
                        </div>

                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                            Hissedilen: <span className="font-semibold">{Math.round(feelsLike)}°</span>
                        </p>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <Stat label="Nem" value={`${Math.round(humidity)}%`} />
                    <Stat label="Rüzgar" value={`${windSpeed.toFixed(1)} m/s`} />
                    <Stat label="Hissedilen" value={`${Math.round(feelsLike)}°C`} />
                </div>
            </div>
        </section>
    );
}
