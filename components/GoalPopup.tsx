"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CALORIE_GOAL } from "@/lib/data";

// Deterministic confetti for the popup
const CONFETTI = [
  { id: 0, color: "#4CAF50", tx:  52, ty: -52 },
  { id: 1, color: "#FFC107", tx:  70, ty: -16 },
  { id: 2, color: "#FF7043", tx:  48, ty:  48 },
  { id: 3, color: "#64B5F6", tx:   6, ty:  68 },
  { id: 4, color: "#4CAF50", tx: -48, ty:  48 },
  { id: 5, color: "#FFC107", tx: -70, ty: -16 },
  { id: 6, color: "#FF7043", tx: -52, ty: -52 },
  { id: 7, color: "#64B5F6", tx:  -6, ty: -68 },
  { id: 8, color: "#4CAF50", tx:  28, ty: -64 },
  { id: 9, color: "#FFC107", tx: -28, ty: -64 },
];

interface GoalPopupProps {
  onReset: () => void;
}

export function GoalPopup({ onReset }: GoalPopupProps) {
  const [showTrackBtn, setShowTrackBtn] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => setShowTrackBtn(true), 2600);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const handleDismiss = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setShowTrackBtn(true);
  };

  return (
    // Backdrop
    <motion.div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex: 1000, background: "rgba(0,0,0,0.22)", backdropFilter: "blur(10px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
    >
      {/* Card */}
      <motion.div
        className="relative flex flex-col items-center"
        style={{
          width: 312,
          background: "#F8F8F8",
          border: "1.5px solid rgba(255,255,255,0.9)",
          borderRadius: 28,
          boxShadow: "0px 32px 72px rgba(0,0,0,0.18), 0px 4px 16px rgba(0,0,0,0.08)",
          padding: "36px 28px 28px",
          overflow: "visible",
        }}
        initial={{ scale: 0.78, opacity: 0, y: 24 }}
        animate={{ scale: 1,    opacity: 1, y: 0  }}
        exit={{    scale: 0.84, opacity: 0, y: 16 }}
        transition={{ type: "spring", stiffness: 440, damping: 30 }}
      >
        {/* Confetti burst */}
        {CONFETTI.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 8, height: 8,
              background: p.color,
              top: "50%", left: "50%",
              marginLeft: -4, marginTop: -4,
            }}
            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            animate={{ x: p.tx, y: p.ty, scale: 0, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: p.id * 0.04 }}
          />
        ))}

        {/* Close button */}
        <motion.button
          onClick={handleDismiss}
          whileHover={{ backgroundColor: "#E4E4E4" }}
          whileTap={{ scale: 0.88 }}
          transition={{ type: "spring", stiffness: 500, damping: 22 }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: "#EFEFEF", color: "#8A8A8A", fontSize: 13, fontWeight: 600 }}
          aria-label="Dismiss"
        >
          ✕
        </motion.button>

        {/* Celebration emoji */}
        <motion.div
          className="text-[52px] leading-none mb-4 select-none"
          animate={{ rotate: [0, -8, 8, -6, 6, 0], scale: [1, 1.12, 1] }}
          transition={{ duration: 0.7, ease: "easeInOut", delay: 0.15 }}
        >
          🎉
        </motion.div>

        {/* Title */}
        <div
          className="text-[18px] font-bold text-center leading-tight mb-1.5"
          style={{ color: "#1A1A1A" }}
        >
          Calorie Goal Reached!
        </div>

        {/* Subtitle */}
        <div
          className="text-[13px] text-center leading-relaxed mb-5"
          style={{ color: "#8A8A8A" }}
        >
          You've hit your {CALORIE_GOAL.toLocaleString()} cal<br />daily target. Great job! 💪
        </div>

        {/* Track Calories CTA — slides in after delay or X press */}
        <div style={{ width: "100%", minHeight: 48 }}>
          <AnimatePresence>
            {showTrackBtn && (
              <motion.button
                onClick={onReset}
                initial={{ opacity: 0, y: 14, scale: 0.92 }}
                animate={{ opacity: 1, y: 0,  scale: 1    }}
                exit={{    opacity: 0, y: 10, scale: 0.92 }}
                transition={{ type: "spring", stiffness: 420, damping: 26 }}
                whileHover={{ scale: 1.02, boxShadow: "0px 8px 24px rgba(0,0,0,0.22)" }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3.5 rounded-[20px] font-semibold text-sm text-white select-none"
                style={{
                  background: "#1A1A1A",
                  boxShadow: "0px 4px 16px rgba(0,0,0,0.14)",
                  cursor: "pointer",
                }}
              >
                Track Calories
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
