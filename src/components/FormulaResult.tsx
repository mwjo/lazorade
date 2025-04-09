
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
import { Bike, Droplet, Beaker } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface FormulaResultProps {
  formula: FormulaResultType;
  isMetric: boolean;
  isAdvanced: boolean;
}

const FormulaResult: React.FC<FormulaResultProps> = ({ formula, isMetric, isAdvanced }) => {
  const { 
    waterAmount, 
    sodiumCitrateAmount, 
    potassiumAmount,
    calciumAmount,
    magnesiumAmount,
    citricAcidAmount, 
    maltodextrinAmount,
    fructoseAmount,
    caffeineAmount, 
    totalRideTime, 
    totalCalories,
    bottlesNeeded,
    osmolality,
    hydrationBottle,
    fuelingBottle
  } = formula;
  
  // Get the highest amount to normalize progress bars
  const maxAmount = Math.max(
    sodiumCitrateAmount, 
    citricAcidAmount, 
    maltodextrinAmount,
    fructoseAmount,
    caffeineAmount * 10 // Scale up caffeine for visibility
  );
  
  // Define ingredients for standard single bottle
  const ingredients = [
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
  
  // Add additional electrolytes for advanced view
  if (isAdvanced) {
    ingredients.push(
      {
        name: "Potassium",
        amount: potassiumAmount,
        unit: "mg",
        color: "bg-purple-500",
        percentage: (potassiumAmount / 10 / maxAmount) * 100
      },
      {
        name: "Calcium",
        amount: calciumAmount,
        unit: "mg",
        color: "bg-orange-500",
        percentage: (calciumAmount / 10 / maxAmount) * 100
      },
      {
        name: "Magnesium",
        amount: magnesiumAmount,
        unit: "mg",
        color: "bg-indigo-500",
        percentage: (magnesiumAmount / 10 / maxAmount) * 100
      }
    );
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
                <div className="text-sm text-muted-foreground">Ride Time</div>
                <div className="text-xl font-semibold">
                  {totalRideTime} {isMetric ? "hours" : "hours"}
                </div>
              </div>
              <div className="text-center p-2 bg-muted rounded-md">
                <div className="text-sm text-muted-foreground">Calories</div>
                <div className="text-xl font-semibold">{totalCalories}</div>
              </div>
            </div>
          </div>
          
          {bottlesNeeded > 1 && (
            <div className="bg-amber-50 dark:bg-amber-900/30 p-3 rounded-md mt-4">
              <p className="font-medium flex items-center gap-2">
                <Droplet className="h-4 w-4 text-blue-500" />
                <span>You'll need <strong>{bottlesNeeded} bottles</strong> for this ride!</span>
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Make sure to prepare enough mix for all your bottles using the formula below.
              </p>
            </div>
          )}
          
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
            </ol>
          </div>
        </CardContent>
      </Card>
    );
  } else {
    // Separate bottles view for advanced mode
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
                  </div>
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm">
                    <h4 className="text-sm font-medium text-green-600 dark:text-green-400">Fueling Bottle</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Optimized for energy delivery with maximum carbs
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-2 border-t mt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-2 bg-muted rounded-md">
                    <div className="text-sm text-muted-foreground">Ride Time</div>
                    <div className="text-xl font-semibold">{totalRideTime} hours</div>
                  </div>
                  <div className="text-center p-2 bg-muted rounded-md">
                    <div className="text-sm text-muted-foreground">Total Calories</div>
                    <div className="text-xl font-semibold">{totalCalories}</div>
                  </div>
                </div>
              </div>
              
              {bottlesNeeded > 1 && (
                <div className="bg-amber-50 dark:bg-amber-900/30 p-3 rounded-md">
                  <p className="font-medium flex items-center gap-2">
                    <Droplet className="h-4 w-4 text-blue-500" />
                    <span>You'll need <strong>{bottlesNeeded * 2}</strong> bottles for this ride!</span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {bottlesNeeded} hydration bottles and {bottlesNeeded} fueling bottles.
                  </p>
                </div>
              )}
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
                    <span className="inline-block w-3 h-3 rounded-full bg-purple-500"></span>
                    Potassium
                  </span>
                  <span>{hydrationBottle.potassiumAmount} mg</span>
                </div>
                
                <div className="flex items-center justify-between text-sm font-medium">
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-3 h-3 rounded-full bg-orange-500"></span>
                    Calcium
                  </span>
                  <span>{hydrationBottle.calciumAmount} mg</span>
                </div>
                
                <div className="flex items-center justify-between text-sm font-medium">
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-3 h-3 rounded-full bg-indigo-500"></span>
                    Magnesium
                  </span>
                  <span>{hydrationBottle.magnesiumAmount} mg</span>
                </div>
                
                <div className="flex items-center justify-between text-sm font-medium">
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-3 h-3 rounded-full bg-yellow-500"></span>
                    Citric Acid
                  </span>
                  <span>{hydrationBottle.citricAcidAmount} g</span>
                </div>
              </div>
              
              <div className="rounded-md bg-blue-50 dark:bg-blue-900/30 p-3 text-sm mt-4">
                <p className="font-medium mb-1">Hydration Bottle Instructions:</p>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>Measure all electrolytes precisely</li>
                  <li>Add to your {hydrationBottle.waterAmount}ml bottle</li> 
                  <li>Shake thoroughly until dissolved</li>
                  <li>Label as "Hydration" and consume regularly</li>
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
                
                <div className="flex items-center justify-between text-sm font-medium">
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                    Maltodextrin
                  </span>
                  <span>{fuelingBottle.maltodextrinAmount} g</span>
                </div>
                
                <div className="flex items-center justify-between text-sm font-medium">
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-3 h-3 rounded-full bg-green-300"></span>
                    Fructose
                  </span>
                  <span>{fuelingBottle.fructoseAmount} g</span>
                </div>
                
                <div className="flex items-center justify-between text-sm font-medium">
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-3 h-3 rounded-full bg-yellow-500"></span>
                    Citric Acid
                  </span>
                  <span>{fuelingBottle.citricAcidAmount} g</span>
                </div>
                
                <div className="flex items-center justify-between text-sm font-medium">
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
                    Caffeine
                  </span>
                  <span>{fuelingBottle.caffeineAmount} mg</span>
                </div>
              </div>
              
              <div className="rounded-md bg-blue-50 dark:bg-blue-900/30 p-3 text-sm mt-4">
                <p className="font-medium mb-1">Fueling Bottle Instructions:</p>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>Measure all ingredients precisely</li>
                  <li>Add to your {fuelingBottle.waterAmount}ml bottle</li> 
                  <li>Shake thoroughly until dissolved</li>
                  <li>Label as "Fuel" and consume based on energy needs</li>
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
