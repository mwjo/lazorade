export interface FormulaParams {
  duration: number; // in hours
  temperature: number; // in Celsius
  sweatRate: string; // 'low', 'medium', 'high'
  intensity: string; // 'low', 'medium', 'high'
  bottleSize: number; // in ml
  // Advanced parameters
  isAdvanced?: boolean; // whether to use advanced formula calculation
  carbRatio?: string; // 'maltodextrin-dominant' (1:0.8), 'balanced' (1:1)
  carbAdaptation?: string; // 'low', 'medium', 'high'
  separateBottles?: boolean; // whether to separate hydration and fueling
  caffeineTolerance?: string; // 'low', 'medium', 'high'
}

export interface FormulaResult {
  waterAmount: number; // in ml
  sodiumCitrateAmount: number; // in g
  citricAcidAmount: number; // in g
  maltodextrinAmount: number; // in g
  fructoseAmount: number; // in g
  sugarAmount?: number; // in g (for backward compatibility)
  caffeineAmount: number; // in mg
  totalRideTime: number; // in hours
  totalCalories: number; // calories
  bottlesNeeded: number; // total bottles required for the ride
  totalWaterRequired: number; // total water needed for the entire ride in ml
  osmolality?: number; // in mOsm/kg (for advanced view)
  // Separate bottle results (if separateBottles is true)
  hydrationBottle?: {
    waterAmount: number;
    sodiumCitrateAmount: number;
    citricAcidAmount: number;
    osmolality: number;
  };
  fuelingBottle?: {
    waterAmount: number;
    maltodextrinAmount: number;
    fructoseAmount: number;
    caffeineAmount: number;
    citricAcidAmount: number;
    osmolality: number;
  };
}

/**
 * Calculate the optimal formula for a cycling electrolyte drink
 */
