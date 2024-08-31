import { Loader2Icon } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="flex flex-row justify-center pt-20">
      <Loader2Icon className="h-12 w-12 animate-spin" />
    </div>
  );
}
