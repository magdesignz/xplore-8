"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { FoodItem } from "@/lib/types";

interface FoodCardProps {
  food: FoodItem;
  count: number;
  onAdd: () => void;
  onRemove: () => void;
  goalReached?: boolean;
}

export function FoodCard({ food, count, onAdd, onRemove, goalReached = false }: FoodCardProps) {
  const [plusBurst,  setPlusBurst]  = useState(false);
  const [minusBurst, setMinusBurst] = useState(false);

  const handleAdd = () => {
    if (goalReached) return;
    setPlusBurst(true);
    setTimeout(() => setPlusBurst(false), 140);
    onAdd();
  };

  const handleRemove = () => {
    if (count === 0) return;
    setMinusBurst(true);
    setTimeout(() => setMinusBurst(false), 140);
    onRemove();
  };

  return (
    <motion.div
      className="w-full rounded-[20px] px-4 py-3 flex items-center gap-3"
      style={{
        background:  "#F8F8F8",
        border:      "1.5px solid #FFFFFF",
        boxShadow:   "0px 4px 12px rgba(0,0,0,0.055)",
        cursor:      "default",
      }}
      whileHover={{ y: -3, boxShadow: "0px 8px 22px rgba(0,0,0,0.09)" }}
      transition={{ type: "spring", stiffness: 320, damping: 20 }}
    >
      {/* Emoji */}
      <span className="text-xl select-none leading-none shrink-0">{food.emoji}</span>

      {/* Name + cals */}
      <div className="flex-1 min-w-0">
        <div
          className="text-sm font-semibold truncate leading-tight"
          style={{ color: "#1A1A1A" }}
        >
          {food.name}
        </div>
        <div className="text-xs font-medium mt-0.5" style={{ color: "#8A8A8A" }}>
          {food.calories} Cal
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 shrink-0">

        {/* Minus */}
        <motion.button
          onClick={handleRemove}
          animate={{ scale: minusBurst ? 0.76 : 1 }}
          whileHover={count > 0 ? { backgroundColor: "#FFE5E5" } : {}}
          transition={{ type: "spring", stiffness: 520, damping: 17 }}
          className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold select-none"
          style={{
            backgroundColor: "#EFEFEF",
            color:  count > 0 ? "#8A8A8A" : "#CCCCCC",
            cursor: count > 0 ? "pointer" : "not-allowed",
            lineHeight: 1,
          }}
          aria-label={`Remove ${food.name}`}
        >
          −
        </motion.button>

        {/* Count — flips vertically on change */}
        <AnimatePresence mode="popLayout">
          <motion.span
            key={count}
            initial={{ opacity: 0, y: -7, scale: 0.75 }}
            animate={{ opacity: 1, y:  0, scale: 1     }}
            exit={{    opacity: 0, y:  7, scale: 0.75  }}
            transition={{ type: "spring", stiffness: 420, damping: 20 }}
            className="w-4 text-center text-sm font-bold tabular-nums select-none"
            style={{ color: count > 0 ? "#1A1A1A" : "#CCCCCC" }}
          >
            {count}
          </motion.span>
        </AnimatePresence>

        {/* Plus */}
        <motion.button
          onClick={handleAdd}
          animate={{ scale: plusBurst ? 0.76 : 1 }}
          whileHover={!goalReached ? { backgroundColor: "#E3F7E8" } : {}}
          transition={{ type: "spring", stiffness: 520, damping: 17 }}
          className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold select-none"
          style={{
            backgroundColor: "#EFEFEF",
            color:  goalReached ? "#CCCCCC" : "#4CAF50",
            cursor: goalReached ? "not-allowed" : "pointer",
            lineHeight: 1,
          }}
          aria-label={`Add ${food.name}`}
          aria-disabled={goalReached}
        >
          +
        </motion.button>
      </div>
    </motion.div>
  );
}
