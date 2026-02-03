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

        <div className="fixed inset-0 -z-10 bg-white/50 dark:bg-black/55" />
        <div className="fixed inset-0 -z-10 bg-gradient-to-b from-transparent via-transparent to-black/25 dark:to-black/50" />


        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
