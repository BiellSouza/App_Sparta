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
import { Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function Signup() {
  const { mutate: createUser, isPending } = useCreateUser();
  
  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(data: InsertUser) {
    createUser(data);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="bg-primary/10 p-4 rounded-full">
            <Shield className="w-16 h-16 text-primary fill-primary/20" />
          </div>
          <h1 className="text-4xl font-black tracking-widest text-primary uppercase">
            CADASTRO
          </h1>
          <p className="text-muted-foreground font-medium uppercase tracking-wide">
            Preencha com seus dados <br/>
            <span className="text-primary font-bold">Venha ser um Spartano!</span>
          </p>
        </div>

        <div className="bg-card border rounded-2xl shadow-xl p-6 md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-primary">NOME COMPLETO</FormLabel>
                    <FormControl>
                      <Input placeholder="Leônidas" className="h-12 bg-muted/50" {...field} />
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
                    <FormLabel className="font-bold text-primary">EMAIL</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="leonidas@sparta.com" className="h-12 bg-muted/50" {...field} />
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
                    <FormLabel className="font-bold text-primary">SENHA</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" className="h-12 bg-muted/50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/25 mt-6"
                disabled={isPending}
              >
                {isPending ? "CRIANDO..." : "CRIAR UMA SENHA QUE NÃO ESQUEÇA!"}
              </Button>
            </form>
          </Form>
        </div>
      </motion.div>
    </div>
  );
}
