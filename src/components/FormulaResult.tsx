import React from 'react';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { FormulaResult as FormulaResultType } from "@/lib/formula";
import { Bike, Droplet, Beaker, AlertCircle } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FormulaResultProps {
  formula: FormulaResultType;
  isMetric: boolean;
  isAdvanced: boolean;
}

const FormulaResult: React.FC<FormulaResultProps> = ({ formula, isMetric, isAdvanced }) => {
  const { 
    waterAmount, 
    sodiumCitrateAmount, 
    citricAcidAmount, 
    maltodextrinAmount,
    fructoseAmount,
    caffeineAmount, 
    totalRideTime, 
    totalCalories,
    bottlesNeeded,
    osmolality,
    hydrationBottle,
    fuelingBottle,
    totalWaterRequired
  } = formula;
  
  // Calculate how much of the last bottle is needed
  const bottlesNeededExact = totalWaterRequired / waterAmount;
  const bottlesNeededWhole = Math.floor(bottlesNeededExact);
  const lastBottlePercentage = (bottlesNeededExact - bottlesNeededWhole) * 100;
  const showPartialBottle = lastBottlePercentage > 0 && lastBottlePercentage < 100;
  
  // Get the highest amount to normalize progress bars
  const maxAmount = Math.max(
    sodiumCitrateAmount, 
    citricAcidAmount, 
    maltodextrinAmount + fructoseAmount, // Combined in non-advanced mode
    isAdvanced ? maltodextrinAmount : 0,
    isAdvanced ? fructoseAmount : 0,
    caffeineAmount * 10 // Scale up caffeine for visibility
  );
  
  // Define ingredients for standard single bottle
  let ingredients = [];
  
  if (isAdvanced) {
    // In advanced mode, show maltodextrin and fructose separately
    ingredients = [
      {
        name: "Maltodextrin",
        amount: maltodextrinAmount,
        unit: "g",
        color: "bg-green-500",
        percentage: (maltodextrinAmount / maxAmount) * 100
      },
      {
        name: "Fructose",
        amount: fructoseAmount,
        unit: "g",
        color: "bg-green-300",
        percentage: (fructoseAmount / maxAmount) * 100
      },
      {
        name: "Sodium Citrate",
        amount: sodiumCitrateAmount,
        unit: "g",
        color: "bg-blue-500",
        percentage: (sodiumCitrateAmount / maxAmount) * 100
      },
      {
        name: "Citric Acid",
        amount: citricAcidAmount,
        unit: "g",
        color: "bg-yellow-500",
        percentage: (citricAcidAmount / maxAmount) * 100
      },
      {
        name: "Caffeine",
        amount: caffeineAmount,
        unit: "mg",
        color: "bg-red-500",
        percentage: ((caffeineAmount * 10) / maxAmount) * 100 // Scale up for visibility
      }
    ];
  } else {
    // In non-advanced mode, combine maltodextrin and fructose as "Table Sugar"
    ingredients = [
      {
        name: "Table Sugar",
        amount: maltodextrinAmount + fructoseAmount,
        unit: "g",
        color: "bg-green-500",
        percentage: ((maltodextrinAmount + fructoseAmount) / maxAmount) * 100
      },
      {
        name: "Sodium Citrate",
        amount: sodiumCitrateAmount,
        unit: "g",
        color: "bg-blue-500",
        percentage: (sodiumCitrateAmount / maxAmount) * 100
      },
      {
        name: "Citric Acid",
        amount: citricAcidAmount,
        unit: "g",
        color: "bg-yellow-500",
        percentage: (citricAcidAmount / maxAmount) * 100
      },
      {
        name: "Caffeine",
        amount: caffeineAmount,
        unit: "mg",
        color: "bg-red-500",
        percentage: ((caffeineAmount * 10) / maxAmount) * 100 // Scale up for visibility
      }
    ];
  }
  
  if (!isAdvanced || !hydrationBottle || !fuelingBottle) {
    // Standard single bottle view
    return (
      <Card className="formula-card h-full">
        <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-800 dark:to-blue-900">
          <CardTitle className="text-xl">Your Optimal Formula</CardTitle>
          {isAdvanced && osmolality && (
            <CardDescription>
              Osmolality: {osmolality} mOsm/kg 
              ({osmolality < 270 ? 'Hypotonic' : osmolality <= 290 ? 'Isotonic' : 'Hypertonic'})
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between text-sm font-medium">
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded-full bg-blue-100 border border-blue-300"></span>
              Water
            </span>
            <span>{waterAmount} ml</span>
          </div>
          
          <div className="space-y-3">
            {ingredients.map((ingredient, index) => (
              <div key={index}>
                <div className="flex items-center justify-between text-sm font-medium">
                  <span className="flex items-center gap-1">
                    <span className={`inline-block w-3 h-3 rounded-full ${ingredient.color}`}></span>
                    {ingredient.name}
                  </span>
                  <span>{ingredient.amount} {ingredient.unit}</span>
                </div>
                <Progress value={ingredient.percentage} className="h-2 mt-1" />
              </div>
            ))}
          </div>
          
          <div className="pt-4 border-t mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-2 bg-muted rounded-md">
                <div className="text-sm text-muted-foreground">Bottles Needed</div>
                <div className="text-xl font-semibold">
                  {bottlesNeeded}
                </div>
              </div>
              <div className="text-center p-2 bg-muted rounded-md">
                <div className="text-sm text-muted-foreground">Calories</div>
                <div className="text-xl font-semibold">{totalCalories}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-md mt-4">
            <p className="font-medium flex items-center gap-2">
              <Droplet className="h-4 w-4 text-blue-500" />
              <span>Hydration Needs:</span>
            </p>
            
            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Total fluid required:</span>
                <span className="font-medium">{Math.round(totalWaterRequired)} ml</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span>Bottle capacity:</span>
                <span className="font-medium">{waterAmount} ml</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span>Full bottles needed:</span>
                <span className="font-medium">{bottlesNeededWhole}</span>
              </div>
              
              {showPartialBottle && (
                <div className="flex items-center justify-between text-sm">
                  <span>Last bottle consumption:</span>
                  <span className="font-medium">{Math.round(lastBottlePercentage)}%</span>
                </div>
              )}
              
              <div className="flex items-center justify-between text-sm font-medium text-blue-700 dark:text-blue-300">
                <span>Total bottles to prepare:</span>
                <span>{bottlesNeeded}</span>
              </div>
              
              {showPartialBottle && (
                <div className="mt-2 relative pt-1">
                  <div className="flex mb-1 items-center justify-between">
                    <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                      Last bottle consumption
                    </div>
                    <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                      {Math.round(lastBottlePercentage)}%
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-100">
                    <div style={{ width: `${lastBottlePercentage}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="rounded-md bg-blue-50 dark:bg-blue-900/30 p-3 text-sm mt-4">
            <p className="font-medium mb-1">Mix Instructions:</p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Measure all ingredients precisely</li>
              <li>Add to your {formula.waterAmount}ml bottle</li> 
              <li>Shake thoroughly until dissolved</li>
              <li>Best consumed cold</li>
              {bottlesNeeded > 1 && (
                <li className="font-medium text-blue-600 dark:text-blue-400">
                  Repeat for all {bottlesNeeded} bottles
                </li>
              )}
              {showPartialBottle && (
                <li className="font-medium text-amber-600 dark:text-amber-400">
                  Only consume {Math.round(lastBottlePercentage)}% of the last bottle
                </li>
              )}
            </ol>
          </div>
        </CardContent>
      </Card>
    );
  } else {
    // Separate bottles view for advanced mode
    // For the fueling bottle in advanced mode, we need to adjust display similarly
    const fuelingIngredients = [
      {
        name: "Maltodextrin",
        amount: fuelingBottle.maltodextrinAmount,
        unit: "g",
        color: "bg-green-500"
      },
      {
        name: "Fructose",
        amount: fuelingBottle.fructoseAmount,
        unit: "g",
        color: "bg-green-300"
      },
      {
        name: "Citric Acid",
        amount: fuelingBottle.citricAcidAmount,
        unit: "g",
        color: "bg-yellow-500"
      },
      {
        name: "Caffeine",
        amount: fuelingBottle.caffeineAmount,
        unit: "mg",
        color: "bg-red-500"
      }
    ];
    
    // Calculate exact bottle consumption for dual-bottle setup
    const hydrationBottlesNeededExact = (totalWaterRequired / 2) / hydrationBottle.waterAmount;
    const hydrationBottlesNeededWhole = Math.floor(hydrationBottlesNeededExact);
    const lastHydrationBottlePercentage = (hydrationBottlesNeededExact - hydrationBottlesNeededWhole) * 100;
    const showPartialHydrationBottle = lastHydrationBottlePercentage > 0 && lastHydrationBottlePercentage < 100;
    
    const fuelingBottlesNeededExact = (totalWaterRequired / 2) / fuelingBottle.waterAmount;
    const fuelingBottlesNeededWhole = Math.floor(fuelingBottlesNeededExact);
    const lastFuelingBottlePercentage = (fuelingBottlesNeededExact - fuelingBottlesNeededWhole) * 100;
    const showPartialFuelingBottle = lastFuelingBottlePercentage > 0 && lastFuelingBottlePercentage < 100;
    
    return (
      <Card className="formula-card h-full">
        <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-800 dark:to-blue-900">
          <CardTitle className="text-xl">Dual Bottle Strategy</CardTitle>
          <CardDescription>
            Optimized hydration and fueling bottles for maximum performance
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="hydration">Hydration</TabsTrigger>
              <TabsTrigger value="fueling">Fueling</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4 mt-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-md">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Beaker className="h-4 w-4" /> Dual Bottle Strategy
                </h3>
                <p className="text-sm text-muted-foreground">
                  This advanced approach separates your hydration needs from your fueling needs, 
                  similar to what pro cycling teams use in demanding races.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm">
                    <h4 className="text-sm font-medium text-blue-600 dark:text-blue-400">Hydration Bottle</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Focused on electrolyte replacement with minimal carbs
                    </p>
                    {bottlesNeeded > 1 && (
                      <div className="mt-2 text-xs">
                        <div className="font-medium">Prepare: {bottlesNeeded} bottles</div>
                        {showPartialHydrationBottle && (
                          <div className="text-amber-600">
                            Only drink {Math.round(lastHydrationBottlePercentage)}% of last bottle
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm">
                    <h4 className="text-sm font-medium text-green-600 dark:text-green-400">Fueling Bottle</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Optimized for energy delivery with maximum carbs
                    </p>
                    {bottlesNeeded > 1 && (
                      <div className="mt-2 text-xs">
                        <div className="font-medium">Prepare: {bottlesNeeded} bottles</div>
                        {showPartialFuelingBottle && (
                          <div className="text-amber-600">
                            Only drink {Math.round(lastFuelingBottlePercentage)}% of last bottle
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="pt-2 border-t mt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-2 bg-muted rounded-md">
                    <div className="text-sm text-muted-foreground">Bottles Needed</div>
                    <div className="text-xl font-semibold">{bottlesNeeded}</div>
                  </div>
                  <div className="text-center p-2 bg-muted rounded-md">
                    <div className="text-sm text-muted-foreground">Total Calories</div>
                    <div className="text-xl font-semibold">{totalCalories}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-md mt-4">
                <p className="font-medium flex items-center gap-2">
                  <Droplet className="h-4 w-4 text-blue-500" />
                  <span>Total Hydration Needs: {Math.round(totalWaterRequired)} ml</span>
                </p>
                
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <p className="text-sm font-medium">Hydration Bottles:</p>
                    <ul className="text-xs text-muted-foreground space-y-1 mt-1 list-disc list-inside">
                      <li>Full bottles: {hydrationBottlesNeededWhole}</li>
                      {showPartialHydrationBottle && (
                        <li>Last bottle: {Math.round(lastHydrationBottlePercentage)}%</li>
                      )}
                      <li className="font-medium text-blue-600">Prepare: {bottlesNeeded}</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Fueling Bottles:</p>
                    <ul className="text-xs text-muted-foreground space-y-1 mt-1 list-disc list-inside">
                      <li>Full bottles: {fuelingBottlesNeededWhole}</li>
                      {showPartialFuelingBottle && (
                        <li>Last bottle: {Math.round(lastFuelingBottlePercentage)}%</li>
                      )}
                      <li className="font-medium text-blue-600">Prepare: {bottlesNeeded}</li>
                    </ul>
                  </div>
                </div>
                
                {(showPartialHydrationBottle || showPartialFuelingBottle) && (
                  <div className="mt-3 bg-amber-50 dark:bg-amber-900/20 p-2 rounded border border-amber-200 dark:border-amber-800">
                    <p className="text-xs flex items-center gap-1 text-amber-700 dark:text-amber-400">
                      <AlertCircle className="h-3 w-3" />
                      <span>You won't need to consume all prepared bottles completely.</span>
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="hydration" className="space-y-4 mt-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md mb-4">
                <h3 className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <Droplet className="h-4 w-4" /> Hydration Bottle
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Osmolality: {hydrationBottle.osmolality} mOsm/kg
                  ({hydrationBottle.osmolality < 270 ? 'Hypotonic' : hydrationBottle.osmolality <= 290 ? 'Isotonic' : 'Hypertonic'})
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-3 h-3 rounded-full bg-blue-100 border border-blue-300"></span>
                    Water
                  </span>
                  <span>{hydrationBottle.waterAmount} ml</span>
                </div>
                
                <div className="flex items-center justify-between text-sm font-medium">
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
                    Sodium Citrate
                  </span>
                  <span>{hydrationBottle.sodiumCitrateAmount} g</span>
                </div>
                
                <div className="flex items-center justify-between text-sm font-medium">
                  <span className="flex items-center gap-1">
                     <span className="inline-block w-3 h-3 rounded-full bg-yellow-500"></span>
                     Citric Acid
                   </span>
                  <span>{hydrationBottle.citricAcidAmount} g</span>
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-md mt-4">
                <p className="font-medium flex items-center gap-2">
                  <Droplet className="h-4 w-4 text-blue-500" />
                  <span>Hydration Bottle Consumption:</span>
                </p>
                
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Total hydration required:</span>
                    <span className="font-medium">{Math.round(totalWaterRequired / 2)} ml</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span>Bottle capacity:</span>
                    <span className="font-medium">{hydrationBottle.waterAmount} ml</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span>Full bottles needed:</span>
                    <span className="font-medium">{hydrationBottlesNeededWhole}</span>
                  </div>
                  
                  {showPartialHydrationBottle && (
                    <div className="flex items-center justify-between text-sm">
                      <span>Last bottle consumption:</span>
                      <span className="font-medium">{Math.round(lastHydrationBottlePercentage)}%</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm font-medium text-blue-700 dark:text-blue-300">
                    <span>Total bottles to prepare:</span>
                    <span>{bottlesNeeded}</span>
                  </div>
                  
                  {showPartialHydrationBottle && (
                    <div className="mt-2 relative pt-1">
                      <div className="flex mb-1 items-center justify-between">
                        <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                          Last bottle consumption
                        </div>
                        <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                          {Math.round(lastHydrationBottlePercentage)}%
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-100">
                        <div style={{ width: `${lastHydrationBottlePercentage}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="rounded-md bg-blue-50 dark:bg-blue-900/30 p-3 text-sm mt-4">
                <p className="font-medium mb-1">Hydration Bottle Instructions:</p>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>Measure all electrolytes precisely</li>
                  <li>Add to your {hydrationBottle.waterAmount}ml bottle</li> 
                  <li>Shake thoroughly until dissolved</li>
                  <li>Label as "Hydration" and consume regularly</li>
                  {bottlesNeeded > 1 && (
                    <li className="font-medium text-blue-600 dark:text-blue-400">
                      Repeat for all {bottlesNeeded} bottles
                    </li>
                  )}
                  {showPartialHydrationBottle && (
                    <li className="font-medium text-amber-600 dark:text-amber-400">
                      Only consume {Math.round(lastHydrationBottlePercentage)}% of the last bottle
                    </li>
                  )}
                </ol>
              </div>
            </TabsContent>
            
            <TabsContent value="fueling" className="space-y-4 mt-4">
              <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-md mb-4">
                <h3 className="font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <Bike className="h-4 w-4" /> Fueling Bottle
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Osmolality: {fuelingBottle.osmolality} mOsm/kg
                  ({fuelingBottle.osmolality < 270 ? 'Hypotonic' : fuelingBottle.osmolality <= 290 ? 'Isotonic' : 'Hypertonic'})
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-3 h-3 rounded-full bg-blue-100 border border-blue-300"></span>
                    Water
                  </span>
                  <span>{fuelingBottle.waterAmount} ml</span>
                </div>
                
                {fuelingIngredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center justify-between text-sm font-medium">
                    <span className="flex items-center gap-1">
                      <span className={`inline-block w-3 h-3 rounded-full ${ingredient.color}`}></span>
                      {ingredient.name}
                    </span>
                    <span>{ingredient.amount} {ingredient.unit}</span>
                  </div>
                ))}
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-md mt-4">
                <p className="font-medium flex items-center gap-2">
                  <Droplet className="h-4 w-4 text-blue-500" />
                  <span>Fueling Bottle Consumption:</span>
                </p>
                
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Total fueling required:</span>
                    <span className="font-medium">{Math.round(totalWaterRequired / 2)} ml</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span>Bottle capacity:</span>
                    <span className="font-medium">{fuelingBottle.waterAmount} ml</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span>Full bottles needed:</span>
                    <span className="font-medium">{fuelingBottlesNeededWhole}</span>
                  </div>
                  
                  {showPartialFuelingBottle && (
                    <div className="flex items-center justify-between text-sm">
                      <span>Last bottle consumption:</span>
                      <span className="font-medium">{Math.round(lastFuelingBottlePercentage)}%</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm font-medium text-green-700 dark:text-green-300">
                    <span>Total bottles to prepare:</span>
                    <span>{bottlesNeeded}</span>
                  </div>
                  
                  {showPartialFuelingBottle && (
                    <div className="mt-2 relative pt-1">
                      <div className="flex mb-1 items-center justify-between">
                        <div className="text-xs font-semibold text-green-600 dark:text-green-400">
                          Last bottle consumption
                        </div>
                        <div className="text-xs font-semibold text-green-600 dark:text-green-400">
                          {Math.round(lastFuelingBottlePercentage)}%
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-green-100">
                        <div style={{ width: `${lastFuelingBottlePercentage}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="rounded-md bg-blue-50 dark:bg-blue-900/30 p-3 text-sm mt-4">
                <p className="font-medium mb-1">Fueling Bottle Instructions:</p>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>Measure all ingredients precisely</li>
                  <li>Add to your {fuelingBottle.waterAmount}ml bottle</li> 
                  <li>Shake thoroughly until dissolved</li>
                  <li>Label as "Fuel" and consume based on energy needs</li>
                  {bottlesNeeded > 1 && (
                    <li className="font-medium text-blue-600 dark:text-blue-400">
                      Repeat for all {bottlesNeeded} bottles
                    </li>
                  )}
                  {showPartialFuelingBottle && (
                    <li className="font-medium text-amber-600 dark:text-amber-400">
                      Only consume {Math.round(lastFuelingBottlePercentage)}% of the last bottle
                    </li>
                  )}
                </ol>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
  }
};

export default FormulaResult;
