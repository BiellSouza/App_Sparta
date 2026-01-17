import { useMutation } from "@tanstack/react-query";
import { api, type InsertUser } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export function useCreateUser() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async (data: InsertUser) => {
      const res = await fetch(api.users.create.path, {
        method: api.users.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create account");
      }

      return api.users.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      toast({
        title: "Bem-vindo, Spartano!",
        description: "Seu cadastro foi realizado com sucesso.",
      });
      setLocation("/dashboard");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro no cadastro",
        description: error.message,
      });
    },
  });
}
