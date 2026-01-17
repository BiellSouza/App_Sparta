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
import { Input } from "@/components/ui/input";
import { useCreateLog } from "@/hooks/use-logs";
import { useTrainings } from "@/hooks/use-trainings";
import { Plus, CheckCircle2 } from "lucide-react";

export function TrainingModal() {
  const [open, setOpen] = useState(false);
  const { mutate: createLog, isPending } = useCreateLog();
  const { data: trainings } = useTrainings();
  
  const [formData, setFormData] = useState({
    trainingId: 1,
    startTime: "",
    endTime: "",
    keptPace: false,
    withinTime: false,
    allReps: false,
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createLog(
      {
        userId: 1,
        trainingId: formData.trainingId,
        startTime: formData.startTime,
        endTime: formData.endTime,
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
            trainingId: 1,
            startTime: "",
            endTime: "",
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
          <CheckCircle2 className="h-10 w-10 text-primary" />
          <span className="font-bold text-primary">CONCLUIR TREINO</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl text-primary font-display uppercase tracking-wide">
            Concluir Treino
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startTime">Início</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endTime">Fim</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
              />
            </div>
          </div>

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

export function AddTrainingModal() {
  const [open, setOpen] = useState(false);
  const { mutate: createTraining, isPending } = useTrainings() as any; // Using simplified access
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    durationSeconds: 3600,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch("/api/trainings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, isFeatured: true }),
    }).then(() => {
      setOpen(false);
      window.location.reload(); // Quick refresh to see new training
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="aspect-square h-auto w-full flex-col gap-2 border-2 border-primary/10 hover:border-primary/30 hover:bg-primary/5 transition-all shadow-sm hover:shadow-md"
        >
          <Plus className="h-10 w-10 text-primary" />
          <span className="font-bold text-primary">ADICIONAR TREINO</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl text-primary font-display uppercase tracking-wide">
            Novo Treino
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Nome do Treino</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ex: Treino de Velocidade"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva o treino..."
              className="resize-none"
            />
          </div>
          <Button type="submit" className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20" disabled={isPending}>
            {isPending ? "CRIANDO..." : "CRIAR TREINO"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

