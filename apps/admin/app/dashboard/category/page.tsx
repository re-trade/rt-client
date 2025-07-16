"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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

function CategoryTree({ categories }: { categories: Category[] }) {
  return (
    <ul className="pl-4">
      {categories.map((cat) => (
        <li key={cat.id} className="mb-2">
          <div className="flex items-center gap-2">
            <span className="font-medium">{cat.name}</span>
            {cat.visible ? (
              <span className="text-xs text-green-600 bg-green-100 rounded px-2">Hiện</span>
            ) : (
              <span className="text-xs text-gray-500 bg-gray-100 rounded px-2">Ẩn</span>
            )}
            {cat.description && (
              <span className="text-xs text-gray-400 ml-2">{cat.description}</span>
            )}
            {/* Thao tác: Sửa, Xóa, Thêm con */}
            <Button size="sm" variant="outline" className="ml-2">Sửa</Button>
            <Button size="sm" variant="destructive">Xóa</Button>
            <Button size="sm" variant="secondary">Thêm con</Button>
          </div>
          {cat.children && cat.children.length > 0 && (
            <CategoryTree categories={cat.children} />
          )}
        </li>
      ))}
    </ul>
  );
}

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Không tìm thấy token đăng nhập.");
      return;
    }
    setLoading(true);
    fetchCategories(token)
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
          <CategoryTree categories={categories} />
        </Card>
      )}
    </div>
  );
} 