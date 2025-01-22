"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sun, Moon, ArrowLeft, Save, Store, Phone, Mail, Globe, DollarSign } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

interface StoreSettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  currency: string;
  taxRate: number;
  receiptFooter: string;
  timezone: string;
}

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
];

const timezones = [
  'UTC',
  'America/New_York',
  'Europe/London',
  'Asia/Tokyo',
  'Africa/Lagos',
  'Pacific/Auckland',
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [settings, setSettings] = useState<StoreSettings>({
    name: 'My Store',
    address: '123 Main Street, City, Country',
    phone: '+1234567890',
    email: 'contact@mystore.com',
    website: 'www.mystore.com',
    currency: 'USD',
    taxRate: 10,
    receiptFooter: 'Thank you for shopping with us!',
    timezone: 'UTC',
  });

  const handleSave = () => {
    // In a real app, save to database here
    toast({
      title: "Settings Saved",
      description: "Your store settings have been updated successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold ml-4">Settings</h1>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="store" className="space-y-6">
          <TabsList>
            <TabsTrigger value="store">Store Information</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="store">
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium">Store Name</label>
                  <div className="mt-1 flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                      <Store className="h-4 w-4" />
                    </span>
                    <Input
                      value={settings.name}
                      onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                      className="rounded-l-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Address</label>
                  <Input
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <div className="mt-1 flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                        <Phone className="h-4 w-4" />
                      </span>
                      <Input
                        value={settings.phone}
                        onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                        className="rounded-l-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <div className="mt-1 flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                        <Mail className="h-4 w-4" />
                      </span>
                      <Input
                        type="email"
                        value={settings.email}
                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                        className="rounded-l-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Website</label>
                  <div className="mt-1 flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                      <Globe className="h-4 w-4" />
                    </span>
                    <Input
                      value={settings.website}
                      onChange={(e) => setSettings({ ...settings, website: e.target.value })}
                      className="rounded-l-none"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium">Currency</label>
                  <div className="mt-1 flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                    </span>
                    <Select
                      value={settings.currency}
                      onValueChange={(value) => setSettings({ ...settings, currency: value })}
                    >
                      <SelectTrigger className="rounded-l-none">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.symbol} - {currency.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Tax Rate (%)</label>
                  <Input
                    type="number"
                    value={settings.taxRate}
                    onChange={(e) => setSettings({ ...settings, taxRate: parseFloat(e.target.value) })}
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Receipt Footer Message</label>
                  <Input
                    value={settings.receiptFooter}
                    onChange={(e) => setSettings({ ...settings, receiptFooter: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Timezone</label>
                  <Select
                    value={settings.timezone}
                    onValueChange={(value) => setSettings({ ...settings, timezone: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((timezone) => (
                        <SelectItem key={timezone} value={timezone}>
                          {timezone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <Button onClick={handleSave} className="w-full md:w-auto">
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </main>
    </div>
  );
}