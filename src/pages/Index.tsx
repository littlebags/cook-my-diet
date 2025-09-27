import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CalendarDays, ChefHat, Leaf, Plus, ScanLine } from "lucide-react";
import heroImage from "@/assets/wellness-hero.jpg";
import { DietPlanner } from "@/components/DietPlanner";
import { IngredientsManager } from "@/components/IngredientsManager";
import { RecipeGenerator } from "@/components/RecipeGenerator";

const Index = () => {
  const [currentView, setCurrentView] = useState<'home' | 'diet' | 'ingredients' | 'recipes'>('home');

  if (currentView === 'diet') {
    return <DietPlanner onBack={() => setCurrentView('home')} />;
  }

  if (currentView === 'ingredients') {
    return <IngredientsManager onBack={() => setCurrentView('home')} />;
  }

  if (currentView === 'recipes') {
    return <RecipeGenerator onBack={() => setCurrentView('home')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-soft sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-wellness rounded-wellness">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-foreground">NutriPlan</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 pb-6">
        {/* Hero Section */}
        <section className="py-6">
          <div className="relative overflow-hidden rounded-wellness shadow-card">
            <img 
              src={heroImage} 
              alt="Fresh healthy ingredients for wellness nutrition"
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h2 className="text-2xl font-bold mb-2">
                La tua dieta<br />personalizzata
              </h2>
              <p className="text-white/90 text-sm">
                Ricette intelligenti basate sui tuoi ingredienti
              </p>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="space-y-3 mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Inizia ora</h3>
          
          <Card className="p-4 shadow-card bg-gradient-card border-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-light rounded-wellness">
                  <CalendarDays className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Pianifica Dieta</h4>
                  <p className="text-sm text-muted-foreground">Inserisci il tuo piano settimanale</p>
                </div>
              </div>
              <Button 
                variant="wellness" 
                size="sm"
                onClick={() => setCurrentView('diet')}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </Card>

          <Card className="p-4 shadow-card bg-gradient-card border-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent-light rounded-wellness">
                  <Leaf className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">I Tuoi Ingredienti</h4>
                  <p className="text-sm text-muted-foreground">Gestisci la tua dispensa</p>
                </div>
              </div>
              <Button 
                variant="accent" 
                size="sm"
                onClick={() => setCurrentView('ingredients')}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </Card>

          <Card className="p-4 shadow-card bg-gradient-card border-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-glow/20 rounded-wellness">
                  <ChefHat className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Genera Ricette</h4>
                  <p className="text-sm text-muted-foreground">Ricette personalizzate per te</p>
                </div>
              </div>
              <Button 
                variant="soft" 
                size="sm"
                onClick={() => setCurrentView('recipes')}
              >
                <ChefHat className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </section>

        {/* Features Preview */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Funzionalità</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4 text-center shadow-card border-0">
              <div className="p-3 bg-primary-light rounded-wellness mx-auto w-fit mb-3">
                <ScanLine className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-medium text-foreground text-sm mb-1">Scansione Documenti</h4>
              <p className="text-xs text-muted-foreground">Importa la dieta automaticamente</p>
            </Card>

            <Card className="p-4 text-center shadow-card border-0">
              <div className="p-3 bg-accent-light rounded-wellness mx-auto w-fit mb-3">
                <ChefHat className="w-6 h-6 text-accent" />
              </div>
              <h4 className="font-medium text-foreground text-sm mb-1">Ricette Smart</h4>
              <p className="text-xs text-muted-foreground">Basate sui tuoi ingredienti</p>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;