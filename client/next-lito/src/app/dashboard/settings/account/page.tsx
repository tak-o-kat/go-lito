"use client";

import Link from "next/link";
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
import {
  getAuthInputs,
  getUpdatePassword,
} from "@/components/common/auth-helpers";

export default function AccountsPage() {
  const [state, formAction] = useFormState<any, FormData>(renew, undefined);
  return (
    <div className="grid gap-6">
      <form action={formAction}>{getUpdatePassword("renew", state)}</form>
      <Card x-chunk="dashboard-04-chunk-1">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Used to identify your store in the marketplace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <Input placeholder="Store Name" />
          </form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>Save</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
