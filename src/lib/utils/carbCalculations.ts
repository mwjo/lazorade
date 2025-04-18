
import { FormulaParams } from '@/types/formula';

export const calculateCarbAmount = (
  duration: number,
  intensity: string,
  temperature: number
): { totalCarbs: number; tempAdjustment: number } => {
  let carbsPerHour = 60;
  
  if (intensity === "low") carbsPerHour = 45;
  if (intensity === "high") carbsPerHour = 75;
  
  let tempAdjustment = 1;
  if (temperature > 25) {
    tempAdjustment = 1 - Math.min(0.2, (temperature - 25) * 0.02);
  }
  
  let totalCarbs = 0;
  
  if (duration <= 2) {
    const firstHourFactor = 0.5 + (Math.min(1, duration) / 4);
    totalCarbs += carbsPerHour * tempAdjustment * firstHourFactor * Math.min(1, duration);
    
    if (duration > 1) {
      const secondHourFactor = 0.75 + (Math.min(1, duration - 1) / 4);
      totalCarbs += carbsPerHour * tempAdjustment * secondHourFactor * Math.min(1, duration - 1);
    }
  } else {
    totalCarbs += carbsPerHour * tempAdjustment * 0.5;
    totalCarbs += carbsPerHour * tempAdjustment * 0.75;
    totalCarbs += carbsPerHour * tempAdjustment * (duration - 2);
  }
  
  return { totalCarbs, tempAdjustment };
};

export const calculateCarbRatio = (isAdvanced: boolean, carbRatio: string = 'maltodextrin-dominant') => {
  const maltodextrinRatio = isAdvanced && carbRatio === "balanced" ? 0.5 : 0.56;
  return maltodextrinRatio;
};
