'use client';

import * as React from 'react';

export type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = React.useState<ThemeMode>('dark');
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('theme') as ThemeMode | null;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setMode(savedTheme);
    }
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (mounted) {
      localStorage.setItem('theme', mode);
    }
  }, [mode, mounted]);

  const toggleTheme = () => {
    setMode((prev: ThemeMode) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
