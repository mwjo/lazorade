
export const calculateWaterRequirements = (
  temperature: number,
  sweatRate: string,
  duration: number
): { waterRequiredPerHour: number; totalWaterRequired: number } => {
  let waterRequiredPerHour = 667;
  
  if (temperature > 25) {
    const tempFactor = Math.min(1, (temperature - 25) / 10);
    waterRequiredPerHour = 667 + (333 * tempFactor);
  }
  
  if (sweatRate === "low") waterRequiredPerHour *= 0.85;
  if (sweatRate === "high") waterRequiredPerHour *= 1.15;
  
  const totalWaterRequired = waterRequiredPerHour * duration;
  
  return { waterRequiredPerHour, totalWaterRequired };
};

export const calculateSodiumAndAcid = (
  temperature: number,
  totalWaterRequired: number,
  totalCarbs: number
) => {
  const sodiumCitratePerLiter = 3.8;
  let sodiumTempFactor = 1;
  
  if (temperature > 25) {
    sodiumTempFactor = 1 + (Math.min(0.25, (temperature - 25) * 0.025));
  }
  
  const totalSodiumCitrate = (sodiumCitratePerLiter * totalWaterRequired / 1000) * sodiumTempFactor;
  const totalCitricAcid = totalCarbs / 30;
  
  return { totalSodiumCitrate, totalCitricAcid };
};
