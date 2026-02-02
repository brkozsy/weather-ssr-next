import { NextResponse } from "next/server";
import { getLocation } from "@/lib/location";

export async function GET() {
    const loc = await getLocation();
    return NextResponse.json(loc);
}
