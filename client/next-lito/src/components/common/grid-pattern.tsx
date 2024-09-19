"use client";

import { cn } from "@/lib/utils";
import GridPattern from "@/components/magicui/grid-pattern";

const GridPatternLinearGradient = () => {
  return (
    <div className="absolute -z-10 flex h-full w-full items-center justify-center overflow-hidden">
      <GridPattern width={20} height={20} x={-1} y={-1} />
    </div>
  );
};

export default GridPatternLinearGradient;
