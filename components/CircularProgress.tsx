"use client";

import { forwardRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import type { StackLayer } from "@/lib/types";

// ── Ring geometry extracted from Circle path.svg (viewBox 0 0 177 177) ────────
const VB        = 177;                                // viewBox size
const CX        = 88.5;                               // circle center
const CY        = 88.5;
const OUTER_R   = 88.5;                               // outer radius of ring
const INNER_R   = 76.9188;                            // inner radius  (88.5 - 11.5812)
const MID_R     = (OUTER_R + INNER_R) / 2;           // 82.7094 — stroke drawn here
const RING_W    = OUTER_R - INNER_R;                  // 11.5812 — stroke width
const CIRC      = 2 * Math.PI * MID_R;               // ≈ 519.66 — full circumference

// ── Rendered dimensions ────────────────────────────────────────────────────────
const SVG_SIZE  = 196;                                // CSS px the SVG occupies
const SCALE     = SVG_SIZE / VB;                      // 196/177 ≈ 1.107
// Inner radius in CSS px at render size, then subtract 10 px gap each side
const PLATE_SIZE = Math.round((INNER_R * SCALE - 10) * 2); // ≈ 150 px

// ── Fixed plate layouts for SVG food assets ───────────────────────────────────
const PLATE_LAYOUTS: Record<string, { w: number; h: number; x: number; y: number; scale: number; rotate: number; zIndex: number }> = {
  salad:          { w: 82, h: 71, x:  -6, y:  10, scale: 1.18, rotate:  -2, zIndex: 2 },
  "chicken-bowl": { w: 40, h: 55, x:  18, y: -34, scale: 0.84, rotate:  18, zIndex: 5 },
  pancake:        { w: 55, h: 55, x:  42, y:  -2, scale: 1.08, rotate:   4, zIndex: 6 },
  sandwich:       { w: 58, h: 52, x: -10, y:  42, scale: 0.90, rotate: -12, zIndex: 7 },
};

// ── Fallback emoji slots (non-SVG foods) ──────────────────────────────────────
const EMOJI_SLOTS = [
  { x:  0,   y:  0,  r: -6 },
  { x: -14,  y: -13, r:  8 },
  { x:  14,  y: -13, r: -5 },
  { x: -13,  y:  13, r:  6 },
  { x:  13,  y:  13, r: -9 },
  { x:   0,  y: -20, r:  4 },
];

// ── Deterministic confetti ─────────────────────────────────────────────────────
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

// ── Component ──────────────────────────────────────────────────────────────────

interface CircularProgressProps {
  current: number;
  goal: number;
  stackLayers: StackLayer[];
  isAnyDragging?: boolean;
  isDragOverPlate?: boolean;
  className?: string;
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

    // Dash offset: CIRC = empty, 0 = full
    const dashOffset = CIRC * (1 - pct);

    // Build unique plate items — SVG-layout foods first, emoji fallback for rest
    const plateItems: Array<{ foodId: string; svgPath?: string; emoji: string; index: number }> = [];
    const seen = new Set<string>();
    for (const layer of [...stackLayers].reverse()) {
      if (!seen.has(layer.foodId)) {
        seen.add(layer.foodId);
        plateItems.push({ foodId: layer.foodId, svgPath: layer.svgPath, emoji: layer.emoji, index: plateItems.length });
        if (plateItems.length >= 6) break;
      }
    }

    return (
      <div className={cn("flex flex-col items-center", className)}>

        {/* ── Outer container ── */}
        <div
          className="relative flex items-center justify-center"
          style={{ width: SVG_SIZE, height: SVG_SIZE }}
        >

          {/* ── SVG ring (viewBox matches Circle path.svg exactly) ── */}
          <motion.svg
            width={SVG_SIZE}
            height={SVG_SIZE}
            viewBox={`0 0 ${VB} ${VB}`}
            className="absolute inset-0 overflow-visible"
            style={{ zIndex: 1 }}
            animate={
              isAnyDragging
                ? { scale: [1, 1.025, 1] }
                : { scale: 1 }
            }
            transition={
              isAnyDragging
                ? { repeat: Infinity, duration: 1.3, ease: "easeInOut" }
                : {}
            }
          >
            {/* Grey track — full 360°, matches Circle path.svg geometry */}
            <circle
              cx={CX} cy={CY} r={MID_R}
              fill="none"
              stroke="#E4E4E4"
              strokeWidth={RING_W}
            />
            {/* Subtle white edge borders (as in Circle path.svg stroke="white") */}
            <circle cx={CX} cy={CY} r={OUTER_R - 0.8} fill="none" stroke="white" strokeWidth="1.6" />
            <circle cx={CX} cy={CY} r={INNER_R + 0.8} fill="none" stroke="white" strokeWidth="1.6" />

            {/* Animated progress arc — sweeps 0 → 360° clockwise from top */}
            {pct > 0 && (
              <motion.circle
                cx={CX} cy={CY} r={MID_R}
                fill="none"
                strokeWidth={RING_W}
                strokeLinecap="round"
                strokeDasharray={CIRC}
                initial={{ strokeDashoffset: CIRC, stroke: "#A0A0A0" }}
                animate={{ strokeDashoffset: dashOffset, stroke: arcColor }}
                transition={{
                  strokeDashoffset: { type: "spring", stiffness: 160, damping: 26 },
                  stroke:           { duration: 0.45, ease: "easeInOut" },
                }}
                transform={`rotate(-90 ${CX} ${CY})`}
              />
            )}
          </motion.svg>

          {/* Drop-zone glow ring */}
          <AnimatePresence>
            {isDragOverPlate && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  boxShadow:
                    "0 0 0 3px rgba(76,175,80,0.35), 0 0 28px 10px rgba(76,175,80,0.18)",
                  zIndex: 3,
                }}
              />
            )}
          </AnimatePresence>

          {/* ── Plate — centered inside ring, ref = drop zone ── */}
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

            {/* Food items on plate */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ pointerEvents: "none" }}
            >
              <AnimatePresence>
                {plateItems.map((item) => {
                  const layout = PLATE_LAYOUTS[item.foodId];
                  if (item.svgPath && layout) {
                    return (
                      <motion.img
                        key={item.foodId}
                        src={item.svgPath}
                        alt={item.foodId}
                        draggable={false}
                        initial={{ scale: 0, opacity: 0, x: layout.x, y: layout.y, rotate: layout.rotate }}
                        animate={{ scale: layout.scale, opacity: 1, x: layout.x, y: layout.y, rotate: layout.rotate }}
                        exit={{    scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 220, damping: 20 }}
                        style={{
                          position:    "absolute",
                          top:         "50%",
                          left:        "50%",
                          width:       layout.w,
                          height:      layout.h,
                          marginLeft:  -layout.w / 2,
                          marginTop:   -layout.h / 2,
                          zIndex:      layout.zIndex,
                          userSelect:  "none",
                        }}
                      />
                    );
                  }
                  // Fallback: emoji at slot position
                  const slot = EMOJI_SLOTS[item.index] ?? EMOJI_SLOTS[0];
                  return (
                    <motion.span
                      key={item.foodId}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1, x: slot.x, y: slot.y, rotate: slot.r }}
                      exit={{    scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 22 }}
                      className="absolute text-[15px] leading-none select-none"
                      style={{ zIndex: item.index + 1 }}
                    >
                      {item.emoji}
                    </motion.span>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Confetti */}
          <AnimatePresence>
            {isGoalReached && <ConfettiBurst key="confetti" />}
          </AnimatePresence>
        </div>

      </div>
    );
  }
);
