import "./globals.css";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const c = await cookies();
  const isDark = c.get("theme")?.value === "dark";

  return (
    <html lang="tr" className={isDark ? "dark" : ""}>
      <body>{children}</body>
    </html>
  );
}
