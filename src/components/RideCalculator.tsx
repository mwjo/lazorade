import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { 
  Droplet, 
  Thermometer, 
  Clock, 
  Gauge, 
  Bike, 
  Calculator, 
  Printer, 
  Share2,
  ChevronDown,
  Beaker,
  TestTube,
  Sparkles,
  Coffee,
  Zap
} from "lucide-react";
import FormulaResult from "./FormulaResult";
import { calculateFormula, FormulaResult as FormulaResultType } from "@/lib/formula";

interface SavedSettings {
  duration: number;
  temperature: number;
  sweatRate: string;
  intensity: string;
  bottleSize: number;
  isMetric: boolean;
  isAdvanced: boolean;
  carbRatio: string;
  carbAdaptation: string;
  separateBottles: boolean;
  caffeineTolerance?: string;
}

const STORAGE_KEY = 'ride-fuel-calculator-settings';

const RideCalculator = () => {
  const { toast } = useToast();

  const [duration, setDuration] = useState<number>(2);
  const [temperature, setTemperature] = useState<number>(70);
  const [sweatRate, setSweatRate] = useState<string>("medium");
  const [intensity, setIntensity] = useState<string>("medium");
  const [bottleSize, setBottleSize] = useState<number>(750);
  const [isMetric, setIsMetric] = useState<boolean>(false);

  const [isAdvanced, setIsAdvanced] = useState<boolean>(false);
  const [carbRatio, setCarbRatio] = useState<string>("maltodextrin-dominant");
  const [carbAdaptation, setCarbAdaptation] = useState<string>("medium");
  const [separateBottles, setSeparateBottles] = useState<boolean>(false);
  const [caffeineTolerance, setCaffeineTolerance] = useState<string>("medium");

  const [formula, setFormula] = useState<FormulaResultType | null>(null);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState<boolean>(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    
    if (savedSettings) {
      try {
        const parsedSettings: SavedSettings = JSON.parse(savedSettings);
        
        setDuration(parsedSettings.duration || 2);
        setTemperature(parsedSettings.temperature);
        setSweatRate(parsedSettings.sweatRate);
        setIntensity(parsedSettings.intensity);
        setBottleSize(parsedSettings.bottleSize);
        setIsMetric(parsedSettings.isMetric);
        
        if ('isAdvanced' in parsedSettings) {
          setIsAdvanced(parsedSettings.isAdvanced);
          setCarbRatio(parsedSettings.carbRatio || "maltodextrin-dominant");
          setCarbAdaptation(parsedSettings.carbAdaptation || "medium");
          setSeparateBottles(parsedSettings.separateBottles || false);
          setCaffeineTolerance(parsedSettings.caffeineTolerance || "medium");
        }
        
        setTimeout(() => {
          calculateResultWithCurrentSettings(
            parsedSettings.duration || 2,
            parsedSettings.temperature,
            parsedSettings.sweatRate,
            parsedSettings.intensity,
            parsedSettings.bottleSize,
            parsedSettings.isMetric,
            parsedSettings.isAdvanced || false,
            parsedSettings.carbRatio || "maltodextrin-dominant",
            parsedSettings.carbAdaptation || "medium",
            parsedSettings.separateBottles || false,
            parsedSettings.caffeineTolerance || "medium"
          );
        }, 0);
      } catch (error) {
        console.error('Error loading saved settings:', error);
      }
    } else {
      calculateResult();
    }
  }, []);

  useEffect(() => {
    const settings: SavedSettings = {
      duration,
      temperature,
      sweatRate,
      intensity,
      bottleSize,
      isMetric,
      isAdvanced,
      carbRatio,
      carbAdaptation,
      separateBottles,
      caffeineTolerance
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [
    duration, 
    temperature, 
    sweatRate, 
    intensity, 
    bottleSize, 
    isMetric,
    isAdvanced,
    carbRatio,
    carbAdaptation,
    separateBottles,
    caffeineTolerance
  ]);

  const calculateResultWithCurrentSettings = (
    currentDuration: number,
    currentTemperature: number,
    currentSweatRate: string,
    currentIntensity: string,
    currentBottleSize: number,
    currentIsMetric: boolean,
    currentIsAdvanced: boolean,
    currentCarbRatio: string,
    currentCarbAdaptation: string,
    currentSeparateBottles: boolean,
    currentCaffeineTolerance: string
  ) => {
    try {
      const result = calculateFormula({
        duration: currentDuration,
        temperature: currentIsMetric ? currentTemperature : (currentTemperature - 32) * 5/9,
        sweatRate: currentSweatRate,
        intensity: currentIntensity,
        bottleSize: currentBottleSize,
        isAdvanced: currentIsAdvanced,
        carbRatio: currentCarbRatio,
        carbAdaptation: currentCarbAdaptation,
        separateBottles: currentSeparateBottles,
        caffeineTolerance: currentCaffeineTolerance
      });

      setFormula(result);
      
      toast({
        title: "Formula Calculated!",
        description: currentIsAdvanced 
          ? "Your advanced custom electrolyte mix is ready." 
          : "Your custom electrolyte mix is ready.",
      });
    } catch (error) {
      toast({
        title: "Calculation Error",
        description: "There was a problem calculating your formula. Please check your inputs.",
        variant: "destructive"
      });
    }
  };

  const calculateResult = () => {
    calculateResultWithCurrentSettings(
      duration,
      temperature,
      sweatRate,
      intensity,
      bottleSize,
      isMetric,
      isAdvanced,
      carbRatio,
      carbAdaptation,
      separateBottles,
      caffeineTolerance
    );
  };

  const handleUnitToggle = () => {
    if (isMetric) {
      setTemperature(Math.round(temperature * 9/5 + 32));
    } else {
      setTemperature(Math.round((temperature - 32) * 5/9));
    }
    setIsMetric(!isMetric);
  };

  const toggleAdvancedMode = () => {
    setIsAdvanced(!isAdvanced);
    
    if (!isAdvanced) {
      setIsAdvancedOpen(true);
    }
    
    setTimeout(calculateResult, 0);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card className="shadow-lg electric-border">
        <CardHeader className="lazorade-card-header">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-3xl font-bold flex items-center gap-2">
                <Zap className="h-8 w-8 text-secondary" /> 
                <span className="lazorade-gradient-text">Ride Fuel</span> 
                <span className="lazorade-blue-gradient-text">Formula</span>
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Calculate your perfect electrolyte drink for cycling
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="advanced-mode" 
                  checked={isAdvanced}
                  onCheckedChange={toggleAdvancedMode}
                />
                <Label htmlFor="advanced-mode" className="flex items-center gap-1 text-white/90">
                  <Beaker className="h-4 w-4 text-accent" />
                  Advanced Mode
                </Label>
              </div>
              <Button variant="outline" onClick={handleUnitToggle} className="border-secondary/30 text-white/90 hover:bg-secondary/10">
                {isMetric ? "Switch to Imperial" : "Switch to Metric"}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6 grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="duration" className="flex items-center gap-2 text-white/90">
                    <Clock className="h-4 w-4 text-accent" /> Ride Duration
                  </Label>
                  <span className="text-muted-foreground text-sm">
                    {duration} {duration === 1 ? "hour" : "hours"}
                  </span>
                </div>
                <Slider
                  id="duration"
                  min={0.5}
                  max={10}
                  step={0.5}
                  value={[duration]}
                  onValueChange={(value) => setDuration(value[0])}
                  className="py-4"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="temperature" className="flex items-center gap-2 text-white/90">
                    <Thermometer className="h-4 w-4 text-accent" /> Temperature
                  </Label>
                  <span className="text-muted-foreground text-sm">
                    {temperature}° {isMetric ? "C" : "F"}
                  </span>
                </div>
                <Slider
                  id="temperature"
                  min={isMetric ? 0 : 32}
                  max={isMetric ? 45 : 110}
                  step={1}
                  value={[temperature]}
                  onValueChange={(value) => setTemperature(value[0])}
                  className="py-4"
                />
              </div>
              
              <div>
                <Label htmlFor="sweat-rate" className="flex items-center gap-2 mb-2 text-white/90">
                  <Droplet className="h-4 w-4 text-accent" /> Sweat Rate
                </Label>
                <Select value={sweatRate} onValueChange={setSweatRate}>
                  <SelectTrigger id="sweat-rate" className="bg-background/10 border-secondary/30">
                    <SelectValue placeholder="Select sweat rate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Barely Notice</SelectItem>
                    <SelectItem value="medium">Medium - Average Sweating</SelectItem>
                    <SelectItem value="high">High - Heavy Sweating</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="intensity" className="flex items-center gap-2 mb-2 text-white/90">
                  <Gauge className="h-4 w-4 text-accent" /> Ride Intensity
                </Label>
                <Select value={intensity} onValueChange={setIntensity}>
                  <SelectTrigger id="intensity" className="bg-background/10 border-secondary/30">
                    <SelectValue placeholder="Select intensity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Easy Ride</SelectItem>
                    <SelectItem value="medium">Medium - Moderate Effort</SelectItem>
                    <SelectItem value="high">High - Racing/Training Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="bottle-size" className="flex items-center gap-2 text-white/90">
                    <Droplet className="h-4 w-4 text-accent" /> Bottle Size
                  </Label>
                  <span className="text-muted-foreground text-sm">
                    {bottleSize} ml
                  </span>
                </div>
                <Select value={bottleSize.toString()} onValueChange={(value) => setBottleSize(Number(value))}>
                  <SelectTrigger id="bottle-size" className="bg-background/10 border-secondary/30">
                    <SelectValue placeholder="Select your bottle size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="500">500 ml</SelectItem>
                    <SelectItem value="750">750 ml (Standard)</SelectItem>
                    <SelectItem value="1000">1000 ml (1 Liter)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {isAdvanced && (
                <Collapsible
                  open={isAdvancedOpen}
                  onOpenChange={setIsAdvancedOpen}
                  className="mt-6 border rounded-md p-2 border-secondary/30 bg-background/5"
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="flex items-center justify-between w-full text-white/90">
                      <span className="flex items-center gap-2">
                        <Beaker className="h-4 w-4 text-secondary" />
                        Advanced Options
                      </span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${isAdvancedOpen ? "transform rotate-180" : ""}`} />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4 space-y-4 px-2">
                    <div>
                      <Label htmlFor="carb-ratio" className="flex items-center gap-2 mb-2 text-white/90">
                        <TestTube className="h-4 w-4 text-accent" /> Carbohydrate Ratio
                      </Label>
                      <Select value={carbRatio} onValueChange={setCarbRatio}>
                        <SelectTrigger id="carb-ratio" className="bg-background/10 border-secondary/30">
                          <SelectValue placeholder="Select carb ratio" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="maltodextrin-dominant">Maltodextrin-Dominant (1:0.8)</SelectItem>
                          <SelectItem value="balanced">Balanced (1:1)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-white/60 mt-1">
                        The ratio of glucose (maltodextrin) to fructose affects absorption rate
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="carb-adaptation" className="flex items-center gap-2 mb-2 text-white/90">
                        <Sparkles className="h-4 w-4 text-accent" /> Carb Training Adaptation
                      </Label>
                      <Select value={carbAdaptation} onValueChange={setCarbAdaptation}>
                        <SelectTrigger id="carb-adaptation" className="bg-background/10 border-secondary/30">
                          <SelectValue placeholder="Select carb adaptation level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low (New to carb training)</SelectItem>
                          <SelectItem value="medium">Medium (Some training)</SelectItem>
                          <SelectItem value="high">High (Well-trained gut)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-white/60 mt-1">
                        Your ability to process carbs during exercise
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="caffeine-tolerance" className="flex items-center gap-2 mb-2 text-white/90">
                        <Coffee className="h-4 w-4 text-accent" /> Caffeine Tolerance
                      </Label>
                      <Select value={caffeineTolerance} onValueChange={setCaffeineTolerance}>
                        <SelectTrigger id="caffeine-tolerance" className="bg-background/10 border-secondary/30">
                          <SelectValue placeholder="Select caffeine tolerance" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low (Sensitive to caffeine)</SelectItem>
                          <SelectItem value="medium">Medium (Average response)</SelectItem>
                          <SelectItem value="high">High (Regular caffeine user)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-white/60 mt-1">
                        How well you tolerate caffeine during exercise
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 pt-2">
                      <Switch 
                        id="separate-bottles" 
                        checked={separateBottles}
                        onCheckedChange={setSeparateBottles}
                      />
                      <Label htmlFor="separate-bottles" className="text-white/90">Separate Hydration & Fueling Bottles</Label>
                    </div>
                    <p className="text-xs text-white/60 mt-1">
                      Pro approach: one bottle optimized for hydration, one for energy
                    </p>
                  </CollapsibleContent>
                </Collapsible>
              )}
              
              <Button 
                className="w-full mt-4 lazorade-button text-black font-bold"
                size="lg" 
                onClick={calculateResult}
              >
                <Calculator className="mr-2 h-4 w-4" /> Calculate Formula
              </Button>
            </div>

            <div>
              {formula && <FormulaResult formula={formula} isMetric={isMetric} isAdvanced={isAdvanced} />}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="bg-muted/10 flex justify-between gap-2 flex-wrap border-t border-secondary/20">
          <div className="text-xs text-white/50">
            {isAdvanced 
              ? "Advanced formulas based on latest sport science research for cyclists"
              : "Formulas based on sport science recommendations for cyclists"
            }
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-secondary/30 text-white/90 hover:bg-secondary/10">
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
            <Button variant="outline" size="sm" className="border-secondary/30 text-white/90 hover:bg-secondary/10">
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RideCalculator;
