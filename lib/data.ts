import type { MealCategory, FoodItem } from "./types";

export const CALORIE_GOAL = 2200;

export const MEALS: MealCategory[] = ["Breakfast", "Lunch", "Dinner", "Snack"];

export const MEAL_ICONS: Record<MealCategory, string> = {
  Breakfast: "☀️",
  Lunch: "🌤️",
  Dinner: "🌙",
  Snack: "⚡",
};

export const MEAL_FOODS: Record<MealCategory, FoodItem[]> = {
  Breakfast: [
    { id: "salad",         name: "Garden Salad",    calories: 190, emoji: "🥗", color: "#E8F5E9" },
    { id: "chicken-bowl",  name: "Chicken Bowl",    calories: 520, emoji: "🍗", color: "#FFF8E1" },
    { id: "sandwich",      name: "Turkey Sandwich", calories: 380, emoji: "🥪", color: "#FFF3E0" },
    { id: "pancake",       name: "Pancake",         calories: 200, emoji: "🥞", color: "#FCE4EC" },
  ],
  Lunch: [
    { id: "chicken-bowl",  name: "Chicken Bowl",    calories: 520, emoji: "🍗", color: "#FFF8E1" },
    { id: "salad",         name: "Garden Salad",    calories: 190, emoji: "🥗", color: "#E8F5E9" },
    { id: "sandwich",      name: "Turkey Sandwich", calories: 380, emoji: "🥪", color: "#FFF3E0" },
    { id: "soup",          name: "Tomato Soup",     calories: 210, emoji: "🍲", color: "#FCE4EC" },
  ],
  Dinner: [
    { id: "salmon",        name: "Grilled Salmon",  calories: 480, emoji: "🐟", color: "#E3F2FD" },
    { id: "pasta",         name: "Pasta Primavera", calories: 560, emoji: "🍝", color: "#FFF3E0" },
    { id: "steak",         name: "Lean Steak",      calories: 620, emoji: "🥩", color: "#FCE4EC" },
    { id: "burger",        name: "Cheese Burger",   calories: 680, emoji: "🍔", color: "#FFF8E1" },
  ],
  Snack: [
    { id: "apple",         name: "Apple Slices",    calories:  95, emoji: "🍎", color: "#FCE4EC" },
    { id: "almonds",       name: "Mixed Almonds",   calories: 170, emoji: "🥜", color: "#FFF3E0" },
    { id: "yogurt",        name: "Greek Yogurt",    calories: 130, emoji: "🥛", color: "#E3F2FD" },
    { id: "protein-bar",   name: "Protein Bar",     calories: 210, emoji: "🍫", color: "#F3E5F5" },
  ],
};
