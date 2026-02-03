import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    const body = await req.json().catch(() => ({}));
    const theme = body?.theme === "dark" ? "dark" : "light";

    const res = NextResponse.json({ ok: true, theme });

    res.cookies.set("theme", theme, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    });

    return res;
}
