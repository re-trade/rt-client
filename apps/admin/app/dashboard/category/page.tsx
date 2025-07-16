"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronRight } from "lucide-react";

interface Category {
  id: string;
  name: string;
  description?: string | null;
  parentId?: string | null;
  parentName?: string | null;
  visible: boolean;
  children?: Category[] | null;
}

const fetchCategories = async (token: string): Promise<Category[]> => {
  const res = await fetch(
    "https://dev.retrades.trade/api/main/v1/categories?page=0&size=50",
    {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );
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

  if (!parentExpanded) return null;

  return (
    <>
      <TableRow className="transition-colors hover:bg-gray-50 group">
        <TableCell style={{ paddingLeft: `${level * 24 + 8}px` }}>
          {/* Mũi tên luôn hiển thị, nếu không có con thì disabled và màu xám nhạt */}
          <Button
            variant="ghost"
            size="icon"
            className={`mr-1 transition-colors ${hasChildren ? 'hover:bg-gray-200' : 'opacity-50 cursor-default'}`}
            onClick={hasChildren ? () => setExpanded((e) => !e) : undefined}
            aria-label={expanded ? "Thu gọn" : "Mở rộng"}
            disabled={!hasChildren}
            tabIndex={hasChildren ? 0 : -1}
          >
            {expanded ? (
              <ChevronDown size={16} className={hasChildren ? "text-gray-700" : "text-gray-300"} />
            ) : (
              <ChevronRight size={16} className={hasChildren ? "text-gray-700" : "text-gray-300"} />
            )}
          </Button>
          <span className="font-medium group-hover:text-blue-600 transition-colors">{category.name}</span>
        </TableCell>
        <TableCell>{category.description || <span className="text-gray-400">(Không có)</span>}</TableCell>
        <TableCell>
          {category.visible ? (
            <span className="text-xs text-green-600 bg-green-100 rounded px-2">Hiện</span>
          ) : (
            <span className="text-xs text-gray-500 bg-gray-100 rounded px-2">Ẩn</span>
          )}
        </TableCell>
        <TableCell>
          <Button size="sm" variant="outline" className="mr-2">Sửa</Button>
          <Button size="sm" variant="destructive" className="mr-2">Xóa</Button>
          <Button size="sm" variant="secondary">Thêm con</Button>
        </TableCell>
      </TableRow>
      {hasChildren && expanded &&
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
    const token = localStorage.getItem("token");
    setLoading(true);
    fetchCategories(token || "")
      .then((data) => setCategories(data))
      .catch(() => setError("Lỗi khi tải danh mục."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Quản lý Category</h2>
      <Separator className="mb-4" />
      {loading && <div>Đang tải...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && (
        <Card className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên danh mục</TableHead>
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
