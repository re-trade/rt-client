'use client';

import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Slider } from '@/app/components/ui/slider';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/app/components/ui/breadcrumb';
import { Plus, Search, Filter, Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';

// Sample data - replace with actual API calls
const categories = [
  { id: 1, name: 'Electronics', parentId: null },
  { id: 2, name: 'Clothing', parentId: null },
  { id: 3, name: 'Smartphones', parentId: 1 },
  { id: 4, name: 'Laptops', parentId: 1 },
  { id: 5, name: 'Men', parentId: 2 },
  { id: 6, name: 'Women', parentId: 2 },
];

const brands = [
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Samsung' },
  { id: 3, name: 'Nike' },
  { id: 4, name: 'Adidas' },
];

const products = [
  {
    id: 1,
    name: 'iPhone 13 Pro',
    image: '/products/iphone-13-pro.jpg',
    price: 999.99,
    stock: 50,
    status: 'active',
    category: 'Smartphones',
    brand: 'Apple',
    seller: 'Apple Store',
    createdAt: '2024-01-15',
  },
  // Add more sample products...
];

type Category = {
  id: number;
  name: string;
  parentId: number | null;
};

type Brand = {
  id: number;
  name: string;
};

type Product = {
  id: number;
  name: string;
  image: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  category: string;
  brand: string;
  seller: string;
  createdAt: string;
};

export default function ProductManagementPage() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [productStatus, setProductStatus] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter products based on selected criteria
  const filteredProducts = products.filter((product) => {
    const matchesCategory = !selectedCategory || product.category === categories.find(c => c.id === selectedCategory)?.name;
    const matchesSubcategory = !selectedSubcategory || product.category === categories.find(c => c.id === selectedSubcategory)?.name;
    const matchesBrand = !selectedBrand || product.brand === brands.find(b => b.id === selectedBrand)?.name;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesStatus = productStatus.length === 0 || productStatus.includes(product.status);

    return matchesCategory && matchesSubcategory && matchesBrand && matchesSearch && matchesPrice && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(paginatedProducts.map((product) => product.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: number, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    }
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    out_of_stock: 'bg-red-100 text-red-800',
  } as const;

  type ProductStatus = keyof typeof statusColors;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Quản lý sản phẩm</h1>
      </div>

      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/product-management">Sản phẩm</BreadcrumbLink>
          </BreadcrumbItem>
          {selectedCategory && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">{categories.find(c => c.id === selectedCategory)?.name}</BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
          {selectedSubcategory && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{categories.find(c => c.id === selectedSubcategory)?.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>

      {/* Advanced Filters */}
      <Card className="p-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Danh mục</label>
            <Select
              value={selectedCategory?.toString() || 'all'}
              onValueChange={(value) => setSelectedCategory(value === 'all' ? null : parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {categories
                  .filter((category) => !category.parentId)
                  .map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Danh mục con</label>
            <Select
              value={selectedSubcategory?.toString() || 'all'}
              onValueChange={(value) => setSelectedSubcategory(value === 'all' ? null : parseInt(value))}
              disabled={!selectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục con" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {categories
                  .filter((category) => category.parentId === selectedCategory)
                  .map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Thương hiệu</label>
            <Select
              value={selectedBrand?.toString() || 'all'}
              onValueChange={(value) => setSelectedBrand(value === 'all' ? null : parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn thương hiệu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id.toString()}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Trạng thái</label>
            <div className="space-y-2">
              {['active', 'inactive', 'out_of_stock'].map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={status}
                    checked={productStatus.includes(status)}
                    onCheckedChange={(checked: boolean) => {
                      if (checked) {
                        setProductStatus([...productStatus, status]);
                      } else {
                        setProductStatus(productStatus.filter((s) => s !== status));
                      }
                    }}
                  />
                  <label
                    htmlFor={status}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1)}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Khoảng giá</label>
            <div className="flex items-center gap-4">
              <Input
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="w-32"
              />
              <span>-</span>
              <Input
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-32"
              />
            </div>
            <Slider
              value={priceRange}
              onValueChange={(value) => setPriceRange(value as [number, number])}
              min={0}
              max={1000}
              step={10}
              className="mt-2"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tìm kiếm</label>
            <div className="flex gap-2">
              <Input
                placeholder="Tìm theo tên hoặc mã sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="outline">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Products Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedProducts.length === paginatedProducts.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Sản phẩm</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Số lượng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Thương hiệu</TableHead>
              <TableHead>Shop</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedProducts.includes(product.id)}
                    onCheckedChange={(checked: boolean) => handleSelectProduct(product.id, checked)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="relative h-10 w-10">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="rounded-md object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">ID: {product.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{product.price.toLocaleString('vi-VN')}đ</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <Badge className={statusColors[product.status as ProductStatus]}>
                    {product.status.replace('_', ' ').charAt(0).toUpperCase() + product.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {categories.find((c) => c.id === selectedCategory)?.name}
                </TableCell>
                <TableCell>
                  {brands.find((b) => b.id === selectedBrand)?.name}
                </TableCell>
                <TableCell>{product.seller}</TableCell>
                <TableCell>{new Date(product.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      Sửa
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500">
                      Xóa
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4">
          <p className="text-sm text-muted-foreground">
            Hiển thị {paginatedProducts.length} trên tổng số {filteredProducts.length} sản phẩm
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Sau
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
