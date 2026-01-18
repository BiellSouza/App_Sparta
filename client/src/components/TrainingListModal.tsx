import { useState } from 'react'
import { Dumbbell } from 'lucide-react'
import { ModalTrainingDetail } from './ModalTrainingDetail'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function TrainingListModal({ trainings = [], open, onOpenChange }) {
  const [selectedTraining, setSelectedTraining] = useState(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  function handleOpenTraining(training) {
    setSelectedTraining(training)
    setDetailsOpen(true)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Meus Treinos</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            {trainings.map((training) => (
              <button
                key={training.id}
                onClick={() => handleOpenTraining(training)}
                className="w-full text-left border rounded-xl p-4 hover:bg-muted"
              >
                <div className="flex items-center gap-2 font-bold">
                  <Dumbbell className="h-4 w-4 text-primary" />
                  {training.title}
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(training.created_at).toLocaleDateString('pt-BR')}
                </span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <ModalTrainingDetail
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        training={selectedTraining}
      />
    </>
  )
}
