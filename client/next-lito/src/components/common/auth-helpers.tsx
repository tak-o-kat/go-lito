import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type authTypes = "login" | "signup" | "renew";

function getPageTitle(typeName: authTypes) {
  switch (typeName) {
    case "login":
      return "Sign in";
    case "signup":
      return "Create an account";
    case "renew":
      return "Update password";
  }
}

function getPageDescription(typeName: authTypes) {
  switch (typeName) {
    case "login":
      return "Enter your username and password.";
    case "signup":
      return "Enter your account details.";
    case "renew":
      return "Enter your new password and confirm it.";
  }
}

function getPageButton(typeName: authTypes) {
  switch (typeName) {
    case "login":
      return "Sign in";
    case "signup":
      return "Create account";
    case "renew":
      return "Update password";
  }
}

function getUsernameInput(state: any) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="username">Username</Label>
      <Input id="username" type="username" name="username" required />
    </div>
  );
}

export function getAuthInputs(typeName: authTypes, state: any) {
  return (
    <Card className="w-full sm:w-96 max-w-sm p-3">
      <CardHeader>
        <CardTitle className="text-2xl flex justify-center">
          {getPageTitle(typeName)}
        </CardTitle>
        <CardDescription className="text-center">
          {getPageDescription(typeName)}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="gap-2 hidden">
          <input
            value={typeName}
            id="type-name"
            type="hidden"
            name="type-name"
          />
        </div>
        {typeName !== "renew" && getUsernameInput(state)}
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id={`${typeName}-password`}
            type="password"
            name="password"
            required
          />
          {state?.error && <p className="text-destructive">{state?.error}</p>}
        </div>
        {typeName !== "login" && (
          <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id={`confirm-password`}
              type="password"
              name="confirm-password"
              required
            />
            {state?.error && <p className="text-destructive">{state?.error}</p>}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full">{getPageButton(typeName)}</Button>
      </CardFooter>
    </Card>
  );
}
