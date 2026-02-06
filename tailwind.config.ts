import type { Config } from "tailwindcss";

const config: Config = {
    // next-themes için dark mode ayarı
    darkMode: "class",

    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        // Eğer src kullanmıyorsan şu satırları aç:
        // "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        // "./components/**/*.{js,ts,jsx,tsx,mdx}",
        // "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // globals.css içindeki değişkenleri buraya bağlıyoruz
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
        },
    },
    plugins: [],
};
export default config;