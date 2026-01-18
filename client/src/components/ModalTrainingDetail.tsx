import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Clock, Dumbbell, Timer, Repeat } from 'lucide-react'

export function ModalTrainingDetail({ open, onOpenChange, training }) {
  if (!training) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-primary" />
            {training.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Descrição */}
          <p className="text-sm text-muted-foreground">
            {training.description || 'Sem descrição'}
          </p>

          {/* Informações principais */}
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="flex flex-col items-center gap-1 rounded-lg border p-2">
              <Timer className="h-4 w-4 text-primary" />
              <span className="font-semibold">{training.pace || '--'}</span>
              <span className="text-xs text-muted-foreground">Pace</span>
            </div>

            <div className="flex flex-col items-center gap-1 rounded-lg border p-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="font-semibold">
                {training.tempo ||
                  `${Math.floor(training.duration_seconds / 60)}m`}
              </span>
              <span className="text-xs text-muted-foreground">Tempo</span>
            </div>

            <div className="flex flex-col items-center gap-1 rounded-lg border p-2">
              <Repeat className="h-4 w-4 text-primary" />
              <span className="font-semibold">{training.reps || '--'}</span>
              <span className="text-xs text-muted-foreground">Reps</span>
            </div>
          </div>

          {/* Data de criação */}
          <div className="text-xs text-muted-foreground text-right">
            Criado em {new Date(training.createdAt).toLocaleDateString('pt-BR')}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
