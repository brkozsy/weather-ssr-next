import { create } from "zustand";

export type Theme = "light" | "dark";

type ThemeState = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
};

export const useThemeStore = create<ThemeState>((set, get) => ({
    theme: "light",
    setTheme: (theme) => set({ theme }),
    toggleTheme: () => {
        const next = get().theme === "light" ? "dark" : "light";
        set({ theme: next });
    },
}));
