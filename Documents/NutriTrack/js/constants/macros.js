/**
 * NutriTrack — Константы (единый источник)
 * FIX (M3): Единый источник macro ratios и activity modes
 */

export const MACRO_RATIOS = {
  maintain: { protein: 30, fat: 30, carbs: 40, label: 'Поддержание' },
  lose:     { protein: 35, fat: 30, carbs: 35, label: 'Похудение' },
  gain:     { protein: 25, fat: 25, carbs: 50, label: 'Набор массы' },
  cut:      { protein: 40, fat: 30, carbs: 30, label: 'Сушка' },
};

export const GOAL_MULTIPLIERS = {
  maintain: { label: 'Поддержание веса', multiplier: 1.0, description: 'Без изменений' },
  lose:     { label: 'Похудение',       multiplier: 0.85, description: '-15% калорий' },
  gain:     { label: 'Набор массы',      multiplier: 1.10, description: '+10% калорий' },
  cut:      { label: 'Сушка',            multiplier: 0.80, description: '-20% калорий, высокий белок' },
};

export const ACTIVITY_MODES = {
  sedentary:  { label: 'Сидячий образ жизни',  desc: 'Минимальная активность, сидячая работа', multiplier: 1.2 },
  light:      { label: 'Лёгкая активность',     desc: 'Лёгкие упражнения 1–3 раза в неделю',   multiplier: 1.375 },
  moderate:   { label: 'Умеренная активность',  desc: 'Умеренные тренировки 3–5 раз в неделю',  multiplier: 1.55 },
  active:     { label: 'Высокая активность',    desc: 'Интенсивные тренировки 6–7 раз в неделю', multiplier: 1.725 },
  veryActive: { label: 'Спортсмены',            desc: 'Спортсмены, физическая работа, 2 тренировки в день', multiplier: 1.9 },
};

export const MEAL_TYPES = {
  breakfast: { label: 'Завтрак', icon: 'fa-sun' },
  lunch:     { label: 'Обед',    icon: 'fa-cloud-sun' },
  dinner:    { label: 'Ужин',    icon: 'fa-moon' },
  snack:     { label: 'Перекус', icon: 'fa-cookie-bite' },
};