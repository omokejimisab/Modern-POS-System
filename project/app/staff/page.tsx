"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sun, Moon, ArrowLeft, Plus, Search, Save } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Staff } from '@/lib/types';

const mockStaff = [
  { id: '1', name: 'Admin', role: 'admin', pin: '1234', email: 'admin@pos.com', active: true, lastActive: '2024-01-15 09:30' },
  { id: '2', name: 'John Doe', role: 'cashier', pin: '5678', email: 'john@pos.com', active: true, lastActive: '2024-01-15 08:45' },
  { id: '3', name: 'Jane Smith', role: 'cashier', pin: '9012', email: 'jane@pos.com', active: true, lastActive: '2024-01-14 17:20' },
];

export default function StaffPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [staff, setStaff] = useState<Staff[]>(mockStaff);
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [isEditStaffOpen, setIsEditStaffOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [newStaff, setNewStaff] = useState<Partial<Staff>>({
    name: '',
    email: '',
    pin: '',
    role: 'cashier',
    active: true
  });
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const filteredStaff = staff.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStaff = () => {
    if (!newStaff.name || !newStaff.email || !newStaff.pin) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (newStaff.pin.length !== 4) {
      toast({
        title: "Invalid PIN",
        description: "PIN must be 4 digits",
        variant: "destructive"
      });
      return;
    }

    const staffMember: Staff = {
      id: Date.now().toString(),
      name: newStaff.name,
      email: newStaff.email,
      pin: newStaff.pin,
      role: newStaff.role as 'admin' | 'cashier',
      active: true,
      lastActive: new Date().toISOString()
    };

    setStaff([...staff, staffMember]);
    setNewStaff({
      name: '',
      email: '',
      pin: '',
      role: 'cashier',
      active: true
    });
    setIsAddStaffOpen(false);

    toast({
      title: "Success",
      description: "Staff member added successfully"
    });
  };

  const handleEditStaff = () => {
    if (!selectedStaff) return;

    setStaff(staff.map(s => 
      s.id === selectedStaff.id ? selectedStaff : s
    ));
    setIsEditStaffOpen(false);
    setSelectedStaff(null);

    toast({
      title: "Success",
      description: "Staff member updated successfully"
    });
  };

  const handleEditClick = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setIsEditStaffOpen(true);
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
              <h1 className="text-2xl font-bold ml-4">Staff Management</h1>
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
        <div className="mb-6 flex justify-between items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Dialog open={isAddStaffOpen} onOpenChange={setIsAddStaffOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Staff
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Staff Member</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={newStaff.name}
                    onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                    placeholder="Enter name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                    placeholder="Enter email"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">PIN (4 digits)</label>
                  <Input
                    type="password"
                    maxLength={4}
                    value={newStaff.pin}
                    onChange={(e) => setNewStaff({ ...newStaff, pin: e.target.value })}
                    placeholder="Enter PIN"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Role</label>
                  <Select
                    value={newStaff.role}
                    onValueChange={(value) => setNewStaff({ ...newStaff, role: value as 'admin' | 'cashier' })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="cashier">Cashier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" onClick={handleAddStaff}>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>PIN</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.map((staffMember) => (
                <TableRow key={staffMember.id}>
                  <TableCell className="font-medium">{staffMember.name}</TableCell>
                  <TableCell>{staffMember.email}</TableCell>
                  <TableCell className="capitalize">{staffMember.role}</TableCell>
                  <TableCell>****</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      staffMember.active 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {staffMember.active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell>{staffMember.lastActive}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditClick(staffMember)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <Dialog open={isEditStaffOpen} onOpenChange={setIsEditStaffOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Staff Member</DialogTitle>
            </DialogHeader>
            {selectedStaff && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={selectedStaff.name}
                    onChange={(e) => setSelectedStaff({ ...selectedStaff, name: e.target.value })}
                    placeholder="Enter name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={selectedStaff.email}
                    onChange={(e) => setSelectedStaff({ ...selectedStaff, email: e.target.value })}
                    placeholder="Enter email"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">PIN (4 digits)</label>
                  <Input
                    type="password"
                    maxLength={4}
                    value={selectedStaff.pin}
                    onChange={(e) => setSelectedStaff({ ...selectedStaff, pin: e.target.value })}
                    placeholder="Enter PIN"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Role</label>
                  <Select
                    value={selectedStaff.role}
                    onValueChange={(value) => setSelectedStaff({ ...selectedStaff, role: value as 'admin' | 'cashier' })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="cashier">Cashier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={selectedStaff.active ? 'active' : 'inactive'}
                    onValueChange={(value) => setSelectedStaff({ ...selectedStaff, active: value === 'active' })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" onClick={handleEditStaff}>
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