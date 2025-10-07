'use client';
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navigation = () => {
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname === path;
  
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Bot className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Rocketbot Certification
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link href="/challenge">
            <Button 
              variant={isActive("/challenge") ? "default" : "ghost"}
              className="font-semibold"
            >
              Challenge
            </Button>
          </Link>
          <Link href="/certification">
            <Button 
              variant={isActive("/certification") ? "default" : "ghost"}
              className="font-semibold"
            >
              Certification
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
