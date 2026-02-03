import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function requireEnv(name: string) {
    const v = process.env[name];
    if (!v) throw new Error(`Missing env: ${name}`);
    return v;
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") ?? "").trim();

    if (q.length < 2) {
        return NextResponse.json({ ok: false, error: "Şehir adı çok kısa." }, { status: 400 });
    }

    const apiKey = requireEnv("OPENWEATHER_API_KEY");

    const url =
        `https://api.openweathermap.org/geo/1.0/direct` +
        `?q=${encodeURIComponent(q)}` +
        `&limit=5` +
        `&appid=${encodeURIComponent(apiKey)}`;

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
        return NextResponse.json({ ok: false, error: "Geocode başarısız." }, { status: 500 });
    }

    const data = (await res.json()) as Array<{
        name: string;
        lat: number;
        lon: number;
        country: string;
        state?: string;
    }>;

    if (!data.length) {
        return NextResponse.json({ ok: false, error: "Şehir bulunamadı." }, { status: 404 });
    }

    const best = data[0];

    return NextResponse.json({
        ok: true,
        place: {
            name: best.name,
            country: best.country,
            state: best.state ?? null,
            lat: best.lat,
            lon: best.lon,
        },
    });
}
