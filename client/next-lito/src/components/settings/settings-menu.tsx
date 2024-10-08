"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SettingsMenu() {
  const pathname = usePathname();
  const textHighlight = "font-semibold text-primary";
  return (
    <nav
      className="grid gap-4 text-sm text-muted-foreground"
      x-chunk="dashboard-04-chunk-0"
    >
      <Link
        href="/dashboard/settings/general"
        className={`${
          pathname === "/dashboard/settings/general" && textHighlight
        }`}
      >
        General
      </Link>
    </nav>
  );
}
