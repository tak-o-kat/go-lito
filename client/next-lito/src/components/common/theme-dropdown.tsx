"use client";

import { useTheme } from "next-themes";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronLeft } from "lucide-react";

export default function ThemeDropdown() {
  const { setTheme } = useTheme();
  return (
    <DropdownMenuGroup>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger className="flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent">
          <div className="flex flex-row justify-center items-center">
            <ChevronLeft className="mr-2 h-4 w-4" />
            <span className="text-sm">Theme</span>
          </div>
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <span>Light</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <span>Dark</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setTheme("system")}>
              <span>System</span>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    </DropdownMenuGroup>
  );
}
