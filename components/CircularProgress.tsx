"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import type { StackLayer } from "@/lib/types";

interface CircularProgressProps {
  current: number;
  goal: number;
  stackLayers: StackLayer[];
}

const SVG_SIZE  = 196;
const CX        = SVG_SIZE / 2;
const CY        = SVG_SIZE / 2;
const STROKE_W  = 8;
const R         = 92; // outer edge at 96, leaves 2px margin inside SVG
const CIRC      = 2 * Math.PI * R;
const ARC_DEG   = 270;
const ARC_LEN   = (ARC_DEG / 360) * CIRC;
const GAP_LEN   = CIRC - ARC_LEN;
// Gap sits at bottom center; arc starts bottom-left, ends bottom-right
const ROTATE    = `rotate(135 ${CX} ${CY})`;
// Plate fills the inner circle with 5px gap on every side
// inner radius = R - STROKE_W/2 = 92 - 4 = 88 → inner diameter 176 → plate = 166
const PLATE_SIZE = 166;

// Positions for up to 4 emojis on the plate (relative to plate center)
const EMOJI_OFFSETS = [
  { x:  0,   y: -18 },
  { x:  16,  y:  10 },
  { x: -18,  y:  10 },
  { x:   2,  y:   2 },
];

export function CircularProgress({ current, goal, stackLayers }: CircularProgressProps) {
  const pct = Math.min(current / goal, 1);

  const arcColor =
    pct >= 1     ? "#4CAF50"
    : pct >= 0.5 ? "#FFC107"
    : "#C8C8C8";

  // Deduplicate emojis — show up to 4 unique food types currently on plate
  const uniqueEmojis: string[] = [];
  for (const layer of [...stackLayers].reverse()) {
    if (!uniqueEmojis.includes(layer.emoji)) uniqueEmojis.push(layer.emoji);
    if (uniqueEmojis.length >= 4) break;
  }

  // strokeDashoffset drives the filled arc length: 0 = full, ARC_LEN = empty
  const dashOffset = ARC_LEN * (1 - pct);

  return (
    <div className="flex flex-col items-center gap-1.5">

      {/* Ring + plate */}
      <div className="relative flex items-center justify-center" style={{ width: SVG_SIZE, height: SVG_SIZE }}>

        {/* SVG ring */}
        <svg
          width={SVG_SIZE}
          height={SVG_SIZE}
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          {/* Grey track */}
          <circle
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            stroke="#E4E4E4"
            strokeWidth={STROKE_W}
            strokeDasharray={`${ARC_LEN} ${GAP_LEN}`}
            strokeLinecap="round"
            transform={ROTATE}
          />

          {/* Animated progress arc */}
          <motion.circle
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            strokeWidth={STROKE_W}
            strokeLinecap="round"
            strokeDasharray={`${ARC_LEN} ${GAP_LEN}`}
            transform={ROTATE}
            animate={{
              strokeDashoffset: dashOffset,
              stroke: arcColor,
            }}
            initial={false}
            transition={{
              strokeDashoffset: { type: "spring", stiffness: 180, damping: 24 },
              stroke:           { duration: 0.45, ease: "easeInOut" },
            }}
          />
        </svg>

        {/* Plate image — centered inside ring */}
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

          {/* Food emojis on plate */}
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
                  transition={{ type: "spring", stiffness: 460, damping: 18, delay: i * 0.04 }}
                  className="absolute text-[18px] leading-none select-none"
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

      {/* Percentage label row */}
      <div className="flex items-center justify-between w-full px-2">
        <span className="text-[10px] font-medium" style={{ color: "#B0B0B0" }}>0</span>
        <motion.span
          className="text-[10px] font-semibold tabular-nums"
          animate={{ color: arcColor }}
          transition={{ duration: 0.4 }}
        >
          {Math.round(pct * 100)}%
        </motion.span>
        <span className="text-[10px] font-medium" style={{ color: "#B0B0B0" }}>{goal}</span>
      </div>
    </div>
  );
}
