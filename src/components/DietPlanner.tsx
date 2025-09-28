import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Calendar, ScanLine, Plus, Trash2, Upload, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DietPlannerProps {
  onBack: () => void;
}

interface MealPlan {
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks: string;
}

type WeeklyPlan = {
  [key: string]: MealPlan;
};

const daysOfWeek = [
  "Lunedì", "Martedì", "Mercoledì", "Giovedì", 
  "Venerdì", "Sabato", "Domenica"
];

export const DietPlanner = ({ onBack }: DietPlannerProps) => {
  const { toast } = useToast();
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>({});
  const [selectedDay, setSelectedDay] = useState<string>("Lunedì");
  const [isScanning, setIsScanning] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMealChange = (day: string, meal: keyof MealPlan, value: string) => {
    setWeeklyPlan(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [meal]: value
      }
    }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast({
        title: "Formato non supportato",
        description: "Carica solo file PDF.",
        variant: "destructive"
      });
      return;
    }

    setIsParsing(true);
    
    try {
      // Simula il parsing del PDF per ora
      setTimeout(() => {
        setIsParsing(false);
        toast({
          title: "PDF caricato con successo!",
          description: "Il piano alimentare è stato estratto dal documento.",
        });

        // Simula i dati estratti dal PDF
        const extractedPlan = {
          "Lunedì": {
            breakfast: "Colazione estratta da PDF: Avena integrale con frutti di bosco",
            lunch: "Pranzo estratto da PDF: Riso integrale con verdure e legumi",
            dinner: "Cena estratta da PDF: Pesce azzurro con insalata mista",
            snacks: "Snack estratti da PDF: Frutta secca e semi"
          },
          "Martedì": {
            breakfast: "Smoothie verde con spinaci e banana",
            lunch: "Quinoa con pollo e zucchine grigliate", 
            dinner: "Salmone al forno con broccoli al vapore",
            snacks: "Yogurt greco naturale con mandorle"
          },
          "Mercoledì": {
            breakfast: "Toast integrale con avocado e pomodoro",
            lunch: "Insalata di ceci e verdure crude",
            dinner: "Petto di tacchino con patate dolci",
            snacks: "Carote baby con hummus"
          }
        };
        
        setWeeklyPlan(extractedPlan);
      }, 3000);
      
    } catch (error) {
      setIsParsing(false);
      toast({
        title: "Errore durante l'elaborazione",
        description: "Non è stato possibile leggere il file PDF.",
        variant: "destructive"
      });
    }

    // Reset dell'input file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleScanDocument = () => {
    setIsScanning(true);
    // Simulazione scansione documento
    setTimeout(() => {
      setIsScanning(false);
      toast({
        title: "Scansione completata!",
        description: "Il piano alimentare è stato importato con successo.",
      });
      
      // Esempio di dati importati
      const samplePlan = {
        "Lunedì": {
          breakfast: "Avena con frutta e noci",
          lunch: "Insalata di pollo con verdure miste",
          dinner: "Salmone al vapore con broccoli",
          snacks: "Yogurt greco con mirtilli"
        },
        "Martedì": {
          breakfast: "Smoothie proteico verde",
          lunch: "Quinoa con verdure grigliate",
          dinner: "Petto di tacchino con patate dolci",
          snacks: "Mandorle e mela"
        }
      };
      setWeeklyPlan(samplePlan);
    }, 2000);
  };

  const savePlan = () => {
    // Salva il piano nel localStorage per ora
    localStorage.setItem('dietPlan', JSON.stringify(weeklyPlan));
    toast({
      title: "Piano salvato!",
      description: "Il tuo piano alimentare è stato salvato con successo.",
    });
  };

  const currentDayPlan = weeklyPlan[selectedDay] || {
    breakfast: "",
    lunch: "",
    dinner: "",
    snacks: ""
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
            <h1 className="text-lg font-semibold text-foreground">Pianifica Dieta</h1>
            <div className="w-8" />
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 pb-6">
        {/* Scan Document Section */}
        <section className="py-4">
          <Card className="p-4 shadow-card bg-gradient-card border-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary-light rounded-wellness">
                <ScanLine className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Scansiona Documento</h3>
                <p className="text-sm text-muted-foreground">Importa automaticamente la tua dieta</p>
              </div>
            </div>
            <Button 
              variant="wellness" 
              className="w-full"
              onClick={handleScanDocument}
              disabled={isScanning}
            >
              {isScanning ? "Scansionando..." : "Scansiona Piano Alimentare"}
              <ScanLine className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        </section>

        {/* PDF Upload Section */}
        <section className="pb-4">
          <Card className="p-4 shadow-card bg-gradient-card border-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-secondary/20 rounded-wellness">
                <FileText className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Carica PDF</h3>
                <p className="text-sm text-muted-foreground">Carica il tuo piano nutrizionale in PDF</p>
              </div>
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
              disabled={isParsing}
            >
              {isParsing ? "Elaborando PDF..." : "Seleziona File PDF"}
              <Upload className="w-4 h-4 ml-2" />
            </Button>
            
            {isParsing && (
              <div className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span>Analizzando il documento...</span>
              </div>
            )}
          </Card>
        </section>

        {/* Day Selection */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="font-medium text-foreground">Seleziona Giorno</h3>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {daysOfWeek.map((day) => (
              <Button
                key={day}
                variant={selectedDay === day ? "default" : "outline"}
                size="sm"
                className="whitespace-nowrap"
                onClick={() => setSelectedDay(day)}
              >
                {day.slice(0, 3)}
              </Button>
            ))}
          </div>
        </section>

        {/* Meal Planning */}
        <section className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-foreground">{selectedDay}</h3>

          {/* Colazione */}
          <Card className="p-4 shadow-card border-0">
            <Label htmlFor="breakfast" className="text-sm font-medium text-foreground mb-2 block">
              🌅 Colazione
            </Label>
            <Textarea
              id="breakfast"
              placeholder="Inserisci il menu per la colazione..."
              value={currentDayPlan.breakfast}
              onChange={(e) => handleMealChange(selectedDay, 'breakfast', e.target.value)}
              className="min-h-[80px] rounded-wellness border-border"
            />
          </Card>

          {/* Pranzo */}
          <Card className="p-4 shadow-card border-0">
            <Label htmlFor="lunch" className="text-sm font-medium text-foreground mb-2 block">
              ☀️ Pranzo
            </Label>
            <Textarea
              id="lunch"
              placeholder="Inserisci il menu per il pranzo..."
              value={currentDayPlan.lunch}
              onChange={(e) => handleMealChange(selectedDay, 'lunch', e.target.value)}
              className="min-h-[80px] rounded-wellness border-border"
            />
          </Card>

          {/* Cena */}
          <Card className="p-4 shadow-card border-0">
            <Label htmlFor="dinner" className="text-sm font-medium text-foreground mb-2 block">
              🌙 Cena
            </Label>
            <Textarea
              id="dinner"
              placeholder="Inserisci il menu per la cena..."
              value={currentDayPlan.dinner}
              onChange={(e) => handleMealChange(selectedDay, 'dinner', e.target.value)}
              className="min-h-[80px] rounded-wellness border-border"
            />
          </Card>

          {/* Spuntini */}
          <Card className="p-4 shadow-card border-0">
            <Label htmlFor="snacks" className="text-sm font-medium text-foreground mb-2 block">
              🍎 Spuntini
            </Label>
            <Textarea
              id="snacks"
              placeholder="Inserisci spuntini e merende..."
              value={currentDayPlan.snacks}
              onChange={(e) => handleMealChange(selectedDay, 'snacks', e.target.value)}
              className="min-h-[60px] rounded-wellness border-border"
            />
          </Card>
        </section>

        {/* Save Button */}
        <Button 
          variant="wellness" 
          size="lg" 
          className="w-full"
          onClick={savePlan}
        >
          Salva Piano Alimentare
        </Button>
      </div>
    </div>
  );
};