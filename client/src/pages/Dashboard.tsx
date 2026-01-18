import { Header } from '@/components/Header'
import { useTrainings } from '@/hooks/use-trainings'
import { TrainingModal, AddTrainingModal } from '@/components/TrainingModal'
import { Link } from 'wouter'
import { useState } from 'react'
import {
  Clock,
  Dumbbell,
  BarChart3,
  ChevronRight,
  Zap,
  Repeat,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { TrainingListModal } from '@/components/TrainingListModal'

export default function Dashboard() {
  const { data: trainings, isLoading } = useTrainings()
  const [trainingsOpen, setTrainingsOpen] = useState(false)

  const featuredTraining =
    trainings?.find((t) => t.isFeatured) || trainings?.[0]

  const todayTraining = featuredTraining || {
    title: 'TREINO DE TIRO',
    description:
      'O treino deverá ser realizado em pista de atletismo ou local plano marcado. Aqueça 10min antes de iniciar os tiros.',
    pace: '5:30',
    tempo: '60',
    reps: '10',
  }

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      <Header />

      <main className="container max-w-md mx-auto p-4 space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-2xl shadow-lg border overflow-hidden"
        >
          <div className="bg-primary p-4">
            <h2 className="text-xl font-bold text-primary-foreground tracking-wide flex items-center gap-2">
              <Dumbbell className="h-5 w-5" />
              TREINO DO DIA
            </h2>
          </div>
          <div className="p-6">
            {isLoading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-20 bg-muted rounded"></div>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-black text-foreground mb-3">
                  {todayTraining.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {todayTraining.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                    <Zap className="h-4 w-4" />
                    {todayTraining.pace || 'N/A'} PACE
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                    <Clock className="h-4 w-4" />
                    {todayTraining.tempo || 'N/A'} MIN
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                    <Repeat className="h-4 w-4" />
                    {todayTraining.reps || 'N/A'} REPS
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          <AddTrainingModal />
          <TrainingModal />

          <Button
            variant="outline"
            onClick={() => setTrainingsOpen(true)}
            className="aspect-square h-auto w-full flex-col gap-2 border-2 border-primary/10 hover:border-primary/30 hover:bg-primary/5 transition-all shadow-sm hover:shadow-md"
          >
            <Dumbbell className="h-10 w-10 text-primary" />
            <span className="font-bold text-primary">TREINOS</span>
          </Button>
          <TrainingListModal
            open={trainingsOpen}
            onOpenChange={setTrainingsOpen}
            trainings={trainings}
          />

          <Link href="/history">
            <Button
              variant="outline"
              className="aspect-square h-auto w-full flex-col gap-2 border-2 border-primary/10 hover:border-primary/30 hover:bg-primary/5 transition-all shadow-sm hover:shadow-md"
            >
              <BarChart3 className="h-10 w-10 text-primary" />
              <span className="font-bold text-primary">RESULTADOS</span>
            </Button>
          </Link>
        </div>

        <div className="bg-primary/5 rounded-xl p-4 border border-primary/10 flex items-start gap-3">
          <div className="bg-primary text-white rounded-full p-1 mt-0.5 shrink-0">
            <ChevronRight className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-bold text-primary mb-1">Dica do Treinador</h4>
            <p className="text-sm text-muted-foreground">
              Lembre-se de hidratar bem antes e depois do treino de alta
              intensidade.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
