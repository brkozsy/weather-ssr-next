"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setGpsLocation } from "../app/actions/setGpsLocation";

export default function GpsClient() {
    const router = useRouter();

    useEffect(() => {
        if (!("geolocation" in navigator)) return;

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                await setGpsLocation(pos.coords.latitude, pos.coords.longitude);
                router.refresh();
            },
            (err) => {
                console.error("Geolocation error:", err);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }, [router]);

    return null;
}
