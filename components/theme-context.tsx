import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import { useColorScheme as useSystemColorScheme } from '@/hooks/use-color-scheme';

type ColorScheme = 'light' | 'dark';

type AppThemeContextValue = {
  scheme: ColorScheme;
  toggle: () => void;
};

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useSystemColorScheme() ?? 'light';
  const [override, setOverride] = useState<ColorScheme | null>(null);

  const value = useMemo<AppThemeContextValue>(() => {
    const scheme = override ?? systemScheme;
    return {
      scheme,
      toggle: () => setOverride(scheme === 'dark' ? 'light' : 'dark'),
    };
  }, [override, systemScheme]);

  return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>;
}

export function useAppTheme(): AppThemeContextValue {
  const ctx = useContext(AppThemeContext);
  if (!ctx) {
    throw new Error('useAppTheme must be used within AppThemeProvider');
  }
  return ctx;
}
