import ThemeToggle from "@/components/ThemeToggle";
import GpsClient from "@/components/GpsClient";
import { getLocation } from "@/lib/location";
import { getCurrentWeather } from "@/lib/openweather";

export default async function HomePage() {
  const loc = await getLocation();

  return (
    <main className="space-y-4 p-6">
      <div className="flex items-center justify-end">
        <ThemeToggle />
      </div>

      {/* GPS cookie yazdıran minimal client */}
      <GpsClient />

      {!loc ? (
        <div className="rounded-2xl border border-black/10 p-5 dark:border-white/10">
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            Konum alınıyor… Lütfen tarayıcıdan konum izni ver.
          </p>
        </div>
      ) : (
        <WeatherPanel lat={loc.lat} lon={loc.lon} />
      )}
    </main>
  );
}

async function WeatherPanel({ lat, lon }: { lat: number; lon: number }) {
  const w = await getCurrentWeather(lat, lon);

  return (
    <div className="rounded-2xl border border-black/10 p-5 dark:border-white/10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">{w.city}</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            {w.description}
          </p>
        </div>

        <div className="text-right">
          <div className="text-4xl font-semibold">{Math.round(w.temp)}°C</div>
          <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            Hissedilen: {Math.round(w.feelsLike)}°C
          </div>
        </div>
      </div>
    </div>
  );
}
