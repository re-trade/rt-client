'use client';

import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { ArrowUpDown, Package, Search } from 'lucide-react';
import { useState } from 'react';

// Sample data - replace with actual API call
const categories = [
  {
    id: '1',
    name: 'Electronics',
    description: 'Electronic devices and accessories',
    productCount: 150,
  },
  {
    id: '2',
    name: 'Clothing',
    description: 'Fashion and apparel',
    productCount: 300,
  },
  {
    id: '3',
    name: 'Books',
    description: 'Books and publications',
    productCount: 200,
  },
  {
    id: '4',
    name: 'Home & Kitchen',
    description: 'Home appliances and kitchenware',
    productCount: 180,
  },
];

const products = {
  '1': [
    {
      id: '1',
      name: 'iPhone 13',
      price: 999,
      stock: 50,
      status: 'active',
      createdAt: '2024-03-15',
    },
    {
      id: '2',
      name: 'Samsung Galaxy S21',
      price: 899,
      stock: 30,
      status: 'active',
      createdAt: '2024-03-14',
    },
  ],
  '2': [
    {
      id: '3',
      name: "Men's T-Shirt",
      price: 29.99,
      stock: 100,
      status: 'active',
      createdAt: '2024-03-13',
    },
    {
      id: '4',
      name: "Women's Dress",
      price: 59.99,
      stock: 75,
      status: 'active',
      createdAt: '2024-03-12',
    },
  ],
  '3': [
    {
      id: '5',
      name: 'The Great Gatsby',
      price: 14.99,
      stock: 200,
      status: 'active',
      createdAt: '2024-03-11',
    },
    {
      id: '6',
      name: 'To Kill a Mockingbird',
      price: 12.99,
      stock: 150,
      status: 'active',
      createdAt: '2024-03-10',
    },
  ],
  '4': [
    {
      id: '7',
      name: 'Coffee Maker',
      price: 79.99,
      stock: 40,
      status: 'active',
      createdAt: '2024-03-09',
    },
    {
      id: '8',
      name: 'Blender',
      price: 49.99,
      stock: 60,
      status: 'active',
      createdAt: '2024-03-08',
    },
  ],
};

type SortField = 'name' | 'price' | 'stock' | 'createdAt';
type SortOrder = 'asc' | 'desc';

export default function ProductManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const itemsPerPage = 10;

  // Filter and sort products
  const filteredProducts = selectedCategory
    ? products[selectedCategory as keyof typeof products]
        .filter((product) => {
          const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;
          return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
          let comparison = 0;
          switch (sortField) {
            case 'name':
              comparison = a.name.localeCompare(b.name);
              break;
            case 'price':
              comparison = a.price - b.price;
              break;
            case 'stock':
              comparison = a.stock - b.stock;
              break;
            case 'createdAt':
              comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
              break;
          }
          return sortOrder === 'asc' ? comparison : -comparison;
        })
    : [];

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Product Management</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((category) => (
          <Card
            key={category.id}
            className={`cursor-pointer p-6 transition-colors hover:bg-accent ${
              selectedCategory === category.id ? 'border-primary' : ''
            }`}
            onClick={() => {
              setSelectedCategory(category.id);
              setCurrentPage(1);
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {category.productCount} products
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedCategory && (
        <Card className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('name')}
                      className="flex items-center gap-1"
                    >
                      Name
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('price')}
                      className="flex items-center gap-1"
                    >
                      Price
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('stock')}
                      className="flex items-center gap-1"
                    >
                      Stock
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('createdAt')}
                      className="flex items-center gap-1"
                    >
                      Created At
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          product.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {product.status}
                      </span>
                    </TableCell>
                    <TableCell>{product.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="icon">
                          <Package className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredProducts.length)} of{' '}
              {filteredProducts.length} products
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
