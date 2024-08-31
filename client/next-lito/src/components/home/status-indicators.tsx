import { Card } from "@/components/ui/card";

export default function StatusIndicators() {
  return (
    <div className="flex items-center justify-center sm:justify-start gap-2 pt-4 sm:py-4">
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <Card className="p-2 text-xs md:text-sm">
          Node Status:{" "}
          <span
            className={`[--status-color:hsl(var(--status-indicator))] font-semibold text-[var(--status-color)] `}
          >
            Up
          </span>
        </Card>
        <Card className="p-2 text-xs md:text-sm">
          Last block:{" "}
          <span
            className={`[--status-color:hsl(var(--status-indicator))] font-semibold  text-[var(--status-color)] `}
          >
            42027714
          </span>
        </Card>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <Card className="p-2 text-xs md:text-sm">
          Network:{" "}
          <span
            className={`[--status-color:hsl(var(--status-indicator))] font-semibold text-[var(--status-color)] `}
          >
            mainnet-v1.0
          </span>
        </Card>
        <Card className="p-2 text-xs md:text-sm">
          Version:{" "}
          <span
            className={`[--status-color:hsl(var(--status-indicator))] font-semibold text-[var(--status-color)] `}
          >
            3.25.0.stable
          </span>
        </Card>
      </div>
    </div>
  );
}
