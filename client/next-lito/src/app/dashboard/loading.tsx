import { Loader2Icon } from "lucide-react";
import React from "react";

export default function Loader() {
  return (
    <div className="flex min-h-screen">
      <Loader2Icon className="m-auto h-12 w-12 animate-spin" />
    </div>
  );
}
