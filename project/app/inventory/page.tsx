"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Plus, Sun, Moon, ArrowLeft, Save } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Product, ProductVariant } from '@/lib/types';

const mockInventory = [
  { id: '1', name: 'Organic Bananas', basePrice: 2.99, sku: 'FRUIT001', category: 'Fruits', stockQuantity: 100, reorderPoint: 20, lastUpdated: '2024-01-15', expiryDate: '2024-02-15', hasVariants: false },
  { id: '2', name: 'Fresh Milk', basePrice: 3.49, sku: 'DAIRY001', category: 'Dairy', stockQuantity: 50, reorderPoint: 15, lastUpdated: '2024-01-14', expiryDate: '2024-01-28', hasVariants: false },
  { id: '3', name: 'Whole Grain Bread', basePrice: 4.99, sku: 'BAKERY001', category: 'Bakery', stockQuantity: 30, reorderPoint: 10, lastUpdated: '2024-01-13', expiryDate: '2024-01-20', hasVariants: false },
];

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [inventory, setInventory] = useState<Product[]>(mockInventory);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    basePrice: 0,
    sku: '',
    category: '',
    stockQuantity: 0,
    reorderPoint: 0,
    hasVariants: false,
    variants: []
  });

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.sku || !newProduct.category) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      basePrice: newProduct.basePrice || 0,
      sku: newProduct.sku,
      category: newProduct.category,
      stockQuantity: newProduct.stockQuantity || 0,
      reorderPoint: newProduct.reorderPoint || 0,
      hasVariants: newProduct.hasVariants || false,
      variants: newProduct.variants || [],
      expiryDate: newProduct.expiryDate
    };

    setInventory([...inventory, product]);
    setNewProduct({
      name: '',
      basePrice: 0,
      sku: '',
      category: '',
      stockQuantity: 0,
      reorderPoint: 0,
      hasVariants: false,
      variants: []
    });
    setIsAddProductOpen(false);

    toast({
      title: "Success",
      description: "Product added successfully"
    });
  };

  const handleEditProduct = () => {
    if (!selectedProduct) return;

    setInventory(inventory.map(p => 
      p.id === selectedProduct.id ? selectedProduct : p
    ));
    setIsEditProductOpen(false);
    setSelectedProduct(null);

    toast({
      title: "Success",
      description: "Product updated successfully"
    });
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsEditProductOpen(true);
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
              <h1 className="text-2xl font-bold ml-4">Inventory Management</h1>
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
        <div className="mb-8">
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-500 rounded-full">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Total Items</h2>
                  <p className="text-3xl font-bold">{inventory.length}</p>
                </div>
              </div>
              <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <Input
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        placeholder="Product name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">SKU</label>
                      <Input
                        value={newProduct.sku}
                        onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                        placeholder="SKU"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Category</label>
                      <Input
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        placeholder="Category"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Base Price</label>
                      <Input
                        type="number"
                        value={newProduct.basePrice}
                        onChange={(e) => setNewProduct({ ...newProduct, basePrice: parseFloat(e.target.value) })}
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Stock Quantity</label>
                      <Input
                        type="number"
                        value={newProduct.stockQuantity}
                        onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: parseInt(e.target.value) })}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Reorder Point</label>
                      <Input
                        type="number"
                        value={newProduct.reorderPoint}
                        onChange={(e) => setNewProduct({ ...newProduct, reorderPoint: parseInt(e.target.value) })}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Expiry Date</label>
                      <Input
                        type="date"
                        value={newProduct.expiryDate}
                        onChange={(e) => setNewProduct({ ...newProduct, expiryDate: e.target.value })}
                      />
                    </div>
                    <Button className="w-full" onClick={handleAddProduct}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Product
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Input
              placeholder="Search by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Reorder Point</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>${item.basePrice.toFixed(2)}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.stockQuantity}
                        onChange={(e) => {
                          const newInventory = inventory.map(p =>
                            p.id === item.id ? { ...p, stockQuantity: parseInt(e.target.value) } : p
                          );
                          setInventory(newInventory);
                        }}
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>{item.reorderPoint}</TableCell>
                    <TableCell>
                      {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditClick(item)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            {selectedProduct && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={selectedProduct.name}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                    placeholder="Product name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">SKU</label>
                  <Input
                    value={selectedProduct.sku}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, sku: e.target.value })}
                    placeholder="SKU"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Input
                    value={selectedProduct.category}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, category: e.target.value })}
                    placeholder="Category"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Base Price</label>
                  <Input
                    type="number"
                    value={selectedProduct.basePrice}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, basePrice: parseFloat(e.target.value) })}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Stock Quantity</label>
                  <Input
                    type="number"
                    value={selectedProduct.stockQuantity}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, stockQuantity: parseInt(e.target.value) })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Reorder Point</label>
                  <Input
                    type="number"
                    value={selectedProduct.reorderPoint}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, reorderPoint: parseInt(e.target.value) })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Expiry Date</label>
                  <Input
                    type="date"
                    value={selectedProduct.expiryDate}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, expiryDate: e.target.value })}
                  />
                </div>
                <Button className="w-full" onClick={handleEditProduct}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}