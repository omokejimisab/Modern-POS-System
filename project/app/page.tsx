"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Sun, Moon, Store } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function Home() {
  const [pin, setPin] = useState('');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = () => {
    if (pin === '1234') {
      router.push('/dashboard');
    } else {
      toast({
        title: "Invalid PIN",
        description: "Please enter a valid staff PIN (Demo: 1234)",
        variant: "destructive"
      });
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-8 space-y-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto" />
              <h1 className="text-4xl font-bold">POS System</h1>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="absolute top-4 right-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 space-y-8">
          <div className="text-center space-y-4">
            <Store className="w-16 h-16 mx-auto text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              POS System
            </h1>
            <p className="text-muted-foreground">Enter your staff PIN to continue</p>
          </div>

          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Enter PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="text-center text-2xl tracking-widest"
              maxLength={4}
            />
            <Button 
              className="w-full"
              size="lg"
              onClick={handleLogin}
            >
              Login
            </Button>
          </div>

          <p className="text-sm text-center text-muted-foreground">
            Demo PIN: 1234
          </p>
        </Card>
      </div>

      <footer className="p-4 text-center text-sm text-muted-foreground">
        © 2024 POS System. All rights reserved.
      </footer>
    </div>
  );
}