import { Link } from "wouter";
import { Shield, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function Header({ title = "SPARTA APP" }: { title?: string }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4 max-w-md mx-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="-ml-2">
              <Menu className="h-6 w-6 text-primary" />
              <span className="sr-only">Menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <Link href="/dashboard">
              <DropdownMenuItem className="cursor-pointer">Dashboard</DropdownMenuItem>
            </Link>
            <Link href="/history">
              <DropdownMenuItem className="cursor-pointer">Histórico</DropdownMenuItem>
            </Link>
            <Link href="/">
              <DropdownMenuItem className="cursor-pointer text-destructive">Sair</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="flex-1 text-right flex items-center justify-end gap-2">
          <h1 className="text-xl font-bold tracking-wider text-primary">{title}</h1>
          <Shield className="h-6 w-6 text-primary fill-primary/20" />
        </div>
      </div>
    </header>
  );
}
