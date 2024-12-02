"use client";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import localFont from "next/font/local";
import { useEffect } from "react";
import "./globals.css";

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

const FaviconUpdater = () => {
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    const updateFavicon = (theme: string) => {
      const favicon = document.getElementById("favicon") as HTMLLinkElement;
      if (favicon) {
        favicon.href = theme === "dark" ? "/favicon-dark.ico" : "/favicon-light.ico";
      }
    };

    if (resolvedTheme) {
      updateFavicon(resolvedTheme);
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        updateFavicon(e.matches ? "dark" : "light");
      }
    };
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [theme, resolvedTheme]);

  return null;
};

import { QueryClient, QueryClientProvider } from 'react-query';
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link id="favicon" rel="icon" href="/favicon-light.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <QueryClientProvider client={queryClient}>
            
              <FaviconUpdater />
              {children}
            </QueryClientProvider>
          </NextThemesProvider>
        </SessionProvider>
      </body>
    </html>
  );
}