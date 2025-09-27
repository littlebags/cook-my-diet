import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ChefHat, Clock, Users, Sparkles, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RecipeGeneratorProps {
  onBack: () => void;
}

interface Recipe {
  id: string;
  name: string;
  meal: string;
  prepTime: string;
  servings: number;
  ingredients: string[];
  instructions: string[];
  matchingIngredients: string[];
  difficulty: 'Facile' | 'Medio' | 'Difficile';
}

const mealTypes = ["Tutti", "Colazione", "Pranzo", "Cena", "Spuntino"];

const sampleRecipes: Recipe[] = [
  {
    id: "1",
    name: "Insalata di Pollo e Spinaci",
    meal: "Pranzo",
    prepTime: "15 min",
    servings: 2,
    ingredients: ["Pollo", "Spinaci", "Pomodori", "Mozzarella", "Olio d'oliva"],
    instructions: [
      "Cuoci il petto di pollo alla griglia",
      "Lava e taglia gli spinaci freschi",
      "Affetta i pomodori e la mozzarella",
      "Mescola tutti gli ingredienti",
      "Condisci con olio d'oliva e sale"
    ],
    matchingIngredients: ["Pollo", "Spinaci", "Pomodori"],
    difficulty: "Facile"
  },
  {
    id: "2", 
    name: "Salmone al Basilico",
    meal: "Cena",
    prepTime: "20 min",
    servings: 2,
    ingredients: ["Salmone", "Basilico", "Aglio", "Limone", "Olio d'oliva"],
    instructions: [
      "Preriscalda il forno a 200°C",
      "Condisci il salmone con sale e pepe",
      "Prepara un mix di basilico e aglio tritati",
      "Cuoci il salmone per 15 minuti",
      "Servi con una spruzzata di limone"
    ],
    matchingIngredients: ["Salmone", "Basilico", "Aglio"],
    difficulty: "Medio"
  },
  {
    id: "3",
    name: "Bowl di Quinoa e Verdure",
    meal: "Pranzo",
    prepTime: "25 min", 
    servings: 1,
    ingredients: ["Quinoa", "Spinaci", "Pomodori", "Yogurt greco", "Basilico"],
    instructions: [
      "Cuoci la quinoa secondo le istruzioni",
      "Saltare gli spinaci in padella",
      "Affetta i pomodori freschi",
      "Assembla il bowl con tutti gli ingredienti",
      "Completa con yogurt greco e basilico fresco"
    ],
    matchingIngredients: ["Quinoa", "Spinaci", "Yogurt greco"],
    difficulty: "Facile"
  }
];

