import { NextResponse } from "next/server";
import { getCurrentWeather } from "@/lib/openweather";
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const lat = Number(searchParams.get("lat"));
    const lon = Number(searchParams.get("lon"));

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
        return NextResponse.json(
            { error: "Invalid lat/lon. Example: /api/weather?lat=41.0082&lon=28.9784" },
            { status: 400 }
        );
    }

    try {
        const weather = await getCurrentWeather(lat, lon);
        return NextResponse.json(weather);
    } catch (e) {
        const message = e instanceof Error ? e.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}