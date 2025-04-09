
import React from 'react';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FormulaResult as FormulaResultType } from "@/lib/formula";

interface FormulaResultProps {
  formula: FormulaResultType;
  isMetric: boolean;
}

const FormulaResult: React.FC<FormulaResultProps> = ({ formula, isMetric }) => {
  const { 
    waterAmount, 
    sodiumCitrateAmount, 
    citricAcidAmount, 
    sugarAmount, 
    caffeineAmount, 
    totalRideTime, 
    totalCalories 
  } = formula;
  
  // Get the highest amount to normalize progress bars
  const maxAmount = Math.max(
    sodiumCitrateAmount, 
    citricAcidAmount, 
    sugarAmount,
    caffeineAmount * 10 // Scale up caffeine for visibility
  );
  
  const ingredients = [
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
      name: "Sugar",
      amount: sugarAmount,
      unit: "g",
      color: "bg-green-500",
      percentage: (sugarAmount / maxAmount) * 100
    },
    {
      name: "Caffeine",
      amount: caffeineAmount,
      unit: "mg",
      color: "bg-red-500",
      percentage: ((caffeineAmount * 10) / maxAmount) * 100 // Scale up for visibility
    }
  ];
  
  return (
    <Card className="formula-card h-full">
      <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-800 dark:to-blue-900">
        <CardTitle className="text-xl">Your Optimal Formula</CardTitle>
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
        
        <div className="rounded-md bg-blue-50 dark:bg-blue-900/30 p-3 text-sm mt-4">
          <p className="font-medium mb-1">Mix Instructions:</p>
          <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
            <li>Measure all ingredients precisely</li>
            <li>Add to your {formula.waterAmount}ml bottle</li> 
            <li>Shake thoroughly until dissolved</li>
            <li>Best consumed cold</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default FormulaResult;
