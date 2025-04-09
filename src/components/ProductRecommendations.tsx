
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, ShoppingCart, Beaker } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProductRecommendations = () => {
  const basicProducts = [
    {
      name: "Sodium Citrate Powder",
      description: "Food Grade, Non-GMO - 2LB (32.4oz)",
      brand: "Nutricost",
      link: "https://www.amazon.com/dp/B096H1K287?smid=A2YD2H3KGK1F4L",
      image: "/placeholder.svg"
    },
    {
      name: "Citric Acid Powder",
      description: "Non-GMO, Gluten Free - 1LB",
      brand: "Nutricost",
      link: "https://www.amazon.com/dp/B08NXXMWH7?smid=A2YD2H3KGK1F4L",
      image: "/placeholder.svg"
    },
    {
      name: "Caffeine Pills",
      description: "100mg Per Serving - 250 Capsules",
      brand: "Nutricost",
      link: "https://www.amazon.com/dp/B01MY5CW7S?smid=A2YD2H3KGK1F4L",
      image: "/placeholder.svg"
    }
  ];
  
  const advancedProducts = [
    {
      name: "Organic Maltodextrin Powder",
      description: "Gluten Free, Non-GMO - 1LB",
      brand: "Nutricost",
      link: "https://www.amazon.com/Nutricost-Organic-Maltodextrin-Powder-1lb/dp/B07YBK6DQP?sr=8-2-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY",
      image: "/placeholder.svg"
    },
    {
      name: "Fructose Powder",
      description: "Pure Fruit Sugar - 1LB",
      brand: "AnthonysGoods",
      link: "https://www.amazon.com/Anthonys-Organic-Fructose-Sweetener-Friendly/dp/B082BKXM7M",
      image: "/placeholder.svg"
    },
    {
      name: "Potassium Chloride",
      description: "Food Grade - 8oz",
      brand: "Pure Organic",
      link: "https://www.amazon.com/Potassium-Chloride-FCC-Food-Grade/dp/B00ENKUR56",
      image: "/placeholder.svg"
    },
    {
      name: "Calcium Citrate",
      description: "Pure Powder - 8oz",
      brand: "BulkSupplements",
      link: "https://www.amazon.com/Pure-Calcium-Citrate-Powder-Supplement/dp/B00F8I5ZAQ",
      image: "/placeholder.svg"
    },
    {
      name: "Magnesium Citrate",
      description: "Pure Powder - 10oz",
      brand: "BulkSupplements",
      link: "https://www.amazon.com/BulkSupplements-Magnesium-Citrate-Powder-Grams/dp/B00F8I5QYM",
      image: "/placeholder.svg"
    },
    {
      name: "Digital Scale (0.01g)",
      description: "Precision Scale for Supplements",
      brand: "Weigh Gram",
      link: "https://www.amazon.com/Weigh-Gram-Digital-Jewelry-Kitchen/dp/B06Y61YW7S",
      image: "/placeholder.svg"
    }
  ];

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <ShoppingCart className="h-6 w-6" /> Get Your Ingredients
        </CardTitle>
        <CardDescription className="text-base">
          Everything you need to make your own electrolyte drink
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-6">
            <TabsTrigger value="basic">Basic Formula</TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-1">
              <Beaker className="h-4 w-4" /> Advanced Formula
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {basicProducts.map((product, index) => (
                <Card key={index} className="formula-card overflow-hidden border-2 hover:border-primary/50 transition-all">
                  <div className="h-48 overflow-hidden bg-gray-100 flex items-center justify-center">
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-24 h-24 object-contain mb-2 opacity-40"
                      />
                      <span className="text-sm font-medium text-gray-500">{product.name}</span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.brand}</p>
                    <p className="mt-2 text-sm">{product.description}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button 
                      variant="secondary" 
                      className="w-full" 
                      onClick={() => window.open(product.link, '_blank')}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" /> 
                      View on Amazon
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-muted rounded-lg text-sm">
              <p className="font-medium">Don't forget:</p>
              <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
                <li>Regular table sugar is perfect for the carbohydrate component</li>
                <li>A digital scale is essential for precise measurements</li>
                <li>You'll need a funnel to easily transfer ingredients to your bottles</li>
                <li>Consider getting small storage containers to pre-mix your formulae</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-md mb-6">
              <h3 className="font-medium flex items-center gap-2 mb-2">
                <Beaker className="h-4 w-4" /> Advanced Formulation Components
              </h3>
              <p className="text-sm text-muted-foreground">
                These specialized ingredients allow you to create a scientifically optimized 
                formula with precise carbohydrate ratios and a complete electrolyte profile.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {advancedProducts.map((product, index) => (
                <Card key={index} className="formula-card overflow-hidden border-2 hover:border-primary/50 transition-all">
                  <div className="h-48 overflow-hidden bg-gray-100 flex items-center justify-center">
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-24 h-24 object-contain mb-2 opacity-40"
                      />
                      <span className="text-sm font-medium text-gray-500">{product.name}</span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.brand}</p>
                    <p className="mt-2 text-sm">{product.description}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button 
                      variant="secondary" 
                      className="w-full" 
                      onClick={() => window.open(product.link, '_blank')}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" /> 
                      View on Amazon
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-muted rounded-lg text-sm">
              <p className="font-medium">Pro Tips:</p>
              <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
                <li>A precise 0.01g scale is essential for measuring the smaller quantities</li>
                <li>Pre-mix your electrolytes in the correct ratio for easier bottle preparation</li>
                <li>Label your bottles clearly when using separate hydration and fueling strategies</li>
                <li>Consider testing your formulas during training before using in competition</li>
                <li>Maltodextrin is less sweet than sugar but provides similar energy</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProductRecommendations;
