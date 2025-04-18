
export interface FormulaParams {
  duration: number;
  temperature: number;
  sweatRate: string;
  intensity: string;
  bottleSize: number;
  isAdvanced?: boolean;
  carbRatio?: string;
  carbAdaptation?: string;
  separateBottles?: boolean;
  caffeineTolerance?: string;
}

export interface FormulaResult {
  waterAmount: number;
  sodiumCitrateAmount: number;
  citricAcidAmount: number;
  maltodextrinAmount: number;
  fructoseAmount: number;
  sugarAmount?: number;
  caffeineAmount: number;
  totalRideTime: number;
  totalCalories: number;
  bottlesNeeded: number;
  totalWaterRequired: number;
  osmolality?: number;
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
