"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { ShoppingCart, BarChart3, Package, Users, Sun, Moon, LogOut, Settings } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          <Link href="/pos">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-3 bg-blue-500 rounded-full">
                  <ShoppingCart className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-semibold">Point of Sale</h2>
                <p className="text-sm text-muted-foreground text-center">
                  Process sales and manage transactions
                </p>
              </div>
            </Card>
          </Link>

          <Link href="/inventory">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-3 bg-green-500 rounded-full">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-semibold">Inventory</h2>
                <p className="text-sm text-muted-foreground text-center">
                  Manage products and stock levels
                </p>
              </div>
            </Card>
          </Link>

          <Link href="/reports">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-3 bg-purple-500 rounded-full">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-semibold">Reports</h2>
                <p className="text-sm text-muted-foreground text-center">
                  View sales and inventory reports
                </p>
              </div>
            </Card>
          </Link>

          <Link href="/staff">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/10">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-3 bg-orange-500 rounded-full">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-semibold">Staff</h2>
                <p className="text-sm text-muted-foreground text-center">
                  Manage staff and permissions
                </p>
              </div>
            </Card>
          </Link>

          <Link href="/settings">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-900/10">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-3 bg-gray-500 rounded-full">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-semibold">Settings</h2>
                <p className="text-sm text-muted-foreground text-center">
                  Configure store preferences
                </p>
              </div>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
}