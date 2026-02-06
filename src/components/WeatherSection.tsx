import { getCurrentWeather, getFiveDayForecast } from "@/lib/openweather";
import WeatherCard from "@/components/WeatherCard";
import Forecast5Day from "@/components/ForeCast5Day";

interface WeatherSectionProps {
    lat: number;
    lon: number;
}

export default async function WeatherSection({ lat, lon }: { lat: number; lon: number }) {
    // Promise.all kullanarak iki API isteğini aynı anda başlatıyoruz (Paralel Fetching)
    // Bu sayede bekleme süresi yarı yarıya düşer.
    const [w, days] = await Promise.all([
        getCurrentWeather(lat, lon),
        getFiveDayForecast(lat, lon)
    ]);

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
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