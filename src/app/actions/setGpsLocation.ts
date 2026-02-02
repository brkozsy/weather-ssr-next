"use server";

import { cookies } from "next/headers";

export async function setGpsLocation(lat: number, lon: number) {
    const c = await cookies(); // ✅ await şart

    c.set("gps-lat", String(lat), { path: "/" });
    c.set("gps-lon", String(lon), { path: "/" });
}
