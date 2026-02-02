export type WeatherDTO = {
    city: string;
    description: string;
    temp: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    fetchedAt: string;
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

    const res = await fetch(url, {
        next: { revalidate: 60 * 45 },
    });

    if (!res.ok) {
        throw new Error(`OpenWeather error: ${res.status}`);
    }

    const data = await res.json();

    return {
        city: String(data?.name ?? "Unknown"),
        description: String(data?.weather?.[0]?.description ?? "-"),
        temp: Number(data?.main?.temp ?? 0),
        feelsLike: Number(data?.main?.feels_like ?? 0),
        humidity: Number(data?.main?.humidity ?? 0),
        windSpeed: Number(data?.wind?.speed ?? 0),
        fetchedAt: new Date().toLocaleTimeString("tr-TR"),
    };
}
