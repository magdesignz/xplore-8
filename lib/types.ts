export type MealCategory = "Breakfast" | "Lunch" | "Dinner" | "Snack";

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  emoji: string;
  color: string; // pastel card background
  svgPath?: string;
}

export interface StackLayer {
  instanceId: string; // unique per addition — foodId + counter
  foodId: string;
  name: string;
  calories: number;
  emoji: string;
  color: string;
  svgPath?: string;
}
