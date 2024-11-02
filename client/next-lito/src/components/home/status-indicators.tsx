import { GalleryHorizontalEnd, Cuboid, Network } from "lucide-react";
import {
  checkAlgodIsRunning,
  getNodeStatus,
  NodeStatus,
} from "@/lib/cmd/goal-commands";

export default async function StatusIndicators() {
  const isRunning = await checkAlgodIsRunning();
  const indicators: any | NodeStatus = isRunning && (await getNodeStatus());
  let status: string = "";
  let nodeStatusColor: string = "";
  let serverColor: string = "";

  if (isRunning === false) {
    status = "Down";
    nodeStatusColor = "text-rose-500";
    serverColor = "bg-rose-500";
  } else if (indicators?.Sync! !== "0.0s") {
    status = "Syncing";
    nodeStatusColor = "text-blue-400 animate-pulse";
    serverColor = "bg-indigo-400 animate-pulse";
  } else if (indicators?.Sync! === "0.0s") {
    status = "Synced";
    nodeStatusColor = "text-teal-400";
    serverColor = "bg-teal-400";
  }

  return (
    <div className="flex flex-row items-center gap-2 w-full pt-1">
      <div className="flex flex-row justify-around md:justify-between gap-2 w-full text-xs">
        <div className="flex gap-4">
          <div className="font-medium flex flex-col sm:flex-row gap-1 md:gap-2">
            <div className="flex justify-center">
              <div className={`${serverColor} rounded-full w-4 h-4`} />
            </div>
            <div className="font-medium flex flex-col sm:flex-row gap-1">
              <span className="hidden md:block">{`Node Status: `}</span>
              <span
                className={` font-semibold text-[10px] sm:text-xs`}
              >{`${status}`}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="font-medium flex flex-col sm:flex-row gap-1">
            <div className="flex justify-center font-extralight">
              <GalleryHorizontalEnd className="h-4 w-4" />
            </div>
            <span className="hidden md:block">{`Version: `}</span>
            <span className={` font-semibold text-[10px] sm:text-xs`}>{`${
              indicators.Version || " --"
            }`}</span>
          </div>
        </div>

        <div className="flex gap-4 ">
          <div className="font-medium flex flex-col sm:flex-row gap-1">
            <div className="flex justify-center font-extralight">
              <Network className="h-4 w-4" />
            </div>

            <span className="hidden md:block">{`Network: `}</span>
            <span className={` font-semibold text-[10px] sm:text-xs`}>{`${
              indicators.Genesis || " --"
            }`}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="font-medium flex flex-col sm:flex-row gap-1">
            <div className="flex justify-center font-extralight">
              <Cuboid className="h-4 w-4" />
            </div>
            <span className="hidden md:block">{`Last Block: `}</span>
            <span className={` font-semibold text-[10px] sm:text-xs`}>{`${
              indicators.Last || " --"
            }`}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// char
