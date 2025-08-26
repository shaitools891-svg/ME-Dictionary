import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "sepia" | "forest";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("dictionary-theme");
    return (stored as Theme) || "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove("dark", "theme-sepia", "theme-forest");
    
    // Add the selected theme class
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "sepia") {
      root.classList.add("theme-sepia");
    } else if (theme === "forest") {
      root.classList.add("theme-forest");
    }
    
    localStorage.setItem("dictionary-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
