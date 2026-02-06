import { cookies } from "next/headers";
import ThemeToggle from "@/components/ThemeToggle";
import WeatherCard from "@/components/WeatherCard";
import GpsClient from "@/components/GpsClient";
import CitySearch from "@/components/CitySearch";
import Forecast5Day from "@/components/ForeCast5Day";
import { getLocation } from "@/lib/location";
import { getCurrentWeather, getFiveDayForecast } from "@/lib/openweather";

function parseNum(v: unknown) {
  if (typeof v !== "string") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

type SP = { lat?: string; lon?: string; q?: string };

async function geocodeOnServer(q: string): Promise<{ lat: number; lon: number; name: string } | null> {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) throw new Error("Missing env: OPENWEATHER_API_KEY");

  const url =
    `https://api.openweathermap.org/geo/1.0/direct` +
    `?q=${encodeURIComponent(q)}` +
    `&limit=1` +
    `&appid=${encodeURIComponent(apiKey)}`;

  const res = await fetch(url, {
    next: { revalidate: 60 * 60 * 24 },
  });

  if (!res.ok) return null;

  const data = (await res.json()) as Array<{ lat: number; lon: number; name: string }>;
  if (!Array.isArray(data) || data.length === 0) return null;

  return { lat: data[0].lat, lon: data[0].lon, name: data[0].name };
}

export default async function HomePage(props: { searchParams?: Promise<SP> | SP }) {
  const sp = props.searchParams ? await Promise.resolve(props.searchParams) : undefined;

  const lat = parseNum(sp?.lat);
  const lon = parseNum(sp?.lon);
  const q = typeof sp?.q === "string" ? sp.q.trim() : "";

  let loc: { lat: number; lon: number } | null = null;

  let qNotFound = false;

  if (lat != null && lon != null) {
    loc = { lat, lon };
  } else if (q) {
    const g = await geocodeOnServer(q);
    if (g) loc = { lat: g.lat, lon: g.lon };
    else qNotFound = true;
  } else {
    loc = await getLocation();
  }

  const c = await cookies();
  const initialTheme = c.get("theme")?.value === "dark" ? "dark" : "light";

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-sm font-semibold tracking-[0.22em] opacity-80">HAVA DURUMU</h1>
          </div>
          <ThemeToggle initialTheme={initialTheme} />
        </header>

        <CitySearch />

        <div className="mt-2">
          {qNotFound ? (
            <div className="rounded-3xl bg-white/20 p-6 text-sm text-zinc-800 backdrop-blur-2xl ring-1 ring-black/5 dark:bg-white/5 dark:text-zinc-100 dark:ring-white/10">
              “{q}” için sonuç bulunamadı.
            </div>
          ) : !loc ? (
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
  const [w, days] = await Promise.all([getCurrentWeather(lat, lon), getFiveDayForecast(lat, lon)]);

  return (
    <div className="space-y-6">
      <WeatherCard
        city={w.city}
        description={w.description}
        temp={w.temp}
        feelsLike={w.feelsLike}
        humidity={w.humidity}
        windSpeed={w.windSpeed}
        fetchedAt={w.fetchedAt}
        icon={w.icon}

        tempMin={w.tempMin}
        tempMax={w.tempMax}
      />
      <Forecast5Day days={days} />
    </div>
  );
}
