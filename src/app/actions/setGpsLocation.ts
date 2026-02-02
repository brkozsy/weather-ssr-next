"use server";

import { cookies } from "next/headers";

export async function setGpsLocation(lat: number, lon: number) {
    const c = await cookies();

    c.set("gps-lat", String(lat), {
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    });

    c.set("gps-lon", String(lon), {
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    });
}
