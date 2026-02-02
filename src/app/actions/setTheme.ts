"use server";

import { cookies } from "next/headers";

export async function setTheme(theme: "light" | "dark") {
    const c = await cookies();
    c.set("theme", theme, {
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    });
}
