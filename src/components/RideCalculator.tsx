
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
import { useToast } from "@/components/ui/use-toast";
import { 
  Droplet, 
  Thermometer, 
  Clock, 
  Gauge, 
  Bike, 
  Calculator, 
  Printer, 
  Share2 
} from "lucide-react";
import FormulaResult from "./FormulaResult";
import { calculateFormula, FormulaResult as FormulaResultType } from "@/lib/formula";

// Define the shape of settings we'll store
interface SavedSettings {
  distance: number;
  temperature: number;
  sweatRate: string;
  intensity: string;
  bottleSize: number;
  isMetric: boolean;
}

// Storage key for localStorage
const STORAGE_KEY = 'ride-fuel-calculator-settings';

const RideCalculator = () => {
  const { toast } = useToast();
  const [distance, setDistance] = useState<number>(20);
  const [temperature, setTemperature] = useState<number>(70);
  const [sweatRate, setSweatRate] = useState<string>("medium");
  const [intensity, setIntensity] = useState<string>("medium");
  const [bottleSize, setBottleSize] = useState<number>(750);
  const [formula, setFormula] = useState<FormulaResultType | null>(null);
  const [isMetric, setIsMetric] = useState<boolean>(false);

  // Load saved settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    
    if (savedSettings) {
      try {
        const parsedSettings: SavedSettings = JSON.parse(savedSettings);
        
        // Update state with saved values
        setDistance(parsedSettings.distance);
        setTemperature(parsedSettings.temperature);
        setSweatRate(parsedSettings.sweatRate);
        setIntensity(parsedSettings.intensity);
        setBottleSize(parsedSettings.bottleSize);
        setIsMetric(parsedSettings.isMetric);
        
        // Calculate formula with loaded settings
        setTimeout(() => {
          calculateResultWithCurrentSettings(
            parsedSettings.distance,
            parsedSettings.temperature,
            parsedSettings.sweatRate,
            parsedSettings.intensity,
            parsedSettings.bottleSize,
            parsedSettings.isMetric
          );
        }, 0);
      } catch (error) {
        console.error('Error loading saved settings:', error);
      }
    } else {
      // No saved settings, calculate with defaults
      calculateResult();
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    // Only save after initial load
    const settings: SavedSettings = {
      distance,
      temperature,
      sweatRate,
      intensity,
      bottleSize,
      isMetric
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [distance, temperature, sweatRate, intensity, bottleSize, isMetric]);

  const calculateResultWithCurrentSettings = (
    currentDistance: number,
    currentTemperature: number,
    currentSweatRate: string,
    currentIntensity: string,
    currentBottleSize: number,
    currentIsMetric: boolean
  ) => {
    try {
      const result = calculateFormula({
        distance: currentIsMetric ? currentDistance : currentDistance * 1.60934, // Convert miles to km if needed
        temperature: currentIsMetric ? currentTemperature : (currentTemperature - 32) * 5/9, // Convert F to C if needed
        sweatRate: currentSweatRate,
        intensity: currentIntensity,
        bottleSize: currentBottleSize
      });

      setFormula(result);
      
      toast({
        title: "Formula Calculated!",
        description: "Your custom electrolyte mix is ready.",
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
      distance,
      temperature,
      sweatRate,
      intensity,
      bottleSize,
      isMetric
    );
  };

  const handleUnitToggle = () => {
    if (isMetric) {
      // Convert from metric to imperial
      setDistance(Math.round(distance / 1.60934));
      setTemperature(Math.round(temperature * 9/5 + 32));
    } else {
      // Convert from imperial to metric
      setDistance(Math.round(distance * 1.60934));
      setTemperature(Math.round((temperature - 32) * 5/9));
    }
    setIsMetric(!isMetric);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold text-primary flex items-center gap-2">
                <Bike className="h-8 w-8" /> Ride Fuel Formula
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Calculate your perfect electrolyte drink for cycling
              </CardDescription>
            </div>
            <Button variant="outline" onClick={handleUnitToggle}>
              {isMetric ? "Switch to Imperial" : "Switch to Metric"}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6 grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="distance" className="flex items-center gap-2">
                    <Bike className="h-4 w-4" /> Ride Distance
                  </Label>
                  <span className="text-muted-foreground text-sm">
                    {distance} {isMetric ? "km" : "miles"}
                  </span>
                </div>
                <Slider
                  id="distance"
                  min={isMetric ? 5 : 3}
                  max={isMetric ? 300 : 200} // Updated max distance
                  step={isMetric ? 5 : 5}
                  value={[distance]}
                  onValueChange={(value) => setDistance(value[0])}
                  className="py-4"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="temperature" className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4" /> Temperature
                  </Label>
                  <span className="text-muted-foreground text-sm">
                    {temperature}° {isMetric ? "C" : "F"}
                  </span>
                </div>
                <Slider
                  id="temperature"
                  min={isMetric ? 0 : 32} // Updated min temp 
                  max={isMetric ? 45 : 110} // Updated max temp
                  step={1}
                  value={[temperature]}
                  onValueChange={(value) => setTemperature(value[0])}
                  className="py-4"
                />
              </div>
              
              <div>
                <Label htmlFor="sweat-rate" className="flex items-center gap-2 mb-2">
                  <Droplet className="h-4 w-4" /> Sweat Rate
                </Label>
                <Select value={sweatRate} onValueChange={setSweatRate}>
                  <SelectTrigger id="sweat-rate">
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
                <Label htmlFor="intensity" className="flex items-center gap-2 mb-2">
                  <Gauge className="h-4 w-4" /> Ride Intensity
                </Label>
                <Select value={intensity} onValueChange={setIntensity}>
                  <SelectTrigger id="intensity">
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
                  <Label htmlFor="bottle-size" className="flex items-center gap-2">
                    <Droplet className="h-4 w-4" /> Bottle Size
                  </Label>
                  <span className="text-muted-foreground text-sm">
                    {bottleSize} ml
                  </span>
                </div>
                <Select value={bottleSize.toString()} onValueChange={(value) => setBottleSize(Number(value))}>
                  <SelectTrigger id="bottle-size">
                    <SelectValue placeholder="Select your bottle size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="500">500 ml</SelectItem>
                    <SelectItem value="750">750 ml (Standard)</SelectItem>
                    <SelectItem value="1000">1000 ml (1 Liter)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                className="w-full mt-4" 
                size="lg" 
                onClick={calculateResult}
              >
                <Calculator className="mr-2 h-4 w-4" /> Calculate Formula
              </Button>
            </div>

            <div>
              {formula && <FormulaResult formula={formula} isMetric={isMetric} />}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="bg-muted/50 flex justify-between gap-2 flex-wrap">
          <div className="text-xs text-muted-foreground">
            Formulas based on sport science recommendations for cyclists
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RideCalculator;
