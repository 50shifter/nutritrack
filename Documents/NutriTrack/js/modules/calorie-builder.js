import { calculateBMR, calculateTDEE } from './bmi-calculator.js';
import { MACRO_RATIOS, GOAL_MULTIPLIERS } from '../constants/macros.js';

export function buildCalories(weight, height, age, sex, activityLevel, goal) {
  const bmr = calculateBMR(weight, height, age, sex);
  const tdee = calculateTDEE(bmr, activityLevel);
  const goalData = GOAL_MULTIPLIERS[goal] || GOAL_MULTIPLIERS.maintain;
  const calories = tdee * goalData.multiplier;
  const ratios = MACRO_RATIOS[goal] || MACRO_RATIOS.maintain;

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    calories: Math.round(calories),
    protein: Math.round((calories * ratios.protein / 100) / 4),
    fat: Math.round((calories * ratios.fat / 100) / 9),
    carbs: Math.round((calories * ratios.carbs / 100) / 4),
    goalLabel: goalData.label,
    goalDesc: goalData.description,
  };
}

export function getGoalMultiplier(goal) {
  return (GOAL_MULTIPLIERS[goal] || GOAL_MULTIPLIERS.maintain).multiplier;
}