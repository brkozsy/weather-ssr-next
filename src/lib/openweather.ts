export type WeatherDTO = {
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

export async function getCurrentWeather(lat: number, lon: number): Promise<WeatherDTO> {

    const key = process.env.OPENWEATHER_API_KEY;
    if (!key) throw new Error("OPENWEATHER_API_KEY eksik (.env.local)");

    const url =
        `https://api.openweathermap.org/data/2.5/weather` +
        `?lat=${encodeURIComponent(lat)}` +
        `&lon=${encodeURIComponent(lon)}` +
        `&appid=${encodeURIComponent(key)}` +
        `&units=metric` +
        `&lang=tr`;

    const res = await fetch(url, { next: { revalidate: 60 * 45 } });
    if (!res.ok) throw new Error(`OpenWeather error: ${res.status}`);

    const data = await res.json();

    return {
        city: String(data?.name ?? "Unknown"),
        description: String(data?.weather?.[0]?.description ?? "-"),
        main: String(data?.weather?.[0]?.main ?? "Clear"),
        icon: String(data?.weather?.[0]?.icon ?? "01d"),

        temp: Number(data?.main?.temp ?? 0),
        feelsLike: Number(data?.main?.feels_like ?? 0),
        tempMin: Number(data?.main?.temp_min ?? 0),
        tempMax: Number(data?.main?.temp_max ?? 0),

        humidity: Number(data?.main?.humidity ?? 0),
        windSpeed: Number(data?.wind?.speed ?? 0),

        fetchedAt: new Date().toLocaleTimeString("tr-TR"),
    };
}

// src/lib/openweather.ts

export type ForecastDayDTO = {
    dateISO: string;     // "2026-02-03"
    label: string;       // "Sal", "Çar"...
    min: number;
    max: number;
    icon: string;        // "04d"
    main: string;        // "Clouds"
    description: string; // "broken clouds"
    pop: number;         // 0..1 (yağış ihtimali)
};

type OWMForecastResponse = {
    list: Array<{
        dt: number;
        main: { temp_min: number; temp_max: number };
        weather: Array<{ icon: string; main: string; description: string }>;
        pop?: number;
    }>;
};

function requireEnv(name: string) {
    const v = process.env[name];
    if (!v) throw new Error(`Missing env: ${name}`);
    return v;
}

function dayKeyFromUnix(dtSec: number) {
    const d = new Date(dtSec * 1000);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

function pickMidday(items: Array<{ dt: number; icon: string; main: string; description: string; pop: number }>) {
    // 12:00'a en yakın olanı seç (ikon + description için)
    let best = items[0];
    let bestScore = Infinity;

    for (const it of items) {
        const h = new Date(it.dt * 1000).getHours();
        const score = Math.abs(h - 12);
        if (score < bestScore) {
            best = it;
            bestScore = score;
        }
    }
    return best;
}

export async function getFiveDayForecast(lat: number, lon: number): Promise<ForecastDayDTO[]> {
    const apiKey = requireEnv("OPENWEATHER_API_KEY");

    const url =
        `https://api.openweathermap.org/data/2.5/forecast` +
        `?lat=${encodeURIComponent(lat)}` +
        `&lon=${encodeURIComponent(lon)}` +
        `&appid=${encodeURIComponent(apiKey)}` +
        `&units=metric` +
        `&lang=tr`;

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load forecast");

    const data = (await res.json()) as OWMForecastResponse;

    const map = new Map<
        string,
        {
            mins: number[];
            maxs: number[];
            items: Array<{ dt: number; icon: string; main: string; description: string; pop: number }>;
        }
    >();

    for (const it of data.list) {
        const key = dayKeyFromUnix(it.dt);
        const w = it.weather?.[0];
        if (!w) continue;

        const cur = map.get(key) ?? { mins: [], maxs: [], items: [] };
        cur.mins.push(it.main.temp_min);
        cur.maxs.push(it.main.temp_max);
        cur.items.push({
            dt: it.dt,
            icon: w.icon,
            main: w.main,
            description: w.description,
            pop: it.pop ?? 0,
        });
        map.set(key, cur);
    }

    const keys = Array.from(map.keys()).sort().slice(0, 5);

    return keys.map((k) => {
        const v = map.get(k)!;

        const min = Math.min(...v.mins);
        const max = Math.max(...v.maxs);
        const mid = pickMidday(v.items);

        const d = new Date(k + "T12:00:00");
        const label = d.toLocaleDateString("tr-TR", { weekday: "short" });

        return {
            dateISO: k,
            label,
            min,
            max,
            icon: mid.icon,
            main: mid.main,
            description: mid.description,
            pop: mid.pop,
        };
    });
}

