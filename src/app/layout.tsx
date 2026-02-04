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

  const bgUrl = isDark ? "/bg-dark1.jpg" : "/bg-light1.webp";

  return (
    <html lang="tr" className={isDark ? "dark" : ""} suppressHydrationWarning>
      <body
        className="min-h-screen antialiased text-zinc-900 dark:text-zinc-50"
        style={{
          backgroundImage: `url(${bgUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {children}
      </body>
    </html>
  );
}
