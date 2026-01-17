import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useCreateLog } from "@/hooks/use-logs";
import { Plus } from "lucide-react";

export function TrainingModal() {
  const [open, setOpen] = useState(false);
  const { mutate: createLog, isPending } = useCreateLog();
  
  const [formData, setFormData] = useState({
    keptPace: false,
    withinTime: false,
    allReps: false,
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createLog(
      {
        userId: 1, // Mocked for this demo as we don't have full auth context yet
        trainingId: 1, // Mocked training ID
        keptPace: formData.keptPace,
        withinTime: formData.withinTime,
        allReps: formData.allReps,
        notes: formData.notes,
        date: new Date(),
      },
      {
        onSuccess: () => {
          setOpen(false);
          setFormData({
            keptPace: false,
            withinTime: false,
            allReps: false,
            notes: "",
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="aspect-square h-auto w-full flex-col gap-2 border-2 border-primary/10 hover:border-primary/30 hover:bg-primary/5 transition-all shadow-sm hover:shadow-md"
        >
          <Plus className="h-10 w-10 text-primary" />
          <span className="font-bold text-primary">NOVO TREINO</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl text-primary font-display uppercase tracking-wide">
            Treino de Tiro
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 rounded-lg border bg-secondary/30">
              <Checkbox 
                id="keptPace" 
                checked={formData.keptPace}
                onCheckedChange={(c) => setFormData(prev => ({ ...prev, keptPace: !!c }))}
              />
              <Label htmlFor="keptPace" className="font-medium cursor-pointer flex-1">
                MANTEVE O PACE?
              </Label>
            </div>
            
            <div className="flex items-center space-x-3 p-3 rounded-lg border bg-secondary/30">
              <Checkbox 
                id="withinTime" 
                checked={formData.withinTime}
                onCheckedChange={(c) => setFormData(prev => ({ ...prev, withinTime: !!c }))}
              />
              <Label htmlFor="withinTime" className="font-medium cursor-pointer flex-1">
                FOI DENTRO DO TEMPO?
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg border bg-secondary/30">
              <Checkbox 
                id="allReps" 
                checked={formData.allReps}
                onCheckedChange={(c) => setFormData(prev => ({ ...prev, allReps: !!c }))}
              />
              <Label htmlFor="allReps" className="font-medium cursor-pointer flex-1">
                FEZ TODAS AS REPETIÇÕES?
              </Label>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes" className="font-medium">Observações</Label>
            <Textarea
              id="notes"
              placeholder="Como você se sentiu hoje?"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="resize-none"
            />
          </div>

          <Button type="submit" className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20" disabled={isPending}>
            {isPending ? "SALVANDO..." : "SALVAR INFORMAÇÕES"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
