"use client";

import { motion } from "motion/react";
import type { StackLayer as StackLayerData } from "@/lib/types";

// How many px each older card peeks out below the one above it.
export const STACK_STEP = 14;
// Approximate rendered height of one card (used to size the container).
export const CARD_H = 56;

interface StackLayerProps {
  layer: StackLayerData;
  stackIdx: number; // 0 = oldest / bottom  •  n-1 = newest / top
  total: number;
}

export function StackLayer({ layer, stackIdx, total }: StackLayerProps) {
  // Newest at top=0; each older item is STACK_STEP px lower.
  const topPx  = (total - 1 - stackIdx) * STACK_STEP;
  const zIndex = stackIdx + 1;

  // Gentle alternating X sway to give physical depth.
  const swayX  = stackIdx % 2 === 0 ? stackIdx * 2.5 : -(stackIdx * 2.5);

  // Shadow deepens for lower (older) layers.
  const shadow = `0px ${4 + stackIdx * 2}px ${10 + stackIdx * 4}px rgba(0,0,0,${0.06 + stackIdx * 0.015})`;

  return (
    <motion.div
      initial={{ opacity: 0, y: -32, scale: 0.9 }}
      animate={{ opacity: 1, y: 0,   scale: 1    }}
      exit={{    opacity: 0, y:  18, scale: 0.88,
                 transition: { duration: 0.18, ease: "easeIn" } }}
      transition={{ type: "spring", stiffness: 360, damping: 17 }}
      style={{
        position: "absolute",
        left: 0, right: 0,
        top: topPx,
        zIndex,
      }}
    >
      <motion.div
        className="flex items-center gap-3 rounded-[18px] px-4 py-3"
        style={{
          background:  layer.color,
          border:      "1.5px solid rgba(255,255,255,0.9)",
          boxShadow:   shadow,
          x:           swayX,
        }}
        whileHover={{ y: -5, scale: 1.018 }}
        transition={{ type: "spring", stiffness: 340, damping: 19 }}
      >
        <span className="text-2xl select-none leading-none">{layer.emoji}</span>

        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold leading-tight truncate" style={{ color: "#1A1A1A" }}>
            {layer.name}
          </div>
        </div>

        {/* Calorie chip */}
        <div
          className="shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full"
          style={{ background: "rgba(255,255,255,0.7)", color: "#8A8A8A" }}
        >
          {layer.calories} Cal
        </div>
      </motion.div>
    </motion.div>
  );
}
