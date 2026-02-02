import "server-only";
import { cookies } from "next/headers";

const COOKIE_NAME = "theme";

export async function getThemeFromCookie(): Promise<"light" | "dark"> {
  const c = await cookies();
  const value = c.get(COOKIE_NAME)?.value;
  return value === "dark" ? "dark" : "light";
}
