"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "motion/react";
import type { FoodItem } from "@/lib/types";

interface FoodCardProps {
  food:         FoodItem;
  count:        number;
  onAdd:        () => void;
  onRemove:     () => void;
  goalReached?: boolean;
  plateRef?:    React.RefObject<HTMLDivElement | null>;
  onDragStart?: () => void;
  onDragEnd?:   () => void;
  onDragMove?:  (point: { x: number; y: number }) => void;
  onDragOverPlate?: (isOver: boolean) => void;
}

// Stable per-food rotation for the drag ghost (deterministic, not random)
function dragRotation(food: FoodItem) {
  const code = food.id.charCodeAt(0) + food.id.charCodeAt(food.id.length - 1);
  return ((code % 11) - 5) * 3; // –15° to +15°
}

export function FoodCard({
  food, count, onAdd, onRemove,
  goalReached = false,
  plateRef, onDragStart, onDragEnd, onDragMove, onDragOverPlate,
}: FoodCardProps) {
  const [minusBurst, setMinusBurst] = useState(false);
  const [isDragging,  setIsDragging]  = useState(false);
  const emojiControls = useAnimation();
  const rot = dragRotation(food);

  /* ── +/- button handlers ── */
  const handleAdd = () => {
    if (goalReached) return;
    onAdd();
  };

  const handleRemove = () => {
    if (count === 0) return;
    setMinusBurst(true);
    setTimeout(() => setMinusBurst(false), 140);
    onRemove();
  };

  /* ── Drag handlers ── */
  const handleDragStart = () => {
    setIsDragging(true);
    onDragStart?.();
  };

  const handleDrag = (_: unknown, info: { point: { x: number; y: number } }) => {
    onDragMove?.(info.point);
    if (!plateRef?.current) return;
    const r = plateRef.current.getBoundingClientRect();
    const over =
      info.point.x >= r.left && info.point.x <= r.right &&
      info.point.y >= r.top  && info.point.y <= r.bottom;
    onDragOverPlate?.(over);
  };

  const handleDragEnd = async (
    _: unknown,
    info: { point: { x: number; y: number } }
  ) => {
    setIsDragging(false);
    onDragEnd?.();
    onDragOverPlate?.(false);

    if (plateRef?.current) {
      const r = plateRef.current.getBoundingClientRect();
      const dropped =
        info.point.x >= r.left && info.point.x <= r.right &&
        info.point.y >= r.top  && info.point.y <= r.bottom;

      if (dropped && !goalReached) {
        // Pulse then shrink into plate, then reset
        await emojiControls.start({ scale: 1.5, transition: { duration: 0.1 } });
        await emojiControls.start({ scale: 0, opacity: 0, transition: { duration: 0.15 } });
        emojiControls.set({ x: 0, y: 0, scale: 1, opacity: 1 });
        onAdd();
        return;
      }
    }

    // Not on plate — spring back
    emojiControls.start({
      x: 0, y: 0,
      transition: { type: "spring", stiffness: 500, damping: 30 },
    });
  };

  return (
    <motion.div
      className="w-full rounded-[20px] px-4 py-3 flex items-center gap-3"
      style={{
        background: "#F8F8F8",
        border:     "1.5px solid #FFFFFF",
        boxShadow:  "0px 4px 12px rgba(0,0,0,0.055)",
        cursor:     "default",
      }}
      whileHover={{ y: -3, boxShadow: "0px 8px 22px rgba(0,0,0,0.09)" }}
      transition={{ type: "spring", stiffness: 320, damping: 20 }}
    >
      {/* ── Draggable emoji (invisible while dragging — parent renders ghost) ── */}
      <motion.span
        drag
        dragMomentum={false}
        dragElastic={0.08}
        animate={emojiControls}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        className="text-xl select-none leading-none shrink-0"
        style={{
          cursor:      isDragging ? "grabbing" : "grab",
          touchAction: "none",
          opacity:     isDragging ? 0 : 1,
          position:    "relative",
        }}
      >
        {food.emoji}
      </motion.span>

      {/* ── Name + cals ── */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold truncate leading-tight" style={{ color: "#1A1A1A" }}>
          {food.name}
        </div>
        <div className="text-xs font-medium mt-0.5" style={{ color: "#8A8A8A" }}>
          {food.calories} Cal
        </div>
      </div>

      {/* ── Controls ── */}
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

        {/* Count */}
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
