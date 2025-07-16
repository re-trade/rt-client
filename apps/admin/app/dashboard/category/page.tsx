'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Laptop,
  DeviceMobile,
  TShirt,
  House,
  Camera,
  SpeakerHigh,
  Tag,
} from 'phosphor-react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Category {
  id: string;
  name: string;
  description?: string | null;
  parentId?: string | null;
  parentName?: string | null;
  visible: boolean;
  children?: Category[] | null;
}

// Helper function to get an icon and color based on category name
const getIconForCategory = (name: string): { Icon: React.ElementType, color: string } => {
  const lowerCaseName = name.toLowerCase();
  if (
    lowerCaseName.includes('electronic') ||
    lowerCaseName.includes('computer') ||
    lowerCaseName.includes('laptop') ||
    lowerCaseName.includes('computing')
  ) {
    return { Icon: Laptop, color: '#3b82f6' };
  }
  if (lowerCaseName.includes('phone') || lowerCaseName.includes('mobile')) {
    return { Icon: DeviceMobile, color: '#06b6d4' };
  }
  if (lowerCaseName.includes('fashion') || lowerCaseName.includes('apparel') || lowerCaseName.includes('clothing')) {
    return { Icon: TShirt, color: '#f472b6' };
  }
  if (lowerCaseName.includes('home') || lowerCaseName.includes('appliances')) {
    return { Icon: House, color: '#f59e42' };
  }
  if (lowerCaseName.includes('camera') || lowerCaseName.includes('photography')) {
    return { Icon: Camera, color: '#a78bfa' };
  }
  if (lowerCaseName.includes('audio') || lowerCaseName.includes('music') || lowerCaseName.includes('speaker')) {
    return { Icon: SpeakerHigh, color: '#facc15' };
  }
  return { Icon: Tag, color: '#64748b' }; // Default icon
};


const fetchCategories = async (token: string): Promise<Category[]> => {
  const res = await fetch('https://dev.retrades.trade/api/main/v1/categories?page=0&size=50', {
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });
  const data = await res.json();
  return data.content || [];
};

function TreeTableRow({
  category,
  level = 0,
  parentExpanded = true,
}: {
  category: Category;
  level?: number;
  parentExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = category.children && category.children.length > 0;
  const { Icon, color } = getIconForCategory(category.name);

  if (!parentExpanded) return null;

  return (
    <>
      <TableRow className="transition-colors hover:bg-gray-50 group">
        <TableCell style={{ paddingLeft: `${level * 24 + 16}px` }}>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 transition-colors ${
                hasChildren ? 'hover:bg-gray-200' : 'opacity-50 cursor-default'
              }`}
              onClick={hasChildren ? () => setExpanded((e) => !e) : undefined}
              aria-label={expanded ? 'Thu gọn' : 'Mở rộng'}
              disabled={!hasChildren}
              tabIndex={hasChildren ? 0 : -1}
            >
              {expanded ? (
                <ChevronDown size={16} className={hasChildren ? 'text-gray-700' : 'text-gray-300'} />
              ) : (
                <ChevronRight size={16} className={hasChildren ? 'text-gray-700' : 'text-gray-300'} />
              )}
            </Button>
            <Icon size={20} weight="duotone" color={color} className="transition-colors group-hover:scale-110" />
            <span className="font-medium group-hover:text-blue-600 transition-colors">
              {category.name}
            </span>
          </div>
        </TableCell>
        <TableCell>{category.description || <span className="text-gray-400">(Không có)</span>}</TableCell>
        <TableCell>
          {category.visible ? (
            <span className="text-xs text-green-600 bg-green-100 rounded px-2 py-0.5">Hiện</span>
          ) : (
            <span className="text-xs text-gray-500 bg-gray-100 rounded px-2 py-0.5">Ẩn</span>
          )}
        </TableCell>
        <TableCell>
          <Button size="sm" variant="outline" className="mr-2">
            Sửa
          </Button>
          <Button size="sm" variant="destructive" className="mr-2">
            Xóa
          </Button>
          <Button size="sm" variant="secondary">
            Thêm con
          </Button>
        </TableCell>
      </TableRow>
      {hasChildren &&
        expanded &&
        category.children!.map((child) => (
          <TreeTableRow
            key={child.id}
            category={child}
            level={level + 1}
            parentExpanded={expanded}
          />
        ))}
    </>
  );
}

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoading(true);
    fetchCategories(token || '')
      .then((data) => setCategories(data))
      .catch(() => setError('Lỗi khi tải danh mục.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Quản lý Category</h2>
      <Separator className="mb-4" />
      {loading && <div>Đang tải...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-2/5">Tên danh mục</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories
                .filter((cat) => cat.parentId === null)
                .map((cat) => (
                  <TreeTableRow key={cat.id} category={cat} />
                ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
