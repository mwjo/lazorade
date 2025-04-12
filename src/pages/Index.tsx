
import React from 'react';
import RideCalculator from '@/components/RideCalculator';
import ProductRecommendations from '@/components/ProductRecommendations';

const Index = () => {
  return (
    <div className="min-h-screen gradient-bg py-8">
      <header className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold text-primary">Lazorade Ride Fuel Formula</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Create the perfect electrolyte drink for your cycling adventures
        </p>
        <p className="text-sm text-muted-foreground mt-1 italic">
          Created by the one and only{' '}
          <a 
            href="https://www.strava.com/athletes/118869817" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 underline"
          >
            Peter Lazorchak
          </a>
        </p>
      </header>
      
      <section className="max-w-4xl mx-auto px-4 mb-12">
        <h2 className="text-2xl font-bold text-center mb-6">Key Ingredients</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
            <div className="p-3 flex justify-center bg-blue-50 dark:bg-blue-900/20 h-48">
              <img 
                src="/lovable-uploads/3cfd2a58-40bf-4017-8be8-b8633f7cca20.png" 
                alt="Caffeine" 
                className="h-full object-contain"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1">Caffeine</h3>
              <p className="text-sm text-muted-foreground">
                Enhances endurance performance and reduces perceived exertion during cycling.
              </p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
            <div className="p-3 flex justify-center bg-yellow-50 dark:bg-yellow-900/20 h-48">
              <img 
                src="/lovable-uploads/59262418-bbb5-4eac-97d9-cc4e33bfd23a.png" 
                alt="Citric Acid" 
                className="h-full object-contain"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1">Citric Acid</h3>
              <p className="text-sm text-muted-foreground">
                Adds tartness and helps preserve the flavor profile of your personalized hydration mix.
              </p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
            <div className="p-3 flex justify-center bg-blue-50 dark:bg-blue-900/20 h-48">
              <img 
                src="/lovable-uploads/1c71ebbf-55a3-4ada-a5c3-098db44cbf48.png" 
                alt="Sodium Citrate" 
                className="h-full object-contain"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1">Sodium Citrate</h3>
              <p className="text-sm text-muted-foreground">
                Essential electrolyte that aids in fluid absorption and prevents cramping during extended rides.
              </p>
            </div>
          </div>
        </div>
      </section>
      
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
