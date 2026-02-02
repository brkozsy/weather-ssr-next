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

export async function getCurrentWeather(lat: number, lon: number) {
    const key = process.env.OPENWEATHER_API_KEY;
    if (!key) throw new Error("OPENWEATHER_API_KEY missing");

    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=tr&appid=${key}`,
        {
            next: { revalidate: 60 * 45 }
        }
    );

    if (!res.ok) throw new Error("Weather fetch failed");

    const d = await res.json();

    return {
        city: d.name,
        temp: d.main.temp,
        feelsLike: d.main.feels_like,
        humidity: d.main.humidity,
        windSpeed: d.wind.speed,
        description: d.weather[0].description,
        fetchedAt: Date.now(),
    };
}
