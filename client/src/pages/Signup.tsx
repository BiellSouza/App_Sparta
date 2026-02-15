import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import { useCreateUser } from "@/hooks/use-users";
import { useState, useEffect } from "react";
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
import logo from "../logoForm.png";
import { Eye, EyeOff } from "lucide-react";

export default function Signup() {
  const [show, setShow] = useState(false);

  const { mutate: signup, isPending } = useCreateUser();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      // se já tiver login, vai direto pra dashboard
      setLocation("/dashboard");
    }
  }, []);

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

      const data = await res.json(); // ✅ UMA ÚNICA VEZ

      if (!res.ok) {
        throw new Error(data.message || "Erro ao entrar");
      }

      // login OK
      localStorage.setItem("user", JSON.stringify(data));
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
    const payload = { ...data } as any;
    delete payload.id; // remove id caso exista
    console.log("Payload final enviado para o backend:", payload); // 🔥 Aqui você garante que id não está

    signup(payload, {
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
          <div className="bg-red-700/10 p-4 rounded-full mb-4">
            {/* <Swords className="h-12 w-12 text-red-700" /> */}
            <img src={logo} className="w-16" alt="Logo de Sparta" />
          </div>
          <h1 className="text-sm font-bold text-muted-foreground tracking-widest uppercase mb-1">
            CADASTRO
          </h1>
          <h2 className="text-2xl font-black text-foreground text-center leading-tight">
            PREENCHA COM SEUS DADOS
          </h2>
          <p className="text-red-700 font-medium mt-1 italic">
            Venha ser um Spartano!
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Nome..."
                      {...field}
                      className="h-12 bg-secondary/30"
                      required
                    />
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
                    <Input
                      type="email"
                      placeholder="E-mail..."
                      {...field}
                      className="h-12 bg-secondary/30"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="Número..."
                      {...field}
                      className="h-12 bg-secondary/30"
                      required
                    />
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
                    <div className="flex items-center gap-2">
                      <Input
                        type={show ? "text" : "password"}
                        placeholder="Senha..."
                        {...field}
                        className="h-12 bg-secondary/30"
                        required
                      />
                      <button
                        type="button"
                        className="bg-red-700 p-2 rounded-sm"
                        onClick={() => setShow(!show)}
                      >
                        {show ? (
                          <Eye width={20} className="text-white" />
                        ) : (
                          <EyeOff width={20} className="text-white" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-4 space-y-3">
              <Button
                type="submit"
                className="w-full h-12 text-lg font-bold shadow-lg shadow-red-700/20"
                disabled={isPending}
              >
                {isPending ? "CRIANDO CONTA..." : "CADASTRAR"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleLogin}
                className="w-full h-12 text-lg font-bold border-2 border-red-700/20 text-red-700 hover:bg-red-700/5"
              >
                ENTRAR (LOGIN)
              </Button>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-4 italic flex items-center justify-center gap-1">
              <span className="text-destructive font-bold">⚠️</span> Crie uma
              Senha que não esqueça!
            </p>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}
