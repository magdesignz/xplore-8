"use client";

import { AnimatePresence } from "motion/react";
import { StackLayer, CARD_H, STEP_Y } from "./StackLayer";
import type { StackLayer as StackLayerData } from "@/lib/types";

interface StackAreaProps {
  stackLayers: StackLayerData[];
}

const MAX_VISIBLE = 4;

export function StackArea({ stackLayers }: StackAreaProps) {
  // Keep only the most-recently added MAX_VISIBLE items; newest = last in array
  const visible = stackLayers.slice(-MAX_VISIBLE);
  const count   = visible.length;

  // Container grows to fit the tower; overflow:visible keeps peek edges visible
  const containerH = count > 0 ? CARD_H + (count - 1) * STEP_Y : 0;

  return (
    <div
      className="relative w-full"
      style={{ height: containerH, overflow: "visible" }}
    >
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
