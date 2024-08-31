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
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

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
  const inputType = state?.error?.split(" ")[0];
  return (
    <div className="grid gap-2">
      <Label htmlFor="username">Username</Label>
      <Input
        id="username"
        type="username"
        name="username"
        className={`${inputType === "username" ? "border-destructive" : ""}`}
        required
      />
      {inputType === "username" && (
        <p className="text-destructive">{state?.error}</p>
      )}
    </div>
  );
}

function getPasswordInput(state: any) {
  const inputType = state?.error?.split(" ")[0];
  return (
    <div className="grid gap-2">
      <Label htmlFor="password">Password</Label>
      <Input
        id="password"
        type="password"
        name="password"
        className={`${
          inputType === "password" || inputType === "passwords"
            ? "border-destructive"
            : ""
        }`}
        required
      />
      {inputType === "password" && (
        <p className="text-destructive">{state?.error}</p>
      )}
    </div>
  );
}

function getConfirmPasswordInput(state: any) {
  const inputType = state?.error?.split(" ")[0];
  return (
    <div className="grid gap-2">
      <Label htmlFor="confirm-password">Confirm Password</Label>
      <Input
        id="confirm-password"
        type="password"
        name="confirm-password"
        className={`${inputType === "passwords" ? "border-destructive" : ""}`}
        required
      />
      {inputType === "passwords" && (
        <p className="text-destructive">{state?.error}</p>
      )}
    </div>
  );
}

function getCurrentPasswordInput(state: any) {
  const inputType = state?.error?.split(" ")[0];
  return (
    <div className="grid gap-2">
      <Label htmlFor="current-password">Current Password</Label>
      <Input
        id="current-password"
        type="password"
        name="current-password"
        className={`${inputType === "current" ? "border-destructive" : ""}`}
        required
      />
      {inputType === "current" && (
        <p className="text-destructive">{state?.error}</p>
      )}
    </div>
  );
}

function SubmitButton({ typeName }: { typeName: authTypes }) {
  const { pending } = useFormStatus();
  const width = typeName === "renew" ? "w-40" : "w-full";
  return (
    <Button className={`${width}`} disabled={pending}>
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        getPageButton(typeName)
      )}
    </Button>
  );
}

export function getAuthInputs(typeName: authTypes, state: any) {
  // If error doesn't equal the input types then it's an alt error
  const errorType = state?.error?.split(" ")[0];
  const altErr =
    errorType !== "username" &&
    errorType !== "passwords" &&
    errorType !== "password";

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
        {getPasswordInput(state)}
        {typeName !== "login" && getConfirmPasswordInput(state)}
        {altErr && <p className="text-destructive">{state?.error}</p>}
      </CardContent>
      <CardFooter>
        <SubmitButton typeName={typeName} />
      </CardFooter>
    </Card>
  );
}

export function getUpdatePassword(typeName: authTypes, state: any) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">{getPageTitle(typeName)}</CardTitle>
        <CardDescription className="">
          {getPageDescription(typeName)}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 ">
        <div className="gap-2 hidden">
          <input
            value={typeName}
            id="type-name"
            type="hidden"
            name="type-name"
          />
        </div>
        {getCurrentPasswordInput(state)}
        {getPasswordInput(state)}
        {getConfirmPasswordInput(state)}
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <SubmitButton typeName={typeName} />
      </CardFooter>
    </Card>
  );
}
