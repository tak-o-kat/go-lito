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

interface propTypes {
  currentTheme: string;
}

export default function ThemeSelect({ currentTheme }: propTypes) {
  const [state, formAction] = useFormState<any, FormData>(
    updateUserTheme,
    undefined
  );

  return (
    <form action={formAction}>
      <Card x-chunk="dashboard-04-chunk-1">
        <CardHeader>
          <CardTitle>Default Theme</CardTitle>
          <CardDescription>
            Used to change the theme of your app.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select name="theme" defaultValue={currentTheme}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Themes</SelectLabel>
                <SelectSeparator />
                <SelectItem value="theme-default">Default</SelectItem>
                <SelectItem value="theme-green">Green</SelectItem>
                <SelectItem value="theme-rose">Rose</SelectItem>
                <SelectItem value="theme-teal">Teal</SelectItem>
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
