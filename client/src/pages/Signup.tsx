import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import { useCreateUser } from "@/hooks/use-users";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Swords } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Signup() {
  const { mutate: signup, isPending } = useCreateUser();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleLogin = async () => {
    const email = form.getValues("email");
    const password = form.getValues("password");
    
    if (!email || !password) {
      toast({
        title: "Erro",
        description: "Preencha email e senha para entrar",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Erro ao entrar");
      }
      
      const user = await res.json();
      localStorage.setItem("user", JSON.stringify(user));
      setLocation("/dashboard");
    } catch (err: any) {
      toast({
        title: "Erro",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const onSubmit = (data: InsertUser) => {
    signup(data, {
      onSuccess: (user) => {
        localStorage.setItem("user", JSON.stringify(user));
        setLocation("/dashboard");
      },
    });
  };

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card p-8 rounded-2xl shadow-xl border"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <Swords className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-sm font-bold text-muted-foreground tracking-widest uppercase mb-1">CADASTRO</h1>
          <h2 className="text-2xl font-black text-foreground text-center leading-tight">PREENCHA COM SEUS DADOS</h2>
          <p className="text-primary font-medium mt-1 italic">Venha ser um Spartano!</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Nome..." {...field} className="h-12 bg-secondary/30" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="email" placeholder="E-mail..." {...field} className="h-12 bg-secondary/30" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="password" placeholder="Senha..." {...field} className="h-12 bg-secondary/30" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-4 space-y-3">
              <Button type="submit" className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20" disabled={isPending}>
                {isPending ? "CRIANDO CONTA..." : "CADASTRAR"}
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleLogin}
                className="w-full h-12 text-lg font-bold border-2 border-primary/20 text-primary hover:bg-primary/5"
              >
                ENTRAR (LOGIN)
              </Button>
            </div>
            
            <p className="text-center text-xs text-muted-foreground mt-4 italic flex items-center justify-center gap-1">
              <span className="text-destructive font-bold">⚠️</span> Crie uma Senha que não esqueça!
            </p>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}
