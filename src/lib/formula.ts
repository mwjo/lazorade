
export interface FormulaParams {
  distance: number; // in km
  temperature: number; // in Celsius
  sweatRate: string; // 'low', 'medium', 'high'
  intensity: string; // 'low', 'medium', 'high'
  bottleSize: number; // in ml
}

export interface FormulaResult {
  waterAmount: number; // in ml
  sodiumCitrateAmount: number; // in g
  citricAcidAmount: number; // in g
  sugarAmount: number; // in g
  caffeineAmount: number; // in mg
  totalRideTime: number; // in hours
  totalCalories: number; // calories
  bottlesNeeded: number; // total bottles required for the ride
}

/**
 * Calculate the optimal formula for a cycling electrolyte drink
 */
export function calculateFormula(params: FormulaParams): FormulaResult {
  const { distance, temperature, sweatRate, intensity, bottleSize } = params;
  
  // Calculate estimated ride time based on distance and intensity (in hours)
  let speedFactor = 1;
  if (intensity === "low") speedFactor = 0.8;
  if (intensity === "high") speedFactor = 1.2;
  
  const averageSpeed = 25 * speedFactor; // km/h - baseline speed for average cyclist
  const totalRideTime = Math.max(1, Math.round((distance / averageSpeed) * 10) / 10); // round to 1 decimal
  
  // Calculate sugar amount (base: 60g per hour, max 90g)
  // Adjust based on intensity
  let sugarPerHour = 60; // g/hour - base amount
  if (intensity === "low") sugarPerHour = 45;
  if (intensity === "high") sugarPerHour = 75;
  
  let sugarAmount = Math.min(sugarPerHour * totalRideTime, 90); // cap at 90g max
  
  // Scale down if ride is very short
  if (totalRideTime < 1) {
    sugarAmount = sugarAmount * totalRideTime;
  }
  
  // Adjust for bottle size - scale everything proportionally if needed
  let bottleMultiplier = 1;
  
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
  
  // If required water exceeds bottle size, we need to concentrate the mix
  if (totalWaterRequired > bottleSize) {
    bottleMultiplier = bottleSize / totalWaterRequired;
    // Cap the multiplier at 0.5 to avoid overly concentrated mixes
    bottleMultiplier = Math.max(0.5, bottleMultiplier);
  }
  
  // Fixed bottle size
  const waterAmount = bottleSize;
  
  // Calculate sodium citrate (target: 1000mg sodium per liter of water)
  // 2.5g sodium citrate provides about 586mg of sodium, so we need about 4.26g per liter
  const sodiumPerLiter = intensity === "high" ? 1400 : 1000; // mg/L
  const sodiumCitratePerLiter = (sodiumPerLiter / 586) * 2.5; // g/L
  let sodiumCitrateAmount = (sodiumCitratePerLiter * waterAmount / 1000) * bottleMultiplier;
  
  // Calculate citric acid (1g per 30g of sugar)
  let citricAcidAmount = (sugarAmount / 30) * bottleMultiplier;
  
  // Adjust sugar amount by bottle multiplier
  sugarAmount = sugarAmount * bottleMultiplier;
  
  // Calculate caffeine - based on intensity and ride length
  // Base: 100mg for a 2-hour moderate ride
  let caffeineAmount = 0;
  if (totalRideTime >= 1) { // Only add caffeine for rides over 1 hour
    caffeineAmount = 50 * totalRideTime; // 50mg per hour
    if (intensity === "high") caffeineAmount *= 1.5; // More for high intensity
    
    // Cap caffeine at reasonable amounts
    caffeineAmount = Math.min(caffeineAmount, 200); // Max 200mg
  }
  
  // Round all values for better presentation
  sugarAmount = Math.round(sugarAmount * 10) / 10;
  sodiumCitrateAmount = Math.round(sodiumCitrateAmount * 10) / 10;
  citricAcidAmount = Math.round(citricAcidAmount * 10) / 10;
  caffeineAmount = Math.round(caffeineAmount);
  
  // Calculate total calories (sugar = 4 calories per gram)
  const totalCalories = Math.round(sugarAmount * 4);
  
  return {
    waterAmount,
    sodiumCitrateAmount,
    citricAcidAmount,
    sugarAmount,
    caffeineAmount,
    totalRideTime,
    totalCalories,
    bottlesNeeded
  };
}
