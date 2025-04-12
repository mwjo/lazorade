
import React from 'react';
import RideCalculator from '@/components/RideCalculator';
import ProductRecommendations from '@/components/ProductRecommendations';

const Index = () => {
  return (
    <div className="min-h-screen gradient-bg py-8">
      <header className="max-w-4xl mx-auto text-center mb-8">
        <div className="lazorade-logo-container mb-4">
          <img 
            src="/lovable-uploads/eca27909-e5e8-4e1d-9200-1c7294458686.png" 
            alt="Lazorade Sports Drink" 
            className="lazorade-logo w-48 md:w-56"
          />
        </div>
        
        <div className="lazorade-hero mb-8 electric-border">
          <div className="lazorade-hero-content">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              <span className="lazorade-gradient-text">Ride Fuel</span> <span className="lazorade-blue-gradient-text">Formula</span>
            </h1>
            <p className="text-xl text-white/90 mt-2 max-w-2xl mx-auto px-4">
              Create the perfect electrolyte drink for your cycling adventures
            </p>
            <p className="text-lg text-white/80 font-semibold mt-4">
              FUEL THE LAZOR. CONQUER THE CLIMB.
            </p>
          </div>
        </div>
        
        <p className="text-sm text-white/70 mt-1 italic">
          Created by the one and only{' '}
          <a 
            href="https://www.strava.com/athletes/118869817" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-secondary hover:text-secondary/80 underline"
          >
            Peter Lazorchak
          </a>
        </p>
      </header>
      
      <main className="space-y-12">
        <RideCalculator />
        
        <div className="w-full max-w-4xl mx-auto p-4">
          <ProductRecommendations />
        </div>
      </main>
      
      <footer className="max-w-4xl mx-auto mt-12 text-center text-sm text-white/50 p-4">
        <div className="lightning-divider my-6 max-w-md mx-auto"></div>
        <p>
          Designed for cyclists by cyclists. Use these formulas at your own discretion.
        </p>
        <p className="mt-2">
          © {new Date().getFullYear()} Lazorade Sports Drink | Ride Fuel Formula Calculator
        </p>
      </footer>
    </div>
  );
};

export default Index;
