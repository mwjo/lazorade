
import { FormulaParams, FormulaResult } from '@/types/formula';
import { calculateCarbAmount, calculateCarbRatio } from './utils/carbCalculations';
import { calculateWaterRequirements, calculateSodiumAndAcid } from './utils/hydrationCalculations';

export { FormulaParams, FormulaResult };

export function calculateFormula(params: FormulaParams): FormulaResult {
  const { 
    duration, 
    temperature, 
    sweatRate, 
    intensity, 
    bottleSize,
    isAdvanced = false,
    carbRatio = 'maltodextrin-dominant',
    caffeineTolerance = 'medium'
  } = params;

  // Calculate carbohydrate amounts
  const { totalCarbs, tempAdjustment } = calculateCarbAmount(duration, intensity, temperature);
  const maltodextrinRatio = calculateCarbRatio(isAdvanced, carbRatio);
  
  const totalMaltodextrin = totalCarbs * maltodextrinRatio;
  const totalFructose = totalCarbs * (1 - maltodextrinRatio);
  
  // Calculate water requirements
  const { totalWaterRequired } = calculateWaterRequirements(temperature, sweatRate, duration);
  const bottlesNeeded = Math.ceil(totalWaterRequired / bottleSize);
  
  // Calculate sodium and acid amounts
  const { totalSodiumCitrate, totalCitricAcid } = calculateSodiumAndAcid(temperature, totalWaterRequired, totalCarbs);
  
  // Calculate caffeine amount
  let caffeinePerHour = 60;
  if (isAdvanced) {
    if (caffeineTolerance === "low") caffeinePerHour = 40;
    if (caffeineTolerance === "high") caffeinePerHour = 80;
  }
  let totalCaffeine = Math.min(caffeinePerHour * duration, 400);

  // Calculate per bottle amounts
  const waterAmount = bottleSize;
  const maltodextrinAmount = Math.round(totalMaltodextrin / bottlesNeeded * 10) / 10;
  const fructoseAmount = Math.round(totalFructose / bottlesNeeded * 10) / 10;
  const sodiumCitrateAmount = Math.round(totalSodiumCitrate / bottlesNeeded * 10) / 10;
  const citricAcidAmount = Math.round(totalCitricAcid / bottlesNeeded * 10) / 10;
  const caffeineAmount = Math.round(totalCaffeine / bottlesNeeded);
  
  // Calculate osmolality for advanced view
  let osmolality;
  let hydrationBottle;
  let fuelingBottle;

  if (isAdvanced) {
    const carbOsmolality = (maltodextrinAmount + fructoseAmount) * 5;
    const electrolyteOsmolality = (sodiumCitrateAmount * 1000) * 3;
    osmolality = Math.round((carbOsmolality + electrolyteOsmolality) / waterAmount * 1000);

    if (params.separateBottles) {
      hydrationBottle = {
        waterAmount: bottleSize,
        sodiumCitrateAmount: Math.round(sodiumCitrateAmount * 1.2 * 10) / 10,
        citricAcidAmount: Math.round(citricAcidAmount * 0.5 * 10) / 10,
        osmolality: Math.round((sodiumCitrateAmount * 1.2 * 1000 * 3) / bottleSize * 1000)
      };
      
      fuelingBottle = {
        waterAmount: bottleSize,
        maltodextrinAmount: Math.round(maltodextrinAmount * 2 * 10) / 10,
        fructoseAmount: Math.round(fructoseAmount * 2 * 10) / 10,
        caffeineAmount: caffeineAmount,
        citricAcidAmount: Math.round(citricAcidAmount * 1.5 * 10) / 10,
        osmolality: Math.round(((maltodextrinAmount * 2 + fructoseAmount * 2) * 5) / bottleSize * 1000)
      };
    }
  }

  return {
    waterAmount,
    sodiumCitrateAmount,
    citricAcidAmount,
    maltodextrinAmount,
    fructoseAmount,
    sugarAmount: Math.round((maltodextrinAmount + fructoseAmount) * 10) / 10,
    caffeineAmount,
    totalRideTime: duration,
    totalCalories: Math.round((maltodextrinAmount + fructoseAmount) * 4),
    bottlesNeeded,
    totalWaterRequired,
    osmolality,
    hydrationBottle,
    fuelingBottle
  };
}
