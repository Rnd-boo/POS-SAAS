"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function DarkModeToggle({ className = "" }) {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      className={className}
      onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
    >
      {theme === "light" ? (
        <>
          <Sun className="scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <span>Light</span>
        </>
      ) : (
        <>
          <Moon className="scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span>Dark</span>
        </>
      )}
    </Button>
  );
}
