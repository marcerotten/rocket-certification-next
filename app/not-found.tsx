'use client';
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Navigation from "@/components/Navigation"; 
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const NotFound = () => {
  const pathname = usePathname();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", pathname);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-9xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-3xl font-bold">Page Not Found</h2>
          <p className="text-xl text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link href="/">
            <Button size="lg">
              <Home className="mr-2 h-4 w-4" />
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
