import type { WeatherDTO } from "@/lib/openweather";

async function getWeather(): Promise<WeatherDTO> {
  const lat = 41.0082;
  const lon = 28.9784;

  const res = await fetch(`http://localhost:3000/api/weather?lat=${lat}&lon=${lon}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to load weather");
  return res.json();
}

export default async function HomePage() {
  const w = await getWeather();

  return (
    <main className="p-6">
      <div className="rounded-2xl border border-black/10 p-5 dark:border-white/10">
        <h1 className="text-xl font-semibold">{w.city}</h1>
        <p className="text-zinc-600 dark:text-zinc-300">{w.description}</p>

        <div className="mt-4 text-4xl font-semibold">{Math.round(w.temp)}°C</div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-black/5 p-3 dark:bg-white/10">
            Nem: <b>{w.humidity}%</b>
          </div>
          <div className="rounded-xl bg-black/5 p-3 dark:bg-white/10">
            Rüzgar: <b>{w.windSpeed} m/s</b>
          </div>
        </div>

        <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
          fetchedAt: {new Date(w.fetchedAt).toLocaleTimeString()}
        </p>
      </div>
    </main>
  );
}
