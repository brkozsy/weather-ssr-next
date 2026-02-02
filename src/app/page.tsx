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



      <div className="mx-auto w-full max-w-3xl space-y-6">

        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              HAVA DURUMU
            </h1>

          </div>

          <ThemeToggle initialTheme={initialTheme} />
        </header>

        <div className="mt-6">
          {!loc ? (
            <div className="space-y-4">
              <GpsClient />
              <div className="rounded-3xl bg-white/20 p-6 text-sm text-zinc-800 backdrop-blur-2xl ring-1 ring-black/5 dark:bg-white/5 dark:text-zinc-100 dark:ring-white/10">
                Konum alınıyor… Lütfen tarayıcıdan konum izni ver.
              </div>
            </div>
          ) : (
            <WeatherSection lat={loc.lat} lon={loc.lon} />
          )}
        </div>



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
      icon={w.icon}
      main={w.main}
      tempMin={w.tempMin}
      tempMax={w.tempMax}
    />
  );
}
