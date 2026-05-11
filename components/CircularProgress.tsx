"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { PieChart, Pie, Cell } from "recharts";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import type { StackLayer } from "@/lib/types";

interface CircularProgressProps {
  current: number;
  goal: number;
  stackLayers: StackLayer[];
  className?: string;
}

const CHART_SIZE  = 196;
const OUTER_R     = 91;  // outer edge — 7px from SVG boundary
const INNER_R     = 84;  // inner edge — ring is 7px thick (slim)
const PLATE_SIZE  = INNER_R * 2 - 4; // 2px gap each side between plate and ring

const chartConfig: ChartConfig = {
  progress: { label: "Progress" },
  track:    { label: "Track"    },
};

// Positions for up to 4 unique food emojis on the plate
const EMOJI_OFFSETS = [
  { x:  0,   y: -16 },
  { x:  15,  y:   9 },
  { x: -16,  y:   9 },
  { x:   1,  y:   1 },
];

export function CircularProgress({
  current,
  goal,
  stackLayers,
  className,
}: CircularProgressProps) {
  const pct = Math.min(current / goal, 1);

  const arcColor =
    pct >= 1     ? "#4CAF50"
    : pct >= 0.5 ? "#FFC107"
    : "#A0A0A0";

  // PieChart data: progress slice + remaining track
  // Recharts Pie uses value proportional to total — we use 0‥100
  const progressVal  = pct * 100;
  const remainingVal = 100 - progressVal;

  const data = [
    { name: "progress",  value: progressVal  },
    { name: "remaining", value: remainingVal },
  ];

  // Deduplicate emojis: most-recently added, up to 4
  const uniqueEmojis: string[] = [];
  for (const layer of [...stackLayers].reverse()) {
    if (!uniqueEmojis.includes(layer.emoji)) uniqueEmojis.push(layer.emoji);
    if (uniqueEmojis.length >= 4) break;
  }

  return (
    <div className={cn("flex flex-col items-center gap-1.5", className)}>

      {/* Ring + plate */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: CHART_SIZE, height: CHART_SIZE }}
      >
        {/* Recharts pie acts as the donut ring */}
        <ChartContainer
          config={chartConfig}
          className="absolute inset-0"
          initialDimension={{ width: CHART_SIZE, height: CHART_SIZE }}
        >
          <PieChart width={CHART_SIZE} height={CHART_SIZE}>
            {/* Grey track — always full 360° */}
            <Pie
              data={[{ value: 1 }]}
              cx={CHART_SIZE / 2 - 1}
              cy={CHART_SIZE / 2 - 1}
              startAngle={90}
              endAngle={-270}
              innerRadius={INNER_R}
              outerRadius={OUTER_R}
              dataKey="value"
              strokeWidth={0}
              isAnimationActive={false}
            >
              <Cell fill="#E4E4E4" />
            </Pie>

            {/* Progress arc — only rendered when pct > 0 */}
            {pct > 0 && (
              <Pie
                data={data}
                cx={CHART_SIZE / 2 - 1}
                cy={CHART_SIZE / 2 - 1}
                startAngle={90}
                endAngle={-270}
                innerRadius={INNER_R}
                outerRadius={OUTER_R}
                dataKey="value"
                strokeWidth={0}
                isAnimationActive={true}
                animationBegin={0}
                animationDuration={600}
                animationEasing="ease-out"
              >
                <Cell fill={arcColor} />
                <Cell fill="transparent" />
              </Pie>
            )}
          </PieChart>
        </ChartContainer>

        {/* Plate image centered inside the donut hole */}
        <div
          className="relative flex items-center justify-center"
          style={{ width: PLATE_SIZE, height: PLATE_SIZE, zIndex: 1 }}
        >
          <Image
            src="/plate.svg"
            alt="plate"
            width={PLATE_SIZE}
            height={PLATE_SIZE}
            priority
          />

          {/* Food emojis animate onto the plate */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ pointerEvents: "none" }}
          >
            <AnimatePresence>
              {uniqueEmojis.map((emoji, i) => (
                <motion.span
                  key={emoji}
                  initial={{ scale: 0, opacity: 0, y: -8 }}
                  animate={{ scale: 1, opacity: 1, y: 0   }}
                  exit={{    scale: 0, opacity: 0, y:  4  }}
                  transition={{
                    type: "spring",
                    stiffness: 460,
                    damping: 18,
                    delay: i * 0.04,
                  }}
                  className="absolute text-[17px] leading-none select-none"
                  style={{
                    transform: `translate(${EMOJI_OFFSETS[i].x}px, ${EMOJI_OFFSETS[i].y}px)`,
                  }}
                >
                  {emoji}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Label row */}
      <div className="flex items-center justify-between w-full px-2">
        <span className="text-[10px] font-medium" style={{ color: "#B0B0B0" }}>
          0
        </span>
        <motion.span
          className="text-[10px] font-semibold tabular-nums"
          animate={{ color: pct > 0 ? arcColor : "#B0B0B0" }}
          transition={{ duration: 0.4 }}
        >
          {Math.round(pct * 100)}%
        </motion.span>
        <span className="text-[10px] font-medium" style={{ color: "#B0B0B0" }}>
          {goal}
        </span>
      </div>
    </div>
  );
}
