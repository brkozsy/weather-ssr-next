import { Suspense } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import CitySearch from "@/components/CitySearch";
import GpsClient from "@/components/GpsClient";
import { getLocation } from "@/lib/location";
import WeatherSection from "@/components/WeatherSection";
import { geocodeOnServer } from "@/server/geocode";

type SP = { lat?: string; lon?: string; q?: string };

export default async function HomePage(props: { searchParams?: Promise<SP> | SP }) {
  const sp = props.searchParams ? await Promise.resolve(props.searchParams) : undefined;

  const q = typeof sp?.q === "string" ? sp.q.trim() : "";
  const latNum = sp?.lat ? parseFloat(sp.lat) : null;
  const lonNum = sp?.lon ? parseFloat(sp.lon) : null;

  let loc: { lat: number; lon: number } | null = null;
  let qNotFound = false;

  if (latNum !== null && lonNum !== null) {
    loc = { lat: latNum, lon: lonNum };
  } else if (q) {
    const g = await geocodeOnServer(q);
    if (g) loc = { lat: g.lat, lon: g.lon };
    else qNotFound = true;
  } else {
    loc = await getLocation();
  }

  const today = new Date().toLocaleDateString("tr-TR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <main className="min-h-screen w-full px-4 py-8 sm:px-6 sm:py-12 flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-8">

        <header className="flex items-end justify-between px-2">
          <div className="space-y-1">
            <p className="text-xs font-bold tracking-widest text-blue-500 dark:text-blue-400 uppercase">
              {today}
            </p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-400">
              Hava Durumu
            </h1>
          </div>
          <ThemeToggle />
        </header>

        <div className="relative z-20">
          <CitySearch />
        </div>


        <div className="mt-6 min-h-[400px]">
          {qNotFound ? (
            <div className="flex flex-col items-center justify-center rounded-[30px] border border-red-100 bg-red-50/50 p-10 text-center backdrop-blur-xl dark:border-red-900/30 dark:bg-red-900/10">
              <div className="mb-4 rounded-full bg-red-100 p-3 text-red-500 dark:bg-red-900/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
              </div>
              <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">Sonuç Bulunamadı</h3>
              <p className="mt-1 text-sm text-red-600/80 dark:text-red-300/70">
                “{q}” için herhangi bir konum eşleşmedi. Lütfen şehir adını kontrol et.
              </p>
            </div>
          ) : !loc ? (
            <div className="flex flex-col items-center justify-center space-y-6 py-20">
              <GpsClient />
              <div className="flex items-center gap-3 rounded-full bg-white/50 px-5 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur-md dark:bg-slate-800/50 dark:text-slate-300">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                </span>
                Konum alınıyor...
              </div>
            </div>
          ) : (
            <Suspense fallback={<WeatherSkeleton />}>
              <WeatherSection lat={loc.lat} lon={loc.lon} />
            </Suspense>
          )}
        </div>
      </div>
    </main>
  );
}


function WeatherSkeleton() {
  return (
    <div className="animate-pulse space-y-6">

      <div className="relative h-[400px] w-full rounded-[30px] bg-white/40 p-8 shadow-lg ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/5">
        <div className="flex justify-between">
          <div className="space-y-4">
            <div className="h-10 w-48 rounded-xl bg-slate-200 dark:bg-white/10" />
            <div className="h-6 w-32 rounded-lg bg-slate-200 dark:bg-white/10" />
          </div>
          <div className="h-24 w-24 rounded-full bg-slate-200 dark:bg-white/10" />
        </div>
        <div className="mt-12 flex justify-end">
          <div className="h-24 w-40 rounded-2xl bg-slate-200 dark:bg-white/10" />
        </div>
        <div className="mt-12 grid grid-cols-3 gap-4">
          <div className="h-20 rounded-2xl bg-slate-200 dark:bg-white/10" />
          <div className="h-20 rounded-2xl bg-slate-200 dark:bg-white/10" />
          <div className="h-20 rounded-2xl bg-slate-200 dark:bg-white/10" />
        </div>
      </div>


      <div className="h-80 w-full rounded-[30px] bg-white/40 p-6 shadow-lg ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/5">
        <div className="mb-6 h-6 w-32 rounded-lg bg-slate-200 dark:bg-white/10" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 w-full rounded-xl bg-slate-200/50 dark:bg-white/5" />
          ))}
        </div>
      </div>
    </div>
  );
}