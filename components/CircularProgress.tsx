"use client";

import { forwardRef } from "react";
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
  isAnyDragging?: boolean;
  isDragOverPlate?: boolean;
  className?: string;
}

const CHART_SIZE = 196;
const OUTER_R    = 91;
const INNER_R    = 84;
// plate radius = INNER_R - 10 (10px gap on every side) = 74 → diameter 148
const PLATE_SIZE = 148;

const chartConfig: ChartConfig = {
  progress: { label: "Progress" },
  track:    { label: "Track"    },
};

// Deterministic emoji positions on the plate (up to 6)
const EMOJI_SLOTS = [
  { x:  0,   y:  0,  r: -6  },
  { x: -13,  y: -11, r:  8  },
  { x:  13,  y: -11, r: -5  },
  { x: -12,  y:  11, r:  6  },
  { x:  12,  y:  11, r: -9  },
  { x:   0,  y: -18, r:  4  },
];

// Deterministic confetti particles — no Math.random()
const CONFETTI = [
  { id: 0, color: "#4CAF50", tx:  56, ty: -46 },
  { id: 1, color: "#FFC107", tx:  72, ty: -12 },
  { id: 2, color: "#4CAF50", tx:  52, ty:  42 },
  { id: 3, color: "#FF7043", tx:   8, ty:  66 },
  { id: 4, color: "#FFC107", tx: -52, ty:  42 },
  { id: 5, color: "#64B5F6", tx: -72, ty: -12 },
  { id: 6, color: "#4CAF50", tx: -56, ty: -46 },
  { id: 7, color: "#FF7043", tx:  -8, ty: -66 },
  { id: 8, color: "#FFC107", tx:  30, ty: -62 },
  { id: 9, color: "#64B5F6", tx: -30, ty: -62 },
];

function ConfettiBurst() {
  return (
    <>
      {CONFETTI.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 7, height: 7,
            background: p.color,
            top: "50%", left: "50%",
            marginLeft: -3.5, marginTop: -3.5,
          }}
          initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          animate={{ x: p.tx, y: p.ty, scale: 0, opacity: 0 }}
          transition={{ duration: 0.75, ease: "easeOut", delay: p.id * 0.04 }}
        />
      ))}
    </>
  );
}

export const CircularProgress = forwardRef<HTMLDivElement, CircularProgressProps>(
  function CircularProgress(
    { current, goal, stackLayers, isAnyDragging, isDragOverPlate, className },
    ref
  ) {
    const pct          = Math.min(current / goal, 1);
    const isGoalReached = pct >= 1;

    const arcColor =
      pct >= 1     ? "#4CAF50"
      : pct >= 0.5 ? "#FFC107"
      : "#A0A0A0";

    const progressVal  = pct * 100;
    const remainingVal = 100 - progressVal;
    const data = [
      { name: "progress",  value: progressVal  },
      { name: "remaining", value: remainingVal },
    ];

    // Up to 6 unique emojis, most recent first
    const uniqueEmojis: string[] = [];
    for (const layer of [...stackLayers].reverse()) {
      if (!uniqueEmojis.includes(layer.emoji)) uniqueEmojis.push(layer.emoji);
      if (uniqueEmojis.length >= 6) break;
    }

    return (
      <div className={cn("flex flex-col items-center gap-0", className)}>

        {/* ── Ring + plate ── */}
        <div
          className="relative flex items-center justify-center"
          style={{ width: CHART_SIZE, height: CHART_SIZE }}
        >
          {/* Pulse wrapper — animates when dragging */}
          <motion.div
            className="absolute inset-0"
            animate={
              isAnyDragging
                ? { scale: [1, 1.025, 1], transition: { repeat: Infinity, duration: 1.3, ease: "easeInOut" } }
                : { scale: 1 }
            }
          >
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

                {/* Coloured progress arc */}
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
                    isAnimationActive
                    animationBegin={0}
                    animationDuration={550}
                    animationEasing="ease-out"
                  >
                    <Cell fill={arcColor} />
                    <Cell fill="transparent" />
                  </Pie>
                )}
              </PieChart>
            </ChartContainer>
          </motion.div>

          {/* Drop-zone glow when hovering over plate */}
          <AnimatePresence>
            {isDragOverPlate && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{ boxShadow: "0 0 0 4px rgba(76,175,80,0.28), 0 0 24px 8px rgba(76,175,80,0.14)" }}
              />
            )}
          </AnimatePresence>

          {/* ── Plate — drop zone (ref forwarded here) ── */}
          <motion.div
            ref={ref}
            className="relative flex items-center justify-center"
            animate={isDragOverPlate ? { scale: 1.05 } : { scale: 1 }}
            transition={{ type: "spring", stiffness: 340, damping: 22 }}
            style={{ width: PLATE_SIZE, height: PLATE_SIZE, zIndex: 2 }}
          >
            <Image
              src="/plate.svg"
              alt="plate"
              width={PLATE_SIZE}
              height={PLATE_SIZE}
              priority
            />

            {/* Food emojis clustered on plate */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ pointerEvents: "none" }}
            >
              <AnimatePresence>
                {uniqueEmojis.map((emoji, i) => (
                  <motion.span
                    key={emoji}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{    scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 22, delay: i * 0.03 }}
                    className="absolute text-[13px] leading-none select-none"
                    style={{
                      transform: `translate(${EMOJI_SLOTS[i].x}px, ${EMOJI_SLOTS[i].y}px) rotate(${EMOJI_SLOTS[i].r}deg)`,
                    }}
                  >
                    {emoji}
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Confetti burst on goal */}
          <AnimatePresence>
            {isGoalReached && <ConfettiBurst key="confetti" />}
          </AnimatePresence>
        </div>

        {/* ── Goal achieved text ── */}
        <AnimatePresence>
          {isGoalReached && (
            <motion.div
              initial={{ opacity: 0, y: 8  }}
              animate={{ opacity: 1, y: 0  }}
              exit={{    opacity: 0, y: 4  }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              className="text-[11px] font-semibold mt-0.5"
              style={{ color: "#4CAF50" }}
            >
              Calorie achieved — enjoy 🎉
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
