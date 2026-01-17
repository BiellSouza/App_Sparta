import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useTrainings() {
  return useQuery({
    queryKey: [api.trainings.list.path],
    queryFn: async () => {
      const res = await fetch(api.trainings.list.path);
      if (!res.ok) throw new Error("Failed to fetch trainings");
      return api.trainings.list.responses[200].parse(await res.json());
    },
  });
}
