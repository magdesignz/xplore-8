"use client";

import { motion } from "motion/react";
import type { StackLayer as StackLayerData } from "@/lib/types";

export const CARD_H    = 44;
export const STEP_Y    = 6;   // px each card shifts down from the one above
export const STEP_SCALE   = 0.02; // scale reduction per depth level
export const STEP_OPACITY = 0.1;  // opacity reduction per depth level
export const MIN_OPACITY  = 0.45;

interface StackLayerProps {
  layer: StackLayerData;
  depth: number;     // 0 = newest / top of stack
  totalVisible: number;
}

export function StackLayer({ layer, depth, totalVisible }: StackLayerProps) {
  const topPx   = depth * STEP_Y;
  const scale   = 1 - depth * STEP_SCALE;
  const opacity = Math.max(MIN_OPACITY, 1 - depth * STEP_OPACITY);
  const zIndex  = totalVisible - depth;

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: -20, scale: 0.88 }}
      animate={{ opacity, scale, top: topPx, y: 0 }}
      exit={{    opacity: 0, y: 10,  scale: 0.88,
                 transition: { duration: 0.14, ease: "easeIn" } }}
      transition={{ type: "spring", stiffness: 360, damping: 24 }}
      style={{ position: "absolute", left: 0, right: 0, zIndex }}
    >
      <div
        className="flex items-center gap-2.5 rounded-[14px] px-3 py-2"
        style={{
          background:  layer.color,
          border:      "1.5px solid rgba(255,255,255,0.9)",
          boxShadow:   `0px ${2 + depth * 1}px ${6 + depth * 2}px rgba(0,0,0,${(0.05 + depth * 0.012).toFixed(3)})`,
          height:      CARD_H,
        }}
      >
        {layer.svgPath ? (
          <img
            src={layer.svgPath}
            alt={layer.name}
            draggable={false}
            style={{ width: 24, height: 24, objectFit: "contain", flexShrink: 0, userSelect: "none" }}
          />
        ) : (
          <span className="text-lg select-none leading-none shrink-0">{layer.emoji}</span>
        )}

        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-semibold leading-tight truncate" style={{ color: "#1A1A1A" }}>
            {layer.name}
          </div>
        </div>

        <div
          className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{ background: "rgba(255,255,255,0.7)", color: "#8A8A8A" }}
        >
          {layer.calories} Cal
        </div>
      </div>
    </motion.div>
  );
}
