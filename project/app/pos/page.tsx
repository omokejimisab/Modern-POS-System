"use client";

import { useState, useEffect } from 'react';
import { Product, CartItem, PaymentMethod, PendingOrder, ProductVariant } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ShoppingCart, Trash2, Plus, Minus, CreditCard, Banknote, Sun, Moon, Calculator, PauseCircle, PlayCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';
import Link from 'next/link';

export default function POSPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [amountPaid, setAmountPaid] = useState<string>('');
  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([]);
  const [isPendingOrdersOpen, setIsPendingOrdersOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<{[key: string]: ProductVariant}>({});
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [calculatorDisplay, setCalculatorDisplay] = useState('0');
  const [calculatorMemory, setCalculatorMemory] = useState<number | null>(null);
  const [calculatorOperation, setCalculatorOperation] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setProducts([
      {
        id: '1',
        name: 'T-Shirt',
        basePrice: 19.99,
        sku: 'CLOTH001',
        category: 'Clothing',
        stockQuantity: 100,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
        hasVariants: true,
        variants: [
          {
            id: '1-1',
            name: 'T-Shirt - Red, Small',
            sku: 'CLOTH001-R-S',
            price: 19.99,
            stockQuantity: 20,
            attributes: { color: 'Red', size: 'S' }
          },
          {
            id: '1-2',
            name: 'T-Shirt - Red, Medium',
            sku: 'CLOTH001-R-M',
            price: 19.99,
            stockQuantity: 30,
            attributes: { color: 'Red', size: 'M' }
          },
          {
            id: '1-3',
            name: 'T-Shirt - Blue, Small',
            sku: 'CLOTH001-B-S',
            price: 19.99,
            stockQuantity: 25,
            attributes: { color: 'Blue', size: 'S' }
          },
          {
            id: '1-4',
            name: 'T-Shirt - Blue, Medium',
            sku: 'CLOTH001-B-M',
            price: 19.99,
            stockQuantity: 25,
            attributes: { color: 'Blue', size: 'M' }
          }
        ]
      },
      {
        id: '2',
        name: 'Fresh Milk',
        basePrice: 3.49,
        sku: 'DAIRY001',
        category: 'Dairy',
        stockQuantity: 50,
        image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&q=80',
        hasVariants: false
      }
    ]);
  }, []);

  const addToCart = (product: Product) => {
    if (product.hasVariants && !selectedVariant[product.id]) {
      toast({
        title: "Select Variant",
        description: "Please select product variant first",
        variant: "destructive"
      });
      return;
    }

    const variant = product.hasVariants ? selectedVariant[product.id] : undefined;
    const stockQuantity = variant ? variant.stockQuantity : product.stockQuantity;
    const price = variant ? variant.price : product.basePrice;

    if (stockQuantity <= 0) {
      toast({
        title: "Out of Stock",
        description: `${product.name} is currently out of stock.`,
        variant: "destructive"
      });
      return;
    }

    setCart((currentCart) => {
      const existingItemIndex = currentCart.findIndex((item) => 
        item.id === product.id && 
        (!item.variant || !variant || item.variant.id === variant.id)
      );

      if (existingItemIndex > -1) {
        const existingItem = currentCart[existingItemIndex];
        if (existingItem.quantity >= stockQuantity) {
          toast({
            title: "Maximum Stock Reached",
            description: `Cannot add more ${product.name} than available in stock.`,
            variant: "destructive"
          });
          return currentCart;
        }

        const updatedCart = [...currentCart];
        updatedCart[existingItemIndex] = {
          ...existingItem,
          quantity: existingItem.quantity + 1
        };
        return updatedCart;
      }

      return [...currentCart, {
        ...product,
        price,
        quantity: 1,
        variant
      }];
    });
  };

  const removeFromCart = (productId: string, variantId?: string) => {
    setCart((currentCart) => 
      currentCart.filter((item) => 
        !(item.id === productId && (!variantId || item.variant?.id === variantId))
      )
    );
  };

  const updateQuantity = (productId: string, delta: number, variantId?: string) => {
    setCart((currentCart) => {
      return currentCart.map((item) => {
        if (item.id === productId && (!variantId || item.variant?.id === variantId)) {
          const stockQuantity = item.variant ? item.variant.stockQuantity : item.stockQuantity;
          const newQuantity = item.quantity + delta;
          
          if (newQuantity <= 0) return item;
          if (newQuantity > stockQuantity) {
            toast({
              title: "Maximum Stock Reached",
              description: `Cannot add more ${item.name} than available in stock.`,
              variant: "destructive"
            });
            return item;
          }
          
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  const handlePayment = async (method: PaymentMethod) => {
    const paid = parseFloat(amountPaid);
    if (isNaN(paid)) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount.",
        variant: "destructive"
      });
      return;
    }

    const discount = paid < total ? total - paid : 0;
    const change = paid > total ? paid - total : 0;

    toast({
      title: "Payment Successful",
      description: `
        Payment processed via ${method}.
        ${discount > 0 ? `Discount: $${discount.toFixed(2)}` : ''}
        ${change > 0 ? `Change: $${change.toFixed(2)}` : ''}
      `,
    });

    const transaction = {
      id: Date.now().toString(),
      items: cart,
      subtotal,
      discount,
      tax,
      total: paid,
      amountPaid: paid,
      change,
      paymentMethod: method,
      timestamp: new Date().toISOString(),
      staffId: '1'
    };

    setCart([]);
    setAmountPaid('');
    setIsPaymentOpen(false);
  };

  const handlePendOrder = () => {
    if (cart.length === 0) return;

    const pendingOrder: PendingOrder = {
      id: Date.now().toString(),
      items: cart,
      timestamp: new Date().toISOString()
    };

    setPendingOrders([...pendingOrders, pendingOrder]);
    setCart([]);
    toast({
      title: "Order Pending",
      description: "Order has been saved for later.",
    });
  };

  const resumeOrder = (order: PendingOrder) => {
    setCart(order.items);
    setPendingOrders(pendingOrders.filter(o => o.id !== order.id));
    setIsPendingOrdersOpen(false);
  };

  const handleCalculatorInput = (value: string) => {
    if (value === 'C') {
      setCalculatorDisplay('0');
      setCalculatorMemory(null);
      setCalculatorOperation(null);
    } else if (value === '=') {
      if (calculatorMemory !== null && calculatorOperation) {
        const current = parseFloat(calculatorDisplay);
        let result = 0;
        switch (calculatorOperation) {
          case '+': result = calculatorMemory + current; break;
          case '-': result = calculatorMemory - current; break;
          case '*': result = calculatorMemory * current; break;
          case '/': result = calculatorMemory / current; break;
        }
        setCalculatorDisplay(result.toString());
        setCalculatorMemory(null);
        setCalculatorOperation(null);
      }
    } else if (['+', '-', '*', '/'].includes(value)) {
      setCalculatorMemory(parseFloat(calculatorDisplay));
      setCalculatorOperation(value);
      setCalculatorDisplay('0');
    } else {
      setCalculatorDisplay(calculatorDisplay === '0' ? value : calculatorDisplay + value);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const categories = Array.from(new Set(products.map(p => p.category)));

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsCalculatorOpen(true)}
            >
              <Calculator className="h-4 w-4 mr-2" />
              Calculator
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            {categories.map(category => (
              <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  selectedVariant={selectedVariant[product.id]}
                  onVariantSelect={(variant) => setSelectedVariant({
                    ...selectedVariant,
                    [product.id]: variant
                  })}
                  onAdd={addToCart}
                />
              ))}
            </div>
          </TabsContent>

          {categories.map(category => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts
                  .filter(p => p.category === category)
                  .map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product}
                      selectedVariant={selectedVariant[product.id]}
                      onVariantSelect={(variant) => setSelectedVariant({
                        ...selectedVariant,
                        [product.id]: variant
                      })}
                      onAdd={addToCart}
                    />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <div className="w-96 border-l bg-card">
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Cart</h2>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsPendingOrdersOpen(true)}
              >
                <PlayCircle className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handlePendOrder}
                disabled={cart.length === 0}
              >
                <PauseCircle className="h-4 w-4" />
              </Button>
              <ShoppingCart className="h-6 w-6" />
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {cart.map((item) => (
              <div
                key={item.id + (item.variant?.id || '')}
                className="flex justify-between items-center mb-4 p-3 bg-background rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  {item.variant && (
                    <div className="text-sm text-muted-foreground">
                      {Object.entries(item.variant.attributes).map(([key, value]) => 
                        `${key}: ${value}`
                      ).join(', ')}
                    </div>
                  )}
                  <div className="text-sm text-muted-foreground">
                    ${item.price.toFixed(2)} x {item.quantity}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.id, -1, item.variant?.id)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.id, 1, item.variant?.id)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeFromCart(item.id, item.variant?.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 mt-4 space-y-4">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
              <DialogTrigger asChild>
                <Button
                  className="w-full"
                  size="lg"
                  disabled={cart.length === 0}
                >
                  Checkout
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Payment Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Amount Paid</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(e.target.value)}
                      placeholder="Enter amount"
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      className="h-32"
                      onClick={() => handlePayment('cash')}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <Banknote className="h-8 w-8" />
                        <span>Cash</span>
                      </div>
                    </Button>
                    <Button
                      className="h-32"
                      onClick={() => handlePayment('card')}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <CreditCard className="h-8 w-8" />
                        <span>Card</span>
                      </div>
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <Dialog open={isCalculatorOpen} onOpenChange={setIsCalculatorOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Calculator</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <Input
              value={calculatorDisplay}
              readOnly
              className="text-right text-2xl"
            />
            <div className="grid grid-cols-4 gap-2">
              {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+', 'C'].map((btn) => (
                <Button
                  key={btn}
                  onClick={() => handleCalculatorInput(btn)}
                  className={btn === 'C' ? 'col-span-2' : ''}
                >
                  {btn}
                </Button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isPendingOrdersOpen} onOpenChange={setIsPendingOrdersOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Pending Orders</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {pendingOrders.map((order) => (
              <Card key={order.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Order #{order.id}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(order.timestamp).toLocaleString()}
                    </div>
                    <div className="text-sm">
                      {order.items.length} items
                    </div>
                  </div>
                  <Button onClick={() => resumeOrder(order)}>
                    Resume
                  </Button>
                </div>
              </Card>
            ))}
            {pendingOrders.length === 0 && (
              <div className="text-center text-muted-foreground">
                No pending orders
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProductCard({ 
  product, 
  selectedVariant,
  onVariantSelect,
  onAdd 
}: { 
  product: Product; 
  selectedVariant?: ProductVariant;
  onVariantSelect: (variant: ProductVariant) => void;
  onAdd: (p: Product) => void;
}) {
  const [isVariantOpen, setIsVariantOpen] = useState(false);

  const handleClick = () => {
    if (product.hasVariants) {
      setIsVariantOpen(true);
    } else {
      onAdd(product);
    }
  };

  const handleVariantChange = (attribute: string, value: string) => {
    const currentAttributes = selectedVariant?.attributes || {};
    const newAttributes = { ...currentAttributes, [attribute]: value };
    
    const matchingVariant = product.variants?.find(variant => {
      return Object.entries(newAttributes).every(([key, val]) => 
        variant.attributes[key] === val
      );
    });

    if (matchingVariant) {
      onVariantSelect(matchingVariant);
    }
  };

  return (
    <>
      <Card
        className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
        onClick={handleClick}
      >
        {product.image && (
          <div className="aspect-square mb-4 overflow-hidden rounded-lg">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="text-lg font-semibold">{product.name}</div>
        <div className="text-muted-foreground">
          ${(selectedVariant?.price || product.basePrice).toFixed(2)}
        </div>
        <div className="text-sm text-muted-foreground mt-2 flex justify-between">
          <span>SKU: {selectedVariant?.sku || product.sku}</span>
          <span className={(selectedVariant?.stockQuantity || product.stockQuantity) <= 5 ? 'text-destructive' : ''}>
            Stock: {selectedVariant?.stockQuantity || product.stockQuantity}
          </span>
        </div>
        {product.hasVariants && selectedVariant && (
          <div className="mt-2 text-sm text-muted-foreground">
            {Object.entries(selectedVariant.attributes).map(([key, value]) => 
              `${key}: ${value}`
            ).join(', ')}
          </div>
        )}
      </Card>

      {product.hasVariants && (
        <Dialog open={isVariantOpen} onOpenChange={setIsVariantOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select Variant</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {Object.entries(
                product.variants?.reduce((acc, variant) => {
                  Object.entries(variant.attributes).forEach(([key, value]) => {
                    acc[key] = acc[key] || new Set();
                    acc[key].add(value);
                  });
                  return acc;
                }, {} as Record<string, Set<string>>) || {}
              ).map(([attribute, values]) => (
                <div key={attribute}>
                  <label className="text-sm font-medium">{attribute}</label>
                  <Select
                    value={selectedVariant?.attributes[attribute] || ''}
                    onValueChange={(value) => handleVariantChange(attribute, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${attribute}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from(values).map((value) => (
                        <SelectItem key={value} value={value}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
              <Button 
                className="w-full"
                onClick={() => {
                  if (selectedVariant) {
                    onAdd(product);
                    setIsVariantOpen(false);
                  }
                }}
                disabled={!selectedVariant}
              >
                Add to Cart
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}