/**
 * NutriTrack — BMI Calculator
 */

/**
 * Mifflin-St Jeor BMR formula
 * @param {number} weight - kg
 * @param {number} height - cm
 * @param {number} age - years
 * @param {'male'|'female'} sex
 */
export function calculateBMR(weight, height, age, sex) {
  if (sex === 'female') {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
  return 10 * weight + 6.25 * height - 5 * age + 5;
}

/**
 * TDEE = BMR × activity multiplier
 */
export function calculateTDEE(bmr, activityLevel) {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  };
  return bmr * (multipliers[activityLevel] || 1.2);
}

/**
 * Calculate BMI
 * @param {number} weight - kg
 * @param {number} height - cm
 */
export function calculateBMI(weight, height) {
  const heightM = height / 100;
  return weight / (heightM * heightM);
}

/**
 * @param {number} bmi
 * @returns {{ label: string; advice: string; color: string }}
 */
export function getBMICategory(bmi) {
  if (bmi < 16) return {
    label: 'Выраженный дефицит массы',
    advice: 'Рекомендуется обратиться к врачу для корректировки питания.',
    color: '#e74c3c',
  };
  if (bmi < 18.5) return {
    label: 'Дефицит массы',
    advice: 'Немного ниже нормы. Рекомендуется увеличить калорийность рациона.',
    color: '#f39c12',
  };
  if (bmi < 25) return {
    label: 'Нормальная масса',
    advice: 'Отличный результат! Поддерживайте текущий вес здоровым образом жизни.',
    color: '#27ae60',
  };
  if (bmi < 30) return {
    label: 'Избыточный вес',
    advice: 'Рекомендуется скорректировать питание и увеличить физическую активность.',
    color: '#f39c12',
  };
  return {
    label: 'Ожирение',
    advice: 'Рекомендуется обратиться к врачу-диетологу для составления плана питания.',
    color: '#e74c3c',
  };
}

/**
 * Ideal weight range
 */
export function getIdealWeightRange(height) {
  const minBMI = 18.5;
  const maxBMI = 24.9;
  const heightM = height / 100;
  return {
    min: (minBMI * heightM * heightM).toFixed(1),
    max: (maxBMI * heightM * heightM).toFixed(1),
  };
}

/**
 * Weight difference from ideal
 */
export function getWeightDifference(weight, height) {
  const midBMI = 21.7;
  const ideal = midBMI * (height / 100) * (height / 100);
  return +(weight - ideal).toFixed(1);
}