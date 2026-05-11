"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useAnimation,
  useSpring,
  useTransform,
} from "motion/react";

import { MealTabs }          from "./MealTabs";
import { FoodCard }          from "./FoodCard";
import { StackArea }         from "./StackArea";
import { CircularProgress }  from "./CircularProgress";

import { CALORIE_GOAL, MEAL_FOODS } from "@/lib/data";
import type { MealCategory, FoodItem, StackLayer } from "@/lib/types";

// ─── Animated rolling counter ────────────────────────────────────────────────

function AnimatedNumber({ value }: { value: number }) {
  const spring  = useSpring(value, { stiffness: 260, damping: 22 });
  const display = useTransform(spring, (v: number) => Math.round(v).toString());

  useEffect(() => { spring.set(value); }, [value, spring]);

  return <motion.span>{display}</motion.span>;
}

// ─── Root experience ─────────────────────────────────────────────────────────

export default function CalorieStackExperience() {
  // ── Mount guard ──────────────────────────────────────────────────────────
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // ── Core state ───────────────────────────────────────────────────────────
  const [activeMeal,   setActiveMeal]   = useState<MealCategory>("Breakfast");
  const [stackLayers,  setStackLayers]  = useState<StackLayer[]>([]);
  const [foodCounts,   setFoodCounts]   = useState<Record<string, number>>({});
  const counterRef = useRef(0);

  // ── Drag state ───────────────────────────────────────────────────────────
  const [isAnyDragging,   setIsAnyDragging]   = useState(false);
  const [isDragOverPlate, setIsDragOverPlate] = useState(false);
  const [draggingFood,    setDraggingFood]    = useState<FoodItem | null>(null);
  const [dragPos,         setDragPos]         = useState({ x: 0, y: 0 });

  // ── Plate ref (forwarded into CircularProgress) ──────────────────────────
  const plateRef = useRef<HTMLDivElement>(null);

  // ── Calorie / goal ───────────────────────────────────────────────────────
  const bounceControls = useAnimation();
  const prevGoalRef    = useRef(false);

  const totalCalories = stackLayers.reduce((sum, l) => sum + l.calories, 0);
  const isGoalReached = totalCalories >= CALORIE_GOAL;

  useEffect(() => {
    if (isGoalReached && !prevGoalRef.current) {
      bounceControls.start({
        scale: [1, 1.09, 0.95, 1.05, 1],
        transition: { duration: 0.6, ease: "easeInOut" },
      });
    }
    prevGoalRef.current = isGoalReached;
  }, [isGoalReached, bounceControls]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleMealChange = useCallback(
    (meal: MealCategory) => {
      if (meal === activeMeal) return;
      setActiveMeal(meal);
      setStackLayers([]);
      setFoodCounts({});
    },
    [activeMeal]
  );

  const handleAdd = useCallback(
    (food: FoodItem) => {
      if (totalCalories >= CALORIE_GOAL) return;
      counterRef.current += 1;
      const instanceId = `${food.id}-${counterRef.current}`;
      setStackLayers((prev) => [
        ...prev,
        { instanceId, foodId: food.id, name: food.name, calories: food.calories, emoji: food.emoji, color: food.color },
      ]);
      setFoodCounts((prev) => ({ ...prev, [food.id]: (prev[food.id] || 0) + 1 }));
    },
    [totalCalories]
  );

  const handleRemove = useCallback((food: FoodItem) => {
    setStackLayers((prev) => {
      const ri = [...prev].reverse().findIndex((l) => l.foodId === food.id);
      if (ri === -1) return prev;
      return prev.filter((_, i) => i !== prev.length - 1 - ri);
    });
    setFoodCounts((prev) => ({
      ...prev,
      [food.id]: Math.max(0, (prev[food.id] || 0) - 1),
    }));
  }, []);

  const currentFoods = MEAL_FOODS[activeMeal];

  // ── SSR shell ─────────────────────────────────────────────────────────────
  if (!mounted) {
    return <div className="min-h-screen w-full" style={{ background: "#EDEDED" }} />;
  }

  // ── Full UI ───────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center relative"
      style={{ background: "#EDEDED", overflowX: "hidden" }}
    >
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "120px 120px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-[920px] px-6 py-10">

        {/* ─── Meal selector ─── */}
        <MealTabs activeMeal={activeMeal} onMealChange={handleMealChange} />

        {/* ─── Main row ─── */}
        <div className="flex gap-6 w-full items-center">

          {/* ── LEFT: calorie card ── */}
          <motion.div
            className="flex flex-col rounded-[24px]"
            style={{
              width:      314,
              minWidth:   314,
              background: "#F8F8F8",
              border:     "1.5px solid #FFFFFF",
              boxShadow:  "0px 4px 16px rgba(0,0,0,0.07)",
            }}
            initial={{ opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0   }}
            transition={{ type: "spring", stiffness: 260, damping: 24, delay: 0.1 }}
          >
            {/* Card header */}
            <div className="px-4 pt-4 pb-2 flex flex-col gap-2">

              {/* Calorie row — "1230 / 2200" */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium" style={{ color: "#8A8A8A" }}>
                  Daily Calories
                </span>

                <motion.div
                  animate={bounceControls}
                  className="flex items-baseline gap-1 tabular-nums"
                >
                  <span className="text-[20px] font-bold leading-none" style={{ color: "#1A1A1A" }}>
                    <AnimatedNumber value={totalCalories} />
                  </span>
                  <span className="text-xs font-medium" style={{ color: "#8A8A8A" }}>
                    / {CALORIE_GOAL}
                  </span>
                </motion.div>
              </div>

              {/* Circular progress + plate */}
              <div className="flex justify-center">
                <CircularProgress
                  ref={plateRef}
                  current={totalCalories}
                  goal={CALORIE_GOAL}
                  stackLayers={stackLayers}
                  isAnyDragging={isAnyDragging}
                  isDragOverPlate={isDragOverPlate}
                />
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "#EFEFEF", margin: "0 16px" }} />

            {/* Stack area — fixed 74 px from divider to card bottom */}
            <div className="px-4 py-1" style={{ height: 74, overflow: "visible" }}>
              <StackArea stackLayers={stackLayers} />
            </div>
          </motion.div>

          {/* ── RIGHT: food selection ── */}
          <div className="flex flex-col gap-3" style={{ width: 290, minWidth: 290 }}>

            {/* Meal label */}
            <motion.div
              key={`label-${activeMeal}`}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0  }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="px-1"
            >
              <div className="text-base font-semibold" style={{ color: "#1A1A1A" }}>
                {activeMeal}
              </div>
              <div className="text-xs mt-0.5" style={{ color: "#8A8A8A" }}>
                Tap + to add items to your plate
              </div>
            </motion.div>

            {/* Food cards */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`cards-${activeMeal}`}
                className="flex flex-col gap-3"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0  }}
                exit={{    opacity: 0, y: -10 }}
                transition={{ type: "spring", stiffness: 280, damping: 24 }}
              >
                {currentFoods.map((food, i) => (
                  <motion.div
                    key={food.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0  }}
                    transition={{ type: "spring", stiffness: 280, damping: 22, delay: i * 0.06 }}
                  >
                    <FoodCard
                      food={food}
                      count={foodCounts[food.id] || 0}
                      onAdd={()    => handleAdd(food)}
                      onRemove={() => handleRemove(food)}
                      goalReached={isGoalReached}
                      plateRef={plateRef}
                      onDragStart={() => { setIsAnyDragging(true); setDraggingFood(food); }}
                      onDragEnd={()   => { setIsAnyDragging(false); setDraggingFood(null); }}
                      onDragMove={(pt) => setDragPos(pt)}
                      onDragOverPlate={setIsDragOverPlate}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

          </div>
        </div>
      </div>

      {/* ── Fixed-position drag ghost — renders above ALL stacking contexts ── */}
      <AnimatePresence>
        {draggingFood && (
          <motion.div
            key="drag-ghost"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1,   opacity: 1 }}
            exit={{    scale: 0.4, opacity: 0, transition: { duration: 0.12 } }}
            transition={{
              scale:   { type: "spring", stiffness: 650, damping: 12 },
              opacity: { duration: 0.06 },
            }}
            className="pointer-events-none fixed flex items-center justify-center select-none"
            style={{
              width:  170,
              height: 170,
              left:   dragPos.x - 85,
              top:    dragPos.y - 85,
              zIndex: 99999,
              fontSize: 110,
              filter: isDragOverPlate
                ? "drop-shadow(0px 0px 14px rgba(76,175,80,0.6))"
                : "drop-shadow(0px 8px 18px rgba(0,0,0,0.28))",
              rotate: `${((draggingFood.id.charCodeAt(0) + draggingFood.id.charCodeAt(draggingFood.id.length - 1)) % 11 - 5) * 3}deg`,
            }}
          >
            {draggingFood.emoji}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
