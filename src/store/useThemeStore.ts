"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ThemeName = "navy" | "pink";

interface ThemeState {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "navy",

      setTheme: (theme) => set({ theme }),

      toggleTheme: () => {
        const current = get().theme;
        set({ theme: current === "navy" ? "pink" : "navy" });
      },
    }),
    {
      name: "app-theme-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
