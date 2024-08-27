"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";
import { useFormState } from "react-dom";
import { updateUserTheme } from "@/app/actions/update-actions";
import { Button } from "../ui/button";

export default function ThemeSelect() {
  const [state, formAction] = useFormState<any, FormData>(
    updateUserTheme,
    undefined
  );
  return (
    <form action={formAction}>
      <Card x-chunk="dashboard-04-chunk-1">
        <CardHeader>
          <CardTitle>Theme Selector</CardTitle>
          <CardDescription>
            Used to identify your store in the marketplace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select name="theme">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Themes</SelectLabel>
                <SelectSeparator />
                <SelectItem value="theme-default">Default</SelectItem>
                <SelectItem value="theme-green">Green</SelectItem>
                <SelectItem value="theme-blue">Blue</SelectItem>
                <SelectItem value="theme-rose">Rose</SelectItem>
                <SelectItem value="theme-teal">Teal</SelectItem>
                <SelectItem value="theme-slate-blue">Slate Blue</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>Save Theme</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
