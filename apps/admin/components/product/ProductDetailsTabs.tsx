'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TProduct } from '@/services/product.api';
import { Tag } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface ProductDetailsTabsProps {
  product: TProduct;
}

export function ProductDetailsTabs({ product }: ProductDetailsTabsProps) {
  const [activeTab, setActiveTab] = useState('description');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5 text-orange-500" />
          Thông tin chi tiết
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('description')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'description'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Mô tả sản phẩm
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'categories'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Danh mục & Thẻ
              </button>
            </nav>
          </div>

          <div className="mt-6">
            {activeTab === 'description' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Mô tả ngắn</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{product.shortDescription}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Mô tả chi tiết</h4>
                  <div className="bg-gray-50 p-4 rounded-lg prose prose-sm max-w-none text-gray-700 prose-headings:text-gray-900 prose-links:text-orange-600">
                    <ReactMarkdown>{product.description}</ReactMarkdown>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'categories' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Danh mục</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.categories.map((category) => (
                      <Badge
                        key={category.id}
                        variant="outline"
                        className="bg-orange-50 text-orange-700 border-orange-200"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Thẻ</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-700">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
