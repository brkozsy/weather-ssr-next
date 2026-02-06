import { Suspense } from "react";
import { cookies } from "next/headers";
import ThemeToggle from "@/components/ThemeToggle";
import CitySearch from "@/components/CitySearch";
import GpsClient from "@/components/GpsClient";
import { getLocation } from "@/lib/location";
import WeatherSection from "@/components/WeatherSection";
import { geocodeOnServer } from "@/lib/geocode";

type SP = { lat?: string; lon?: string; q?: string };

export default async function HomePage(props: { searchParams?: Promise<SP> | SP }) {
  const sp = props.searchParams ? await Promise.resolve(props.searchParams) : undefined;

  const q = typeof sp?.q === "string" ? sp.q.trim() : "";
  const latNum = sp?.lat ? parseFloat(sp.lat) : null;
  const lonNum = sp?.lon ? parseFloat(sp.lon) : null;

  let loc: { lat: number; lon: number } | null = null;
  let qNotFound = false;

  // Koordinat belirleme mantığı
  if (latNum !== null && lonNum !== null) {
    loc = { lat: latNum, lon: lonNum };
  } else if (q) {
    const g = await geocodeOnServer(q);
    if (g) loc = { lat: g.lat, lon: g.lon };
    else qNotFound = true;
  } else {
    // Varsayılan konum (Bu işlem yavaşsa Suspense dışında kalması tüm sayfayı bekletir)
    loc = await getLocation();
  }

  const c = await cookies();
  const initialTheme = c.get("theme")?.value === "dark" ? "dark" : "light";

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-sm font-semibold tracking-[0.22em] opacity-80">HAVA DURUMU</h1>
          <ThemeToggle />
        </header>

        <CitySearch />

        <div className="mt-2">
          {qNotFound ? (
            <div className="rounded-3xl bg-white/20 p-6 backdrop-blur-2xl dark:bg-white/5">
              “{q}” için sonuç bulunamadı.
            </div>
          ) : !loc ? (
            <div className="space-y-4">
              <GpsClient />
              <p>Konum alınıyor...</p>
            </div>
          ) : (
            /* STRATEJİK HAMLE: Veri çekme işlemini Suspense içine alıyoruz */
            <Suspense fallback={<WeatherSkeleton />}>
              <WeatherSection lat={loc.lat} lon={loc.lon} />
            </Suspense>
          )}
        </div>
      </div>
    </main>
  );
}

// Basit bir yükleniyor görünümü (O 8 saniyelik boşlukta bu görünür)
function WeatherSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-64 rounded-3xl bg-white/10" />
      <div className="h-40 rounded-3xl bg-white/10" />
    </div>
  );
}