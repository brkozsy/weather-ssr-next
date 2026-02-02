import "./globals.css";
import { getThemeFromCookie } from "@/lib/themeCookie.server";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = await getThemeFromCookie(); // ✅ await

  return (
    <html lang="tr" className={theme === "dark" ? "dark" : ""}>
      <body>{children}</body>
    </html>
  );
}
