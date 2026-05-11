"use client";

import { motion, AnimatePresence } from "motion/react";
import { StackLayer, CARD_H, STACK_STEP } from "./StackLayer";
import type { StackLayer as StackLayerData } from "@/lib/types";

interface StackAreaProps {
  stackLayers: StackLayerData[];
}

export function StackArea({ stackLayers }: StackAreaProps) {
  const count      = stackLayers.length;
  // Container height that exactly fits the tower:
  // newest at top=0, oldest at top=(count-1)*STEP, height=CARD_H
  const towerHeight = count > 0 ? CARD_H + (count - 1) * STACK_STEP : 0;

  return (
    <div className="relative" style={{ minHeight: 58 }}>

      {/* ── Empty state ── */}
      <AnimatePresence>
        {count === 0 && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{    opacity: 0, transition: { duration: 0.15 } }}
            transition={{ duration: 0.22 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none select-none"
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
              className="text-4xl"
            >
              🍽️
            </motion.div>
            <div className="text-sm font-medium tracking-wide" style={{ color: "#C8C8C8" }}>
              Total Food Plate Stack
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Tower ── */}
      {/* Outer anchor sits at the bottom of the area; inner div grows upward. */}
      <div className="absolute bottom-0 left-0 right-0">
        <motion.div
          className="relative w-full"
          animate={{ height: towerHeight + 10 }}
          initial={{ height: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 26 }}
        >
          <AnimatePresence>
            {stackLayers.map((layer, idx) => (
              <StackLayer
                key={layer.instanceId}
                layer={layer}
                stackIdx={idx}
                total={count}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Subtle plate shadow beneath the tower */}
        <AnimatePresence>
          {count > 0 && (
            <motion.div
              initial={{ opacity: 0, scaleX: 0.5 }}
              animate={{ opacity: 1, scaleX: 1   }}
              exit={{    opacity: 0, scaleX: 0.5  }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="mx-8 mt-1"
              style={{
                height: 4,
                borderRadius: 99,
                background: "rgba(0,0,0,0.05)",
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
