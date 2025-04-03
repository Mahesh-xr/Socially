"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useState, useEffect } from "react";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Ensures rendering happens only after hydration
  }, []);

  if (!mounted) return <>{children}</>; // Avoids SSR/CSR mismatch

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
