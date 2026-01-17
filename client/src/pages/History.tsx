import { Header } from "@/components/Header";
import { useLogs } from "@/hooks/use-logs";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Check, X } from "lucide-react";
import { motion } from "framer-motion";

export default function History() {
  const { data: logs, isLoading } = useLogs();

  const completedDays = logs?.map(log => new Date(log.date!)) || [];

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      <Header title="MEU HISTÓRICO" />
      
      <main className="container max-w-md mx-auto p-4 space-y-6">
        {/* Calendar Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-center text-primary uppercase">Frequência</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="multiple"
                selected={completedDays}
                className="rounded-md border shadow-sm"
                modifiers={{
                  booked: completedDays
                }}
                modifiersStyles={{
                  booked: { color: 'white', backgroundColor: 'var(--primary)' }
                }}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* List of Logs */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg px-2 border-l-4 border-primary ml-1">
            Treinos Realizados
          </h3>
          
          {isLoading ? (
            <div className="text-center p-8 text-muted-foreground">Carregando histórico...</div>
          ) : logs?.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground bg-white rounded-xl border border-dashed">
              Nenhum treino registrado ainda.
            </div>
          ) : (
            logs?.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-card p-4 rounded-xl shadow-sm border flex items-start gap-4"
              >
                <div className="bg-primary/10 rounded-lg p-3 flex flex-col items-center justify-center min-w-[4rem]">
                  <span className="text-xs font-bold text-primary uppercase">
                    {format(new Date(log.date!), "MMM", { locale: ptBR })}
                  </span>
                  <span className="text-2xl font-black text-primary leading-none">
                    {format(new Date(log.date!), "dd")}
                  </span>
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {log.keptPace && (
                      <span className="inline-flex items-center text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold">
                        <Check className="w-3 h-3 mr-1" /> Pace OK
                      </span>
                    )}
                    {log.withinTime && (
                      <span className="inline-flex items-center text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold">
                        <Check className="w-3 h-3 mr-1" /> Tempo OK
                      </span>
                    )}
                    {!log.allReps && (
                      <span className="inline-flex items-center text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-bold">
                        <X className="w-3 h-3 mr-1" /> Reps Incompletas
                      </span>
                    )}
                  </div>
                  {log.notes && (
                    <p className="text-sm text-muted-foreground italic">"{log.notes}"</p>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
