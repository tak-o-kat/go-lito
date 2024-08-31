"use client";

import React, { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/custom-switch";

export function ThemeSwitch() {
  const { setTheme, theme } = useTheme();
  const [isChecked, setIsChecked] = useState(theme === "dark");

  React.useEffect(() => {
    isChecked ? setTheme("dark") : setTheme("light");
  });
  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={isChecked}
        onCheckedChange={setIsChecked}
        icon={
          isChecked ? (
            <Sun className="h-4 w-4 text-secondary-foreground" />
          ) : (
            <Moon className="h-4 w-4 text-secondary-foreground" />
          )
        }
      />
    </div>
  );
}
