"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import React, { useState, useEffect } from "react";
import { Switch } from "@/components/ui/custom-switch";

export function ThemeSwitch() {
  const { setTheme, theme } = useTheme();
  const [isChecked, setIsChecked] = useState(theme === "dark" ? true : false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Return a placeholder or null for server-side rendering
    return <div className="toggle-switch-placeholder" />;
  }

  return (
    <div className="flex items-center space-x-2">
      <Switch
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        checked={isChecked}
        onCheckedChange={setIsChecked}
        icon={
          theme === "dark" ? (
            <Sun className="h-4 w-4 text-secondary-foreground" />
          ) : (
            <Moon className="h-4 w-4 text-secondary-foreground" />
          )
        }
      />
    </div>
  );
}
