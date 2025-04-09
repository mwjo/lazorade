
import React from 'react';
import RideCalculator from '@/components/RideCalculator';
import ProductRecommendations from '@/components/ProductRecommendations';

const Index = () => {
  return (
    <div className="min-h-screen gradient-bg py-8">
      <header className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold text-primary">Ride Fuel Formula</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Create the perfect electrolyte drink for your cycling adventures
        </p>
      </header>
      
      <main className="space-y-12">
        <RideCalculator />
        
        <div className="w-full max-w-4xl mx-auto p-4">
          <ProductRecommendations />
        </div>
      </main>
      
      <footer className="max-w-4xl mx-auto mt-12 text-center text-sm text-muted-foreground p-4">
        <p>
          Designed for cyclists by cyclists. Use these formulas at your own discretion.
        </p>
        <p className="mt-2">
          © {new Date().getFullYear()} Ride Fuel Formula Calculator
        </p>
      </footer>
    </div>
  );
};

export default Index;
