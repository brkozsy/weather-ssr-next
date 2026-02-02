import { NextResponse } from "next/server";
import { headers } from "next/headers";

type LocationDTO = {
    lat: number;
    lon: number;
    city?: string;
    country?: string;
    source: "header" | "ip" | "fallback";
};

const ISTANBUL_FALLBACK: LocationDTO = {
    lat: 41.0082,
    lon: 28.9784,
    city: "İstanbul",
    country: "Türkiye",
    source: "fallback",
};

function toNumber(v: string | null): number | null {
    if (!v) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
}

function isLocalIp(ip: string) {
    return (
        ip === "::1" ||
        ip === "127.0.0.1" ||
        ip === "localhost" ||
        ip.startsWith("10.") ||
        ip.startsWith("192.168.") ||
        ip.startsWith("172.16.") ||
        ip.startsWith("172.17.") ||
        ip.startsWith("172.18.") ||
        ip.startsWith("172.19.") ||
        ip.startsWith("172.2") ||
        ip.startsWith("172.30.") ||
        ip.startsWith("172.31.")
    );
}

function getIpFromHeaders(h: Headers): string | null {
    const xff = h.get("x-forwarded-for");
    if (xff) {
        const ip = xff.split(",")[0].trim();
        return isLocalIp(ip) ? null : ip;
    }

    const xrip = h.get("x-real-ip");
    if (xrip) {
        const ip = xrip.trim();
        return isLocalIp(ip) ? null : ip;
    }

    return null;
}


async function getPublicIp(): Promise<string | null> {

    try {
        const r = await fetch("https://api64.ipify.org?format=json", { cache: "no-store" });
        if (r.ok) {
            const d = await r.json().catch(() => null);
            const ip = d?.ip;
            if (typeof ip === "string" && ip.length > 3) return ip;
        }
    } catch { }

    return null;
}


async function geoFromIp(ip: string): Promise<Omit<LocationDTO, "source"> | null> {

    try {
        const r = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`, { cache: "no-store" });
        if (r.ok) {
            const d = await r.json().catch(() => null);
            const lat = Number(d?.latitude);
            const lon = Number(d?.longitude);

            if (Number.isFinite(lat) && Number.isFinite(lon)) {
                return {
                    lat,
                    lon,
                    city: typeof d?.city === "string" ? d.city : undefined,
                    country: typeof d?.country_name === "string" ? d.country_name : undefined,
                };
            }
        }
    } catch { }


    try {
        const r = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, { cache: "no-store" });
        if (r.ok) {
            const d = await r.json().catch(() => null);
            const lat = Number(d?.latitude);
            const lon = Number(d?.longitude);

            if (d?.success !== false && Number.isFinite(lat) && Number.isFinite(lon)) {
                return {
                    lat,
                    lon,
                    city: typeof d?.city === "string" ? d.city : undefined,
                    country: typeof d?.country === "string" ? d.country : undefined,
                };
            }
        }
    } catch { }

    return null;
}

function locationFromGeoHeaders(h: Headers): Omit<LocationDTO, "source"> | null {
    const lat = toNumber(h.get("x-geo-lat") ?? h.get("x-vercel-ip-latitude"));
    const lon = toNumber(h.get("x-geo-lon") ?? h.get("x-vercel-ip-longitude"));

    if (lat === null || lon === null) return null;

    return {
        lat,
        lon,
        city: h.get("x-geo-city") ?? h.get("x-vercel-ip-city") ?? undefined,
        country: h.get("x-geo-country") ?? h.get("x-vercel-ip-country") ?? undefined,
    };
}

export async function GET() {
    const h = await headers();


    const byHeader = locationFromGeoHeaders(h);
    if (byHeader) {
        return NextResponse.json({ ...byHeader, source: "header" satisfies LocationDTO["source"] });
    }


    const ip = getIpFromHeaders(h) ?? (await getPublicIp());
    if (ip) {
        const byIp = await geoFromIp(ip);
        if (byIp) {
            return NextResponse.json({ ...byIp, source: "ip" satisfies LocationDTO["source"] });
        }
    }


    return NextResponse.json(ISTANBUL_FALLBACK);
}
