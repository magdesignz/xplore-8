"use client";

import { motion } from "motion/react";

interface ProgressBarProps {
  current: number;
  goal: number;
}

export function ProgressBar({ current, goal }: ProgressBarProps) {
  const pct = Math.min(current / goal, 1);

  const barColor =
    pct >= 1     ? "#4CAF50"
    : pct >= 0.5 ? "#FFC107"
    : "#C8C8C8";

  // Zero-value shadow allows smooth interpolation away from a glow.
  const glowShadow =
    pct >= 1     ? "0px 0px 14px 3px rgba(76,175,80,0.38)"
    : pct >= 0.5 ? "0px 0px 14px 3px rgba(255,193,7,0.38)"
    : "0px 0px 0px 0px rgba(0,0,0,0)";

  return (
    <div className="w-full flex flex-col gap-1">
      <div
        className="relative w-full rounded-full overflow-hidden"
        style={{ height: 7, background: "#E4E4E4" }}
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          initial={false}
          animate={{
            width: `${pct * 100}%`,
            backgroundColor: barColor,
            boxShadow: glowShadow,
          }}
          transition={{
            width:           { type: "spring", stiffness: 220, damping: 26 },
            backgroundColor: { duration: 0.45, ease: "easeInOut" },
            boxShadow:       { duration: 0.45 },
          }}
        />
      </div>

      {/* Percentage label */}
      <div className="flex justify-between">
        <span className="text-[10px] font-medium" style={{ color: "#B0B0B0" }}>
          0
        </span>
        <motion.span
          className="text-[10px] font-semibold tabular-nums"
          animate={{ color: barColor }}
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
