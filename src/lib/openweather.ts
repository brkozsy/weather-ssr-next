type OpenWeatherSuccess = {
    name: string;
    weather: { description: string; icon: string }[];
    main: { temp: number; feels_like: number; humidity: number };
    wind: { speed: number };
};

export type WeatherDTO = {
    city: string;
    temp: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    description: string;
    icon: string;
    fetchedAt: string;
};

function mustEnv(name: string): string {
    const v = process.env[name];
    if (!v) throw new Error(`Missing env var: ${name}`);
    return v;
}

export async function getCurrentWeather(lat: number, lon: number): Promise<WeatherDTO> {
    const apiKey = mustEnv("OPENWEATHER_API_KEY");

    const url =
        `https://api.openweathermap.org/data/2.5/weather` +
        `?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=tr`;

    const res = await fetch(url, {
        next: { revalidate: 2700 }, // 45 dakika
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`OpenWeather error (${res.status}): ${text || res.statusText}`);
    }

    const data = (await res.json()) as OpenWeatherSuccess;
    const first = data.weather?.[0];

    return {
        city: data.name,
        temp: data.main.temp,
        feelsLike: data.main.feels_like,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        description: first?.description ?? "—",
        icon: first?.icon ?? "01d",
        fetchedAt: new Date().toISOString(),
    };
}
