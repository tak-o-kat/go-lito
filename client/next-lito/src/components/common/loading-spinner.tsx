import { Loader2Icon } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="flex flex-row justify-center">
      <Loader2Icon className="h-12 w-12 animate-spin" />
    </div>
  );
}
