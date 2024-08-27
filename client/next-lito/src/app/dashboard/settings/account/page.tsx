"use client";

import { useFormState } from "react-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

import { renew } from "@/app/actions/auth-actions";
import { getUpdatePassword } from "@/components/common/auth-helpers";

export default function AccountsPage() {
  const [state, formAction] = useFormState<any, FormData>(renew, undefined);
  return (
    <div className="grid gap-6">
      <form action={formAction}>{getUpdatePassword("renew", state)}</form>
    </div>
  );
}