export function calculateFormula(params: FormulaParams): FormulaResult {
  const { 
    duration, 
    temperature, 
    sweatRate, 
    intensity, 
    bottleSize,
    isAdvanced = false,
    carbRatio = 'maltodextrin-dominant',
    carbAdaptation = 'medium',
    separateBottles = false,
    caffeineTolerance = 'medium'
  } = params;
  
  // Use the provided duration directly
  const totalRideTime = duration;
  
  // Calculate carbohydrate amounts - base 60g per hour
  let carbsPerHour = 60; // g/hour - standard amount
  
  // Adjust based on intensity only if not "medium"
  if (intensity === "low") carbsPerHour = 45;
  if (intensity === "high") carbsPerHour = 75;
  
  // Temperature adjustment for carbs
  let tempAdjustment = 1;
  if (temperature > 25) {
    // Reduce carbs by up to 20% as temperature increases (max reduction at 35°C)
    tempAdjustment = 1 - Math.min(0.2, (temperature - 25) * 0.02);
  }
  
  // Calculate total carbs needed for the ride
  let totalCarbs = 0;
  
  // For rides under 2 hours, apply progressive scaling hour by hour
  if (totalRideTime <= 2) {
    // First hour carbs (50-75% of full amount depending on duration)
    const firstHourFactor = 0.5 + (Math.min(1, totalRideTime) / 4);
    totalCarbs += carbsPerHour * tempAdjustment * firstHourFactor * Math.min(1, totalRideTime);
    
    // Second hour carbs (75-100% of full amount depending on remaining duration)
    if (totalRideTime > 1) {
      const secondHourFactor = 0.75 + (Math.min(1, totalRideTime - 1) / 4);
      totalCarbs += carbsPerHour * tempAdjustment * secondHourFactor * Math.min(1, totalRideTime - 1);
    }
  }
  // For rides over 2 hours
  else {
    // First hour: 50% of the standard amount
    totalCarbs += carbsPerHour * tempAdjustment * 0.5;
    
    // Second hour: 75% of the standard amount
    totalCarbs += carbsPerHour * tempAdjustment * 0.75;
    
    // Remaining hours: full standard amount
    totalCarbs += carbsPerHour * tempAdjustment * (totalRideTime - 2);
  }
  
  // Split carbs based on the selected ratio
  let maltodextrinRatio = 0.56; // Default 1:0.8 maltodextrin:fructose (56% maltodextrin, 44% fructose)
  if (isAdvanced && carbRatio === "balanced") {
    maltodextrinRatio = 0.5; // 1:1 (50% maltodextrin, 50% fructose)
  }
  
  let maltodextrinAmount = totalCarbs * maltodextrinRatio;
  let fructoseAmount = totalCarbs * (1 - maltodextrinRatio);
  
  // For backward compatibility
  const sugarAmount = totalCarbs;
  
  // Calculate water needed - based on the new requirement of 1L per 1.5 hours
  // Base water amount
  let waterRequiredPerHour = 667; // ml/hour (1000ml / 1.5 hours)
  
  // Adjust for temperature
  if (temperature > 25) {
    // Increase to 1L per hour in very hot temperatures
    // Linear increase from 667ml to 1000ml between 25°C and 35°C
    const tempFactor = Math.min(1, (temperature - 25) / 10);
    waterRequiredPerHour = 667 + (333 * tempFactor);
  }
  
  // Adjust for sweat rate
  if (sweatRate === "low") waterRequiredPerHour *= 0.85;
  if (sweatRate === "high") waterRequiredPerHour *= 1.15;
  
  // Total water needed for the ride
  let totalWaterRequired = waterRequiredPerHour * totalRideTime;
  
  // Calculate total bottles needed
  const bottlesNeeded = Math.ceil(totalWaterRequired / bottleSize);
  
  // Calculate sodium amount (via sodium citrate)
  // Base: 3.8g sodium citrate per liter (provides 1000mg sodium)
  const sodiumCitratePerLiter = 3.8; // g/L
  
  // Adjust for temperature - increase sodium in hot conditions
  let sodiumTempFactor = 1;
  if (temperature > 25) {
    // Increase sodium by up to 25% in hot conditions
    sodiumTempFactor = 1 + (Math.min(0.25, (temperature - 25) * 0.025));
  }
  
  // Calculate per bottle amounts
  const waterAmount = bottleSize;
  
  // Calculate sodium citrate amount (adjusted for temperature)
  let sodiumCitrateAmount = (sodiumCitratePerLiter * waterAmount / 1000) * sodiumTempFactor;
  
  // Calculate citric acid - 2g per 60g of sugar
  let citricAcidAmount = (totalCarbs / 30); // 1g per 30g sugar
  
  // Adjust maltodextrin and fructose for bottle size
  let bottleMultiplier = 1;
  if (totalWaterRequired > bottleSize) {
    bottleMultiplier = bottleSize / totalWaterRequired;
    // Cap the multiplier at 0.5 to avoid overly concentrated mixes
    bottleMultiplier = Math.max(0.5, bottleMultiplier);
  }
  
  maltodextrinAmount = maltodextrinAmount * bottleMultiplier;
  fructoseAmount = fructoseAmount * bottleMultiplier;
  citricAcidAmount = citricAcidAmount * bottleMultiplier;
  
  // Calculate caffeine - 60mg per hour with tolerance adjustment
  let caffeinePerHour = 60; // mg/hour base
  
  if (isAdvanced) {
    if (caffeineTolerance === "low") {
      caffeinePerHour = 40; // Lower for those with low tolerance
    } else if (caffeineTolerance === "high") {
      caffeinePerHour = 80; // Higher for those with high tolerance
    }
  }
  
  let caffeineAmount = caffeinePerHour * totalRideTime;
  
  // Cap caffeine at reasonable amounts (400mg max for safety)
  caffeineAmount = Math.min(caffeineAmount, 400);
  
  // Apply bottle multiplier to caffeine
  caffeineAmount = caffeineAmount * bottleMultiplier;
  
  // Calculate osmolality (mOsm/kg) for advanced view
  let osmolality;
  if (isAdvanced) {
    // Simplified osmolality calculation
    const carbOsmolality = (maltodextrinAmount + fructoseAmount) * 5; // Approx contribution
    const electrolyteOsmolality = (sodiumCitrateAmount * 1000) * 3;
    osmolality = Math.round((carbOsmolality + electrolyteOsmolality) / waterAmount * 1000);
  }
  
  // Separate bottles calculation (if enabled)
  let hydrationBottle: any;
  let fuelingBottle: any;
  
  if (isAdvanced && separateBottles) {
    // Hydration bottle: focus on water and electrolytes
    hydrationBottle = {
      waterAmount: bottleSize,
      sodiumCitrateAmount: sodiumCitrateAmount * 1.2, // Increase electrolytes slightly
      citricAcidAmount: citricAcidAmount * 0.5, // Reduce acid for palatability
      osmolality: Math.round((sodiumCitrateAmount * 1.2 * 1000 * 3) / bottleSize * 1000)
    };
    
    // Fueling bottle: focus on carbs and caffeine
    fuelingBottle = {
      waterAmount: bottleSize,
      maltodextrinAmount: maltodextrinAmount * 2, // Double the carbs since it's dedicated to fueling
      fructoseAmount: fructoseAmount * 2,
      caffeineAmount: caffeineAmount, // All caffeine goes here
      citricAcidAmount: citricAcidAmount * 1.5, // More acid to balance sweetness
      osmolality: Math.round(((maltodextrinAmount * 2 + fructoseAmount * 2) * 5) / bottleSize * 1000)
    };
  }
  
  // Round values to 1 decimal place
  maltodextrinAmount = Math.round(maltodextrinAmount * 10) / 10;
  fructoseAmount = Math.round(fructoseAmount * 10) / 10;
  sodiumCitrateAmount = Math.round(sodiumCitrateAmount * 10) / 10;
  citricAcidAmount = Math.round(citricAcidAmount * 10) / 10;
  caffeineAmount = Math.round(caffeineAmount);
  
  // Calculate total calories (carbs = 4 calories per gram)
  const totalCalories = Math.round((maltodextrinAmount + fructoseAmount) * 4);
  
  // Round values in the bottles if they exist
  if (hydrationBottle) {
    hydrationBottle.sodiumCitrateAmount = Math.round(hydrationBottle.sodiumCitrateAmount * 10) / 10;
    hydrationBottle.citricAcidAmount = Math.round(hydrationBottle.citricAcidAmount * 10) / 10;
  }
  
  if (fuelingBottle) {
    fuelingBottle.maltodextrinAmount = Math.round(fuelingBottle.maltodextrinAmount * 10) / 10;
    fuelingBottle.fructoseAmount = Math.round(fuelingBottle.fructoseAmount * 10) / 10;
    fuelingBottle.citricAcidAmount = Math.round(fuelingBottle.citricAcidAmount * 10) / 10;
  }
  
  return {
    waterAmount,
    sodiumCitrateAmount,
    citricAcidAmount,
    maltodextrinAmount,
    fructoseAmount,
    sugarAmount: Math.round((maltodextrinAmount + fructoseAmount) * 10) / 10, // Round the combined sugar amount to 1 decimal place
    caffeineAmount,
    totalRideTime,
    totalCalories,
    bottlesNeeded,
    totalWaterRequired,
    osmolality,
    hydrationBottle,
    fuelingBottle
  };
}
