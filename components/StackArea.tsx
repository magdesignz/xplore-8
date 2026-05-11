"use client";

import { motion, AnimatePresence } from "motion/react";
import { StackLayer, CARD_H, STEP_Y } from "./StackLayer";
import type { StackLayer as StackLayerData } from "@/lib/types";

interface StackAreaProps {
  stackLayers: StackLayerData[];
}

const MAX_VISIBLE = 5;

export function StackArea({ stackLayers }: StackAreaProps) {
  // Keep only the most-recently added MAX_VISIBLE items; newest = last in array
  const visible = stackLayers.slice(-MAX_VISIBLE);
  const count   = visible.length;

  // Container grows to fit the tower; overflow:visible keeps peek edges visible
  const containerH = count > 0 ? CARD_H + (count - 1) * STEP_Y : 56;

  return (
    <div
      className="relative w-full"
      style={{ height: containerH, overflow: "visible" }}
    >
      {/* ── Empty state ── */}
      <AnimatePresence>
        {count === 0 && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{    opacity: 0, transition: { duration: 0.12 } }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none select-none"
          >
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="text-2xl"
            >
              🍽️
            </motion.div>
            <div className="text-[11px] font-medium tracking-wide" style={{ color: "#C8C8C8" }}>
              Drag food to the plate
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Apple Wallet stack — newest on top (depth 0) ── */}
      <AnimatePresence>
        {visible.map((layer, i) => {
          // i=0 oldest visible · i=count-1 newest visible
          const depth = count - 1 - i;
          return (
            <StackLayer
              key={layer.instanceId}
              layer={layer}
              depth={depth}
              totalVisible={count}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}
