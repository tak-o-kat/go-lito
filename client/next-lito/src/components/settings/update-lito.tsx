"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFormState } from "react-dom";
import { updateLito } from "@/app/actions/update-lito-actions";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

interface propTypes {
  version: string;
  repoVersion: string;
}

export default function UpdateLito({ version, repoVersion }: propTypes) {
  const [state, formAction] = useFormState<any, FormData>(
    updateLito,
    undefined
  );

  const [updateRequired, setUpdateRequired] = useState(version !== repoVersion);

  useEffect(() => {
    console.log("State changed:", state);
  }, [state]);

  return (
    <form action={formAction}>
      <Card x-chunk="dashboard-04-chunk-1">
        <CardHeader>
          <CardTitle>Update Lito</CardTitle>
          <CardDescription>Used to update lito.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row justtify-start items-center gap-2">
            <span>Installed Version:</span>
            <span className="font-semibold">{version}</span>
          </div>
          <div className="flex flex-row justtify-start items-center gap-2">
            <span>Latest Version:</span>
            <span className="font-semibold">{repoVersion}</span>
          </div>
          <div className="flex flex-row justtify-start items-center gap-2">
            <span>Update Status:</span>
            <span className="font-semibold">{`${
              updateRequired ? "Update Available!" : "No Update Required"
            }`}</span>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4 flex flex-col gap-2">
          <Button
            className="dark:text-primary-foreground"
            disabled={!updateRequired}
          >
            Update Lito
          </Button>
          <Button className="dark:text-primary-foreground">Test Update</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
