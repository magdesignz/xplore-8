"use client";

import { motion } from "motion/react";
import { MEALS, MEAL_ICONS } from "@/lib/data";
import type { MealCategory } from "@/lib/types";

interface MealTabsProps {
  activeMeal: MealCategory;
  onMealChange: (meal: MealCategory) => void;
}

export function MealTabs({ activeMeal, onMealChange }: MealTabsProps) {
  return (
    <motion.nav
      className="flex items-center gap-0.5 rounded-full p-1.5"
      style={{
        background:  "#F0F0F0",
        border:      "1.5px solid #FFFFFF",
        boxShadow:   "0px 4px 14px rgba(0,0,0,0.07)",
      }}
      initial={{ opacity: 0, y: -22 }}
      animate={{ opacity: 1, y: 0   }}
      transition={{ type: "spring", stiffness: 260, damping: 24, delay: 0.04 }}
    >
      {MEALS.map((meal) => {
        const isActive = activeMeal === meal;
        return (
          <motion.button
            key={meal}
            onClick={() => onMealChange(meal)}
            className="relative px-4 py-2 rounded-full text-sm font-medium select-none cursor-pointer"
            style={{ color: isActive ? "#1A1A1A" : "#8A8A8A", zIndex: 1 }}
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 340, damping: 20 }}
          >
            {/* Shared-layout active pill — slides between tabs */}
            {isActive && (
              <motion.span
                layoutId="meal-active-pill"
                className="absolute inset-0 rounded-full"
                style={{
                  background: "#FFFFFF",
                  boxShadow:  "0px 2px 8px rgba(0,0,0,0.09)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 26 }}
              />
            )}

            <span className="relative flex items-center gap-1.5">
              <span className="text-base leading-none">{MEAL_ICONS[meal]}</span>
              <span>{meal}</span>
            </span>
          </motion.button>
        );
      })}
    </motion.nav>
  );
}
