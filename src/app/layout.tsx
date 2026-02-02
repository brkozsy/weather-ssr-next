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
      <body className="min-h-screen bg-zinc-50 text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-50">
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-zinc-200/60 blur-3xl dark:bg-white/8" />
          <div className="absolute -right-40 top-24 h-96 w-96 rounded-full bg-zinc-300/50 blur-3xl dark:bg-white/8" />
          <div className="absolute left-1/3 bottom-[-12rem] h-[28rem] w-[28rem] rounded-full bg-zinc-200/50 blur-3xl dark:bg-white/8" />
        </div>

        {children}
      </body>

    </html>
  );
}