export const RecipeGenerator = ({ onBack }: RecipeGeneratorProps) => {
  const { toast } = useToast();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedMeal, setSelectedMeal] = useState("Tutti");
  const [userIngredients, setUserIngredients] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    // Carica ingredienti dell'utente
    const savedIngredients = localStorage.getItem('ingredients');
    if (savedIngredients) {
      const ingredients = JSON.parse(savedIngredients);
      setUserIngredients(ingredients.map((ing: any) => ing.name));
    }

    // Carica ricette generate o usa quelle di esempio
    const savedRecipes = localStorage.getItem('generatedRecipes');
    if (savedRecipes) {
      setRecipes(JSON.parse(savedRecipes));
    } else {
      generateRecipes();
    }
  }, []);

  const generateRecipes = () => {
    setIsGenerating(true);
    
    // Simula la generazione di ricette intelligenti
    setTimeout(() => {
      const generatedRecipes = sampleRecipes.map(recipe => ({
        ...recipe,
        matchingIngredients: recipe.ingredients.filter(ing => 
          userIngredients.some(userIng => 
            userIng.toLowerCase().includes(ing.toLowerCase()) ||
            ing.toLowerCase().includes(userIng.toLowerCase())
          )
        )
      })).sort((a, b) => b.matchingIngredients.length - a.matchingIngredients.length);

      setRecipes(generatedRecipes);
      localStorage.setItem('generatedRecipes', JSON.stringify(generatedRecipes));
      setIsGenerating(false);
      
      toast({
        title: "Ricette generate!",
        description: `${generatedRecipes.length} ricette personalizzate per te.`,
      });
    }, 2000);
  };

  const filteredRecipes = recipes.filter(recipe => 
    selectedMeal === "Tutti" || recipe.meal === selectedMeal
  );

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      "Facile": "bg-green-100 text-green-800 border-green-200",
      "Medio": "bg-yellow-100 text-yellow-800 border-yellow-200", 
      "Difficile": "bg-red-100 text-red-800 border-red-200"
    };
    return colors[difficulty as keyof typeof colors] || colors.Facile;
  };

  const getMatchPercentage = (recipe: Recipe) => {
    if (userIngredients.length === 0) return 0;
    return Math.round((recipe.matchingIngredients.length / recipe.ingredients.length) * 100);
  };

  if (selectedRecipe) {
    return (
      <div className="min-h-screen bg-gradient-soft">
        <header className="bg-white/80 backdrop-blur-sm shadow-soft sticky top-0 z-10">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={() => setSelectedRecipe(null)}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-lg font-semibold text-foreground">Ricetta</h1>
              <div className="w-8" />
            </div>
          </div>
        </header>

        <div className="max-w-md mx-auto px-4 pb-6">
          <Card className="p-6 shadow-card border-0 mb-6">
            <h2 className="text-xl font-bold text-foreground mb-4">{selectedRecipe.name}</h2>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{selectedRecipe.prepTime}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span className="text-sm">{selectedRecipe.servings} {selectedRecipe.servings === 1 ? 'porzione' : 'porzioni'}</span>
              </div>
              <Badge className={getDifficultyColor(selectedRecipe.difficulty)}>
                {selectedRecipe.difficulty}
              </Badge>
            </div>

            {selectedRecipe.matchingIngredients.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    {getMatchPercentage(selectedRecipe)}% ingredienti disponibili
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedRecipe.matchingIngredients.map((ing, idx) => (
                    <Badge key={idx} variant="outline" className="bg-primary-light text-primary border-primary/20">
                      {ing}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6 shadow-card border-0 mb-6">
            <h3 className="font-semibold text-foreground mb-3">Ingredienti</h3>
            <ul className="space-y-2">
              {selectedRecipe.ingredients.map((ingredient, idx) => (
                <li 
                  key={idx} 
                  className={`text-sm flex items-center gap-2 ${
                    selectedRecipe.matchingIngredients.includes(ingredient) 
                      ? 'text-primary font-medium' 
                      : 'text-foreground'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${
                    selectedRecipe.matchingIngredients.includes(ingredient) 
                      ? 'bg-primary' 
                      : 'bg-muted-foreground'
                  }`} />
                  {ingredient}
                  {selectedRecipe.matchingIngredients.includes(ingredient) && (
                    <Badge variant="outline" className="text-xs bg-primary-light text-primary border-primary/20">
                      Disponibile
                    </Badge>
                  )}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6 shadow-card border-0">
            <h3 className="font-semibold text-foreground mb-3">Istruzioni</h3>
            <ol className="space-y-3">
              {selectedRecipe.instructions.map((instruction, idx) => (
                <li key={idx} className="flex gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-semibold">
                    {idx + 1}
                  </div>
                  <span className="text-sm text-foreground leading-relaxed">{instruction}</span>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-soft sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-lg font-semibold text-foreground">Genera Ricette</h1>
            <Button variant="ghost" size="sm" onClick={generateRecipes} disabled={isGenerating}>
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 pb-6">
        {/* Generate Section */}
        {userIngredients.length === 0 ? (
          <section className="py-4">
            <Card className="p-6 text-center shadow-card border-0">
              <div className="p-4 bg-muted rounded-wellness mx-auto w-fit mb-4">
                <ChefHat className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-foreground mb-2">Aggiungi ingredienti</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Per ricette personalizzate, aggiungi prima gli ingredienti che hai a disposizione.
              </p>
              <Button variant="wellness" onClick={onBack}>
                Gestisci Ingredienti
              </Button>
            </Card>
          </section>
        ) : (
          <section className="py-4">
            <Card className="p-4 shadow-card bg-gradient-card border-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary-light rounded-wellness">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Ricette Intelligenti</h3>
                  <p className="text-sm text-muted-foreground">
                    Basate sui tuoi {userIngredients.length} ingredienti
                  </p>
                </div>
              </div>
              <Button 
                variant="wellness" 
                className="w-full"
                onClick={generateRecipes}
                disabled={isGenerating}
              >
                {isGenerating ? "Generando ricette..." : "Genera Nuove Ricette"}
                <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          </section>
        )}

        {/* Meal Filter */}
        {recipes.length > 0 && (
          <section className="mb-6">
            <h3 className="text-sm font-medium text-foreground mb-3">Tipo di Pasto</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {mealTypes.map((meal) => (
                <Button
                  key={meal}
                  variant={selectedMeal === meal ? "default" : "outline"}
                  size="sm"
                  className="whitespace-nowrap"
                  onClick={() => setSelectedMeal(meal)}
                >
                  {meal}
                </Button>
              ))}
            </div>
          </section>
        )}

        {/* Recipes List */}
        <section className="space-y-4">
          {filteredRecipes.length === 0 ? (
            <Card className="p-8 text-center shadow-card border-0">
              <div className="p-4 bg-muted rounded-wellness mx-auto w-fit mb-4">
                <ChefHat className="w-8 h-8 text-muted-foreground" />
              </div>
              <h4 className="font-medium text-foreground mb-2">
                {recipes.length === 0 ? "Nessuna ricetta generata" : "Nessuna ricetta trovata"}
              </h4>
              <p className="text-sm text-muted-foreground">
                {recipes.length === 0 
                  ? "Genera le tue prime ricette personalizzate" 
                  : "Prova a modificare il filtro del pasto"}
              </p>
            </Card>
          ) : (
            filteredRecipes.map((recipe) => (
              <Card 
                key={recipe.id} 
                className="p-4 shadow-card border-0 cursor-pointer hover:shadow-wellness transition-all"
                onClick={() => setSelectedRecipe(recipe)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{recipe.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {recipe.prepTime}
                      <Users className="w-3 h-3 ml-2" />
                      {recipe.servings}
                    </div>
                  </div>
                  <Badge className={getDifficultyColor(recipe.difficulty)}>
                    {recipe.difficulty}
                  </Badge>
                </div>

                {recipe.matchingIngredients.length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-primary">
                        {getMatchPercentage(recipe)}% ingredienti disponibili
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {recipe.matchingIngredients.slice(0, 3).map((ing, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs bg-primary-light text-primary border-primary/20">
                          {ing}
                        </Badge>
                      ))}
                      {recipe.matchingIngredients.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{recipe.matchingIngredients.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <Badge variant="outline" className="text-xs">
                  {recipe.meal}
                </Badge>
              </Card>
            ))
          )}
        </section>
      </div>
    </div>
  );
};