import type { WeatherDTO } from "@/lib/openweather";

type LocationDTO = {
  lat: number;
  lon: number;
  city?: string;
  country?: string;
  source: "header" | "ip" | "fallback";
};

async function getLocation(): Promise<LocationDTO> {
  const res = await fetch("http://localhost:3000/api/location", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load location");
  return res.json();
}

async function getWeather(lat: number, lon: number): Promise<WeatherDTO> {
  const res = await fetch(`http://localhost:3000/api/weather?lat=${lat}&lon=${lon}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load weather");
  return res.json();
}

export default async function HomePage() {
  const loc = await getLocation();
  const w = await getWeather(loc.lat, loc.lon);

  return (
    <main className="space-y-4 p-6">
      <div className="rounded-2xl border border-black/10 p-5 dark:border-white/10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold">{w.city}</h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{w.description}</p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Location source: <b>{loc.source}</b>
              {loc.city ? ` • ${loc.city}` : ""}
              {loc.country ? ` • ${loc.country}` : ""}
            </p>
          </div>

          <div className="text-right">
            <div className="text-4xl font-semibold">{Math.round(w.temp)}°C</div>
            <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
              Hissedilen: {Math.round(w.feelsLike)}°C
            </div>
          </div>
        </div>

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
