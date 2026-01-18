import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, type InsertTrainingLog } from '@shared/routes'
import { useToast } from '@/hooks/use-toast'

export function useLogs() {
  return useQuery({
    queryKey: [api.logs.list.path],
    queryFn: async () => {
      const res = await fetch(api.logs.list.path)
      if (!res.ok) throw new Error('Failed to fetch logs')
      return api.logs.list.responses[200].parse(await res.json())
    },
  })
}

export function useCreateLog() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (data: InsertTrainingLog) => {
      // Removendo qualquer referência a date/startTime/endTime
      const payload = {
        userId: data.userId,
        trainingId: data.trainingId,
        keptPace: data.keptPace,
        withinTime: data.withinTime,
        allReps: data.allReps,
        notes: data.notes,
      }

      const res = await fetch(api.logs.create.path, {
        method: api.logs.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      let json
      try {
        json = await res.json()
      } catch (err) {
        const text = await res.text()
        console.error('Resposta não é JSON:', text)
        throw new Error('Backend retornou algo inesperado')
      }

      if (!res.ok) {
        throw new Error(json.message || 'Failed to save log')
      }

      return api.logs.create.responses[201].parse(json)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.logs.list.path] })
      toast({
        title: 'Treino Registrado!',
        description: 'Seus dados foram salvos com sucesso.',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar',
        description: error.message,
      })
    },
  })
}
