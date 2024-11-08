"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

export function ThemeProvider({ children, ...props }: Readonly<ThemeProviderProps>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}