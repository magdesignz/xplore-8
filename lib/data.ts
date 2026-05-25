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
    { id: "salad",         name: "Garden Salad",    calories: 410, emoji: "🥗", color: "#E8F5E9", svgPath: "/foods/salad.svg"    },
    { id: "chicken-bowl",  name: "Chicken Bowl",    calories: 540, emoji: "🍗", color: "#FFF8E1", svgPath: "/foods/chicken.svg"  },
    { id: "sandwich",      name: "Turkey Sandwich", calories: 480, emoji: "🥪", color: "#FFF3E0", svgPath: "/foods/sandwich.svg" },
    { id: "pancake",       name: "Pancake",         calories: 450, emoji: "🥞", color: "#FCE4EC", svgPath: "/foods/pancake.svg"  },
  ],
  Lunch: [
    { id: "chicken-bowl",  name: "Chicken Bowl",    calories: 540, emoji: "🍗", color: "#FFF8E1", svgPath: "/foods/chicken.svg"  },
    { id: "salad",         name: "Garden Salad",    calories: 410, emoji: "🥗", color: "#E8F5E9", svgPath: "/foods/salad.svg"    },
    { id: "sandwich",      name: "Turkey Sandwich", calories: 480, emoji: "🥪", color: "#FFF3E0", svgPath: "/foods/sandwich.svg" },
    { id: "soup",          name: "Tomato Soup",     calories: 430, emoji: "🍲", color: "#FCE4EC" },
  ],
  Dinner: [
    { id: "salmon",        name: "Grilled Salmon",  calories: 460, emoji: "🐟", color: "#E3F2FD" },
    { id: "pasta",         name: "Pasta Primavera", calories: 520, emoji: "🍝", color: "#FFF3E0" },
    { id: "steak",         name: "Lean Steak",      calories: 550, emoji: "🥩", color: "#FCE4EC" },
    { id: "burger",        name: "Cheese Burger",   calories: 500, emoji: "🍔", color: "#FFF8E1" },
  ],
  Snack: [
    { id: "apple",         name: "Apple Slices",    calories: 420, emoji: "🍎", color: "#FCE4EC" },
    { id: "almonds",       name: "Mixed Almonds",   calories: 470, emoji: "🥜", color: "#FFF3E0" },
    { id: "yogurt",        name: "Greek Yogurt",    calories: 440, emoji: "🥛", color: "#E3F2FD" },
    { id: "protein-bar",   name: "Protein Bar",     calories: 510, emoji: "🍫", color: "#F3E5F5" },
  ],
};
