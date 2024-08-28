import { Card } from "@/components/ui/card";

export default function StatusIndicators() {
  return (
    <div className="flex items-center justify-center sm:justify-start gap-2 pt-4 sm:py-4">
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <Card className="p-2  text-xs">
          Status: <span className="font-bold text-primary">Online</span>
        </Card>
        <Card className="p-2 text-xs">
          Last block: <span className="font-bold text-primary">42027714</span>
        </Card>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <Card className="p-2 text-xs">
          Network: <span className="font-bold text-primary">mainnet-v1.0</span>
        </Card>
        <Card className="p-2 text-xs">
          Version: <span className="font-bold text-primary">3.25.0.stable</span>
        </Card>
      </div>
    </div>
  );
}
