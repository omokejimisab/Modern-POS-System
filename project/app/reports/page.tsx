"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Bar, Line } from 'recharts';
import { Sun, Moon, ArrowLeft, TrendingUp, DollarSign, Package, ShoppingCart, Calendar } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { Transaction } from '@/lib/types';

const mockTransactions: Transaction[] = [
  {
    id: '1',
    items: [
      { id: '1', name: 'T-Shirt', price: 19.99, quantity: 2, sku: 'CLOTH001', category: 'Clothing', stockQuantity: 100 }
    ],
    subtotal: 39.98,
    discount: 0,
    tax: 4.00,
    total: 43.98,
    amountPaid: 50.00,
    change: 6.02,
    paymentMethod: 'cash',
    timestamp: '2024-01-15T09:30:00Z',
    staffId: '1'
  },
];

const timeRanges = [
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'This Year', value: 'year' },
  { label: 'Custom Range', value: 'custom' }
];

export default function ReportsPage() {
  const { theme, setTheme } = useTheme();
  const [timeRange, setTimeRange] = useState('today');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [transactions] = useState<Transaction[]>(mockTransactions);

  const filterTransactions = () => {
    const now = new Date();
    const start = new Date(startDate || now);
    const end = new Date(endDate || now);

    return transactions.filter(transaction => {
      const date = new Date(transaction.timestamp);
      switch (timeRange) {
        case 'today':
          return date.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now.setDate(now.getDate() - 7));
          return date >= weekAgo;
        case 'month':
          return date.getMonth() === now.getMonth() && 
                 date.getFullYear() === now.getFullYear();
        case 'year':
          return date.getFullYear() === now.getFullYear();
        case 'custom':
          return date >= start && date <= end;
        default:
          return true;
      }
    });
  };

  const filteredTransactions = filterTransactions();

  const calculateMetrics = () => {
    return filteredTransactions.reduce((acc, transaction) => ({
      totalSales: acc.totalSales + transaction.total,
      totalOrders: acc.totalOrders + 1,
      totalDiscount: acc.totalDiscount + transaction.discount,
      averageOrderValue: (acc.totalSales + transaction.total) / (acc.totalOrders + 1)
    }), {
      totalSales: 0,
      totalOrders: 0,
      totalDiscount: 0,
      averageOrderValue: 0
    });
  };

  const metrics = calculateMetrics();

  const salesByDay = filteredTransactions.reduce((acc, transaction) => {
    const date = new Date(transaction.timestamp).toLocaleDateString();
    acc[date] = (acc[date] || 0) + transaction.total;
    return acc;
  }, {} as Record<string, number>);

  const salesData = Object.entries(salesByDay).map(([date, sales]) => ({
    date,
    sales
  }));

  const salesByCategory = filteredTransactions.reduce((acc, transaction) => {
    transaction.items.forEach(item => {
      acc[item.category] = (acc[item.category] || 0) + (item.price * item.quantity);
    });
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(salesByCategory).map(([category, sales]) => ({
    category,
    sales
  }));

  const chartProps = {
    width: "100%",
    height: "100%",
    margin: { top: 10, right: 30, left: 0, bottom: 0 }
  };

  const xAxisProps = {
    dataKey: "date",
    fontSize: 12,
    tickLine: false,
    axisLine: true
  };

  const yAxisProps = {
    fontSize: 12,
    tickLine: false,
    axisLine: true,
    tickFormatter: (value: number) => `$${value}`
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
              <h1 className="text-2xl font-bold ml-4">Reports & Analytics</h1>
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
        <div className="mb-8 flex space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              {timeRanges.map(range => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {timeRange === 'custom' && (
            <div className="flex space-x-4">
              <div>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-500 rounded-full">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                <h3 className="text-2xl font-bold">${metrics.totalSales.toFixed(2)}</h3>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-500 rounded-full">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <h3 className="text-2xl font-bold">{metrics.totalOrders}</h3>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-500 rounded-full">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Discount</p>
                <h3 className="text-2xl font-bold">${metrics.totalDiscount.toFixed(2)}</h3>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/10">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-500 rounded-full">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Order Value</p>
                <h3 className="text-2xl font-bold">${metrics.averageOrderValue.toFixed(2)}</h3>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Sales Trend</h3>
            <div className="h-[300px]">
              <ResponsiveContainer {...chartProps}>
                <LineChart data={salesData}>
                  <XAxis {...xAxisProps} />
                  <YAxis {...yAxisProps} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Sales by Category</h3>
            <div className="h-[300px]">
              <ResponsiveContainer {...chartProps}>
                <BarChart data={categoryData}>
                  <XAxis dataKey="category" {...xAxisProps} />
                  <YAxis {...yAxisProps} />
                  <Tooltip />
                  <Bar 
                    dataKey="sales" 
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <Card className="mb-8">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Payment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {new Date(transaction.timestamp).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{transaction.id}</TableCell>
                    <TableCell>{transaction.items.length}</TableCell>
                    <TableCell>${transaction.total.toFixed(2)}</TableCell>
                    <TableCell>${transaction.discount.toFixed(2)}</TableCell>
                    <TableCell className="capitalize">{transaction.paymentMethod}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </main>
    </div>
  );
}