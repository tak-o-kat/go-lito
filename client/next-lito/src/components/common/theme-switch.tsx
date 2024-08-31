import React, { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/custom-switch";

export function ThemeSwitch() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      <Switch
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
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
