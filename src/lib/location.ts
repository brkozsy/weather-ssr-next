import { cookies } from "next/headers";

export type LocationDTO = {
    lat: number;
    lon: number;
    source: "gps";
};

export async function getLocation(): Promise<LocationDTO | null> {
    const c = await cookies();

    const lat = c.get("gps-lat")?.value;
    const lon = c.get("gps-lon")?.value;

    if (!lat || !lon) return null;

    const latN = Number(lat);
    const lonN = Number(lon);

    if (!Number.isFinite(latN) || !Number.isFinite(lonN)) return null;

    return { lat: latN, lon: lonN, source: "gps" };
}
