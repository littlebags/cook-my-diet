import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Leaf, Plus, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface IngredientsManagerProps {
  onBack: () => void;
}

interface Ingredient {
  id: string;
  name: string;
  category: string;
  expiry?: string;
}

const categories = [
  "Tutti", "Verdure", "Frutta", "Proteine", "Cereali", "Latticini", "Spezie", "Altro"
];

const suggestedIngredients = [
  { name: "Pomodori", category: "Verdure" },
  { name: "Spinaci", category: "Verdure" },
  { name: "Pollo", category: "Proteine" },
  { name: "Salmone", category: "Proteine" },
  { name: "Riso integrale", category: "Cereali" },
  { name: "Quinoa", category: "Cereali" },
  { name: "Mozzarella", category: "Latticini" },
  { name: "Yogurt greco", category: "Latticini" },
  { name: "Basilico", category: "Spezie" },
  { name: "Aglio", category: "Spezie" },
];

export const IngredientsManager = ({ onBack }: IngredientsManagerProps) => {
  const { toast } = useToast();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [newIngredient, setNewIngredient] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tutti");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Carica ingredienti dal localStorage
    const saved = localStorage.getItem('ingredients');
    if (saved) {
      setIngredients(JSON.parse(saved));
    }
  }, []);

  const saveIngredients = (updatedIngredients: Ingredient[]) => {
    setIngredients(updatedIngredients);
    localStorage.setItem('ingredients', JSON.stringify(updatedIngredients));
  };

  const addIngredient = (name: string, category: string = "Altro") => {
    if (!name.trim()) return;

    const ingredient: Ingredient = {
      id: Date.now().toString(),
      name: name.trim(),
      category
    };

    const updated = [...ingredients, ingredient];
    saveIngredients(updated);
    setNewIngredient("");
    
    toast({
      title: "Ingrediente aggiunto!",
      description: `${name} è stato aggiunto alla tua dispensa.`,
    });
  };

  const removeIngredient = (id: string) => {
    const updated = ingredients.filter(ing => ing.id !== id);
    saveIngredients(updated);
    
    toast({
      title: "Ingrediente rimosso",
      description: "L'ingrediente è stato rimosso dalla tua dispensa.",
    });
  };

  const filteredIngredients = ingredients.filter(ingredient => {
    const matchesCategory = selectedCategory === "Tutti" || ingredient.category === selectedCategory;
    const matchesSearch = ingredient.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Verdure": "bg-green-100 text-green-800 border-green-200",
      "Frutta": "bg-orange-100 text-orange-800 border-orange-200", 
      "Proteine": "bg-red-100 text-red-800 border-red-200",
      "Cereali": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Latticini": "bg-blue-100 text-blue-800 border-blue-200",
      "Spezie": "bg-purple-100 text-purple-800 border-purple-200",
      "Altro": "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[category] || colors["Altro"];
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-soft sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-lg font-semibold text-foreground">I Tuoi Ingredienti</h1>
            <div className="w-8" />
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 pb-6">
        {/* Add Ingredient */}
        <section className="py-4">
          <Card className="p-4 shadow-card bg-gradient-card border-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-accent-light rounded-wellness">
                <Leaf className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Aggiungi Ingrediente</h3>
                <p className="text-sm text-muted-foreground">Inserisci cosa hai a disposizione</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Es. Pomodori, Basilico..."
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addIngredient(newIngredient)}
                className="rounded-wellness border-border"
              />
              <Button 
                variant="accent" 
                size="sm"
                onClick={() => addIngredient(newIngredient)}
                disabled={!newIngredient.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </section>

        {/* Suggested Ingredients */}
        {ingredients.length === 0 && (
          <section className="mb-6">
            <h3 className="text-sm font-medium text-foreground mb-3">Ingredienti Suggeriti</h3>
            <div className="flex flex-wrap gap-2">
              {suggestedIngredients.map((item, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => addIngredient(item.name, item.category)}
                  className="text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  {item.name}
                </Button>
              ))}
            </div>
          </section>
        )}

        {/* Search */}
        {ingredients.length > 0 && (
          <section className="mb-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cerca ingredienti..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-wellness border-border"
              />
            </div>
          </section>
        )}

        {/* Category Filter */}
        {ingredients.length > 0 && (
          <section className="mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  className="whitespace-nowrap"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </section>
        )}

        {/* Ingredients List */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              La Tua Dispensa ({filteredIngredients.length})
            </h3>
          </div>

          {filteredIngredients.length === 0 ? (
            <Card className="p-8 text-center shadow-card border-0">
              <div className="p-4 bg-muted rounded-wellness mx-auto w-fit mb-4">
                <Leaf className="w-8 h-8 text-muted-foreground" />
              </div>
              <h4 className="font-medium text-foreground mb-2">
                {ingredients.length === 0 ? "Nessun ingrediente" : "Nessun risultato"}
              </h4>
              <p className="text-sm text-muted-foreground">
                {ingredients.length === 0 
                  ? "Aggiungi gli ingredienti che hai a disposizione per iniziare" 
                  : "Prova a modificare i filtri di ricerca"}
              </p>
            </Card>
          ) : (
            <div className="space-y-2">
              {filteredIngredients.map((ingredient) => (
                <Card key={ingredient.id} className="p-3 shadow-card border-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{ingredient.name}</span>
                        <Badge 
                          variant="outline" 
                          className={`text-xs w-fit ${getCategoryColor(ingredient.category)}`}
                        >
                          {ingredient.category}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeIngredient(ingredient.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};