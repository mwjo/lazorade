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
    separateBottles = false
  } = params;
  
  // Use the provided duration directly instead of calculating from distance
  const totalRideTime = duration;
  
  // Calculate carbohydrate amounts (refined approach)
  // Base carb amount depends on intensity
  let carbsPerHour = 60; // g/hour - base amount
  if (intensity === "low") carbsPerHour = 45;
  if (intensity === "high") carbsPerHour = 75;
  
  // Adjust based on carb adaptation level (for advanced mode)
  if (isAdvanced && carbAdaptation === "high") {
    carbsPerHour *= 1.25; // Up to 90-100g/hr for well-adapted athletes
  } else if (isAdvanced && carbAdaptation === "low") {
    carbsPerHour *= 0.8; // Reduce for those with less adaptation
  }
  
  // Calculate total carbs needed for the ride
  let totalCarbs = carbsPerHour * totalRideTime;
  
  // Cap at reasonable amounts based on adaptation
  const carbCap = isAdvanced ? 
    (carbAdaptation === "high" ? 120 : carbAdaptation === "medium" ? 90 : 70) : 
    90; // Default cap at 90g in basic mode
    
  totalCarbs = Math.min(totalCarbs, carbCap);
  
  // Scale down if ride is very short
  if (totalRideTime < 1) {
    totalCarbs = totalCarbs * totalRideTime;
  }
  
  // Split carbs based on the selected ratio
  let maltodextrinRatio = 0.56; // Default 1:0.8 maltodextrin:fructose (56% maltodextrin, 44% fructose)
  if (isAdvanced) {
    if (carbRatio === "balanced") maltodextrinRatio = 0.5; // 1:1 (50% maltodextrin, 50% fructose)
    // Only these two options are now available
  }
  
  let maltodextrinAmount = totalCarbs * maltodextrinRatio;
  let fructoseAmount = totalCarbs * (1 - maltodextrinRatio);
  
  // For backward compatibility
  const sugarAmount = totalCarbs;
  
  // Calculate water needed
  // Base water amount for electrolytes
  let waterRequiredPerHour = 500; // ml/hour base rate
  
  // Adjust for temperature
  if (temperature > 25) waterRequiredPerHour += (temperature - 25) * 20; // 20ml more per degree over 25C
  if (temperature < 15) waterRequiredPerHour -= (15 - temperature) * 10; // 10ml less per degree under 15C
  
  // Adjust for sweat rate
  if (sweatRate === "low") waterRequiredPerHour *= 0.85;
  if (sweatRate === "high") waterRequiredPerHour *= 1.25;
  
  // Total water needed for the ride
  let totalWaterRequired = waterRequiredPerHour * totalRideTime;
  
  // Calculate total bottles needed
  const bottlesNeeded = Math.ceil(totalWaterRequired / bottleSize);
  
  // Adjust for bottle size
  let bottleMultiplier = 1;
  if (totalWaterRequired > bottleSize) {
    bottleMultiplier = bottleSize / totalWaterRequired;
    // Cap the multiplier at 0.5 to avoid overly concentrated mixes
    bottleMultiplier = Math.max(0.5, bottleMultiplier);
  }
  
  // Fixed bottle size
  const waterAmount = bottleSize;
  
  // Calculate electrolytes
  // Sodium (via sodium citrate)
  const sodiumPerLiter = intensity === "high" ? 1400 : 1000; // mg/L
  const sodiumCitratePerLiter = (sodiumPerLiter / 586) * 2.5; // g/L
  let sodiumCitrateAmount = (sodiumCitratePerLiter * waterAmount / 1000) * bottleMultiplier;
  
  // Calculate citric acid (pH balancing)
  // Base calculation on carbohydrate content
  let citricAcidAmount = (totalCarbs / 30) * bottleMultiplier;
  
  // Adjust maltodextrin and fructose by bottle multiplier
  maltodextrinAmount = maltodextrinAmount * bottleMultiplier;
  fructoseAmount = fructoseAmount * bottleMultiplier;
  
  // Calculate caffeine - based on intensity and ride length
  let caffeineAmount = 0;
  
  if (totalRideTime >= 1) { // Only add caffeine for rides over 1 hour
    caffeineAmount = 50 * totalRideTime; // 50mg per hour
    
    if (intensity === "high") caffeineAmount *= 1.5; // More for high intensity
    
    // Cap caffeine at reasonable amounts
    caffeineAmount = Math.min(caffeineAmount, 200); // Max 200mg
  }
  
  // Calculate osmolality (mOsm/kg) for advanced view
  let osmolality;
  if (isAdvanced) {
    // Simplified osmolality calculation
    // Consider each component's contribution to osmolality
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
  
  // Round all values for better presentation
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
    sugarAmount, // For backward compatibility
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
