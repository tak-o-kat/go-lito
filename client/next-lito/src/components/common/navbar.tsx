"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { CircleUser, Menu, Package2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { logout } from "@/app/actions/auth-actions";
import ThemeDropdown from "./theme-dropdown";
import { ThemeSwitch } from "./theme-switch";

export default function NavBar() {
  const pathname = usePathname();
  return (
    <div className="flex flex-row justify-center h-[4rem] w-full border-b">
      <div className="flex min-h-screen w-full flex-col">
        <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
            <Link
              href="#"
              className="flex items-center gap-2 text-lg font-semibold md:text-base"
            >
              <Package2 className="h-6 w-6" />
              <span className="sr-only">Lito UI</span>
            </Link>
            <Link
              href="/dashboard/home"
              className={`${
                pathname.includes("/dashboard/home")
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground"
              }  transition-colors hover:text-foreground`}
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/settings/"
              className={`${
                pathname.includes("/dashboard/settings/")
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground"
              } transition-colors hover:text-foreground`}
            >
              Settings
            </Link>
          </nav>
          {/* Mobile menu */}
          <Sheet aria-label="Mobile menu">
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
                aria-describedby="mobile-menu"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" aria-describedby="mobile-menu">
              <SheetDescription></SheetDescription>
              <SheetTitle></SheetTitle>
              <nav className="grid gap-6 text-lg font-medium">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <Package2 className="h-6 w-6" />
                  <span className="sr-only">Lito UI</span>
                </div>
                <Link
                  href="/dashboard/home"
                  className={`${
                    pathname.includes("/dashboard/home")
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground"
                  } hover:text-foreground`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/settings/"
                  className={`${
                    pathname.includes("/dashboard/settings/")
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground"
                  } hover:text-foreground`}
                >
                  Settings
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4 justify-end">
            <ThemeSwitch />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                >
                  <CircleUser className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="flex justify-center">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex justify-center">
                  Settings
                </DropdownMenuItem>
                <ThemeDropdown />
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <form action={logout} className="w-full">
                    <Button
                      variant="ghost"
                      className="w-full h-6 justify-center px-0"
                    >
                      Logout
                    </Button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
      </div>
    </div>
  );
}
