import "server-only";

export async function geocodeOnServer(q: string): Promise<{ lat: number; lon: number; name: string } | null> {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) throw new Error("Missing env: OPENWEATHER_API_KEY");

    const url =
        `https://api.openweathermap.org/geo/1.0/direct` +
        `?q=${encodeURIComponent(q)}` +
        `&limit=1` +
        `&appid=${encodeURIComponent(apiKey)}`;

    try {
        const res = await fetch(url, {
            next: { revalidate: 86400 },
        });

        if (!res.ok) return null;

        const data = (await res.json()) as Array<{ lat: number; lon: number; name: string }>;
        if (!Array.isArray(data) || data.length === 0) return null;

        return { lat: data[0].lat, lon: data[0].lon, name: data[0].name };
    } catch (error) {
        console.error("Geocoding hatası:", error);
        return null;
    }
}