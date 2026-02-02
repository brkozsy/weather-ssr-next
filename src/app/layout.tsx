import "./globals.css";
import { getThemeFromCookie } from "@/lib/themeCookie.server";
import ThemeSync from "@/components/ThemeSync";


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = await getThemeFromCookie();

  return (
    <html lang="tr" className={theme === "dark" ? "dark" : ""}>
      <body>
        <ThemeSync />
        {children}
      </body>

    </html>
  );
}
