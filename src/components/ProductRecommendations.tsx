
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
import { ExternalLink, ShoppingCart } from 'lucide-react';

const ProductRecommendations = () => {
  const products = [
    {
      name: "Sodium Citrate Powder",
      description: "Food Grade, Non-GMO - 2LB (32.4oz)",
      brand: "Nutricost",
      link: "https://www.amazon.com/dp/B096H1K287?smid=A2YD2H3KGK1F4L",
      image: "https://m.media-amazon.com/images/I/61sS8k9uuGL._AC_SL1500_.jpg"
    },
    {
      name: "Citric Acid Powder",
      description: "Non-GMO, Gluten Free - 1LB",
      brand: "Nutricost",
      link: "https://www.amazon.com/dp/B08NXXMWH7?smid=A2YD2H3KGK1F4L",
      image: "https://m.media-amazon.com/images/I/61G-33TrPOL._AC_SL1500_.jpg"
    },
    {
      name: "Caffeine Pills",
      description: "100mg Per Serving - 250 Capsules",
      brand: "Nutricost",
      link: "https://www.amazon.com/dp/B01MY5CW7S?smid=A2YD2H3KGK1F4L",
      image: "https://m.media-amazon.com/images/I/61W7qLgPGQL._AC_SL1500_.jpg"
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((product, index) => (
            <Card key={index} className="formula-card overflow-hidden">
              <div className="h-48 overflow-hidden bg-gray-100 flex items-center justify-center">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-contain p-4"
                />
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
      </CardContent>
    </Card>
  );
};

export default ProductRecommendations;
