import { cookies } from "next/headers";
import ThemeToggle from "@/components/ThemeToggle";
import WeatherCard from "@/components/WeatherCard";
import GpsClient from "@/components/GpsClient";
import { getLocation } from "@/lib/location";
import { getCurrentWeather } from "@/lib/openweather";

export default async function HomePage() {
  const loc = await getLocation();

  const c = await cookies();
  const initialTheme = c.get("theme")?.value === "dark" ? "dark" : "light";

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl space-y-6">

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-zinc-900/80 dark:text-zinc-100/80">
              HAVA DURUMU
            </h2>

          </div>

          <ThemeToggle initialTheme={initialTheme} />
        </div>

        {!loc ? (
          <>
            <GpsClient />
            <div className="rounded-3xl border border-black/10 bg-white/70 p-6 text-sm text-zinc-700 backdrop-blur-2xl dark:border-white/10 dark:bg-white/5 dark:text-zinc-200">
              Konum alınıyor… Lütfen tarayıcıdan konum izni ver.

            </div>
          </>
        ) : (
          <WeatherSection lat={loc.lat} lon={loc.lon} />
        )}

        <footer className="pt-2 text-center text-xs text-zinc-500 dark:text-zinc-400">
          Built with Next.js SSR • Tailwind • OpenWeather
        </footer>
      </div>
    </main>
  );
}

async function WeatherSection({ lat, lon }: { lat: number; lon: number }) {
  const w = await getCurrentWeather(lat, lon);

  return (
    <WeatherCard
      city={w.city}
      description={w.description}
      temp={w.temp}
      feelsLike={w.feelsLike}
      humidity={w.humidity}
      windSpeed={w.windSpeed}
      fetchedAt={w.fetchedAt}
    />
  );
}
