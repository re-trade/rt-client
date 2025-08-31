'use client';

import { Badge } from '@/components/ui/badge';
import { productApi, type TProduct } from '@/services/product.api';
import { Check, Eye, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProductTable() {
  const router = useRouter();
  const [products, setProducts] = useState<TProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productApi.getAllProducts(currentPage, 10);
      if (response.success) {
        setProducts(response.content.content);
        setTotalPages(response.content.totalPages);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (productId: string) => {
    router.push(`/dashboard/product/${productId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'DELETED':
        return 'bg-red-100 text-red-800';
      case 'DRAFT':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <div className="w-full">
        <h2 className="text-2xl font-bold mb-6 text-[#4A4039]">Products</h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#4A4039]">Products</h2>
        <div className="text-sm text-gray-600">
          Trang {currentPage + 1} / {totalPages} - Tổng: {products.length} sản phẩm
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-[#F5E8C7] text-[#4A4039]">
              <th className="p-4 text-left">Hình ảnh</th>
              <th className="p-4 text-left">Tên sản phẩm</th>
              <th className="p-4 text-left">Người bán</th>
              <th className="p-4 text-left">Thương hiệu</th>
              <th className="p-4 text-left">Giá</th>
              <th className="p-4 text-left">Trạng thái</th>
              <th className="p-4 text-left">Xác minh</th>
              <th className="p-4 text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleRowClick(product.id)}
              >
                <td className="p-4">
                  {product.thumbnail ? (
                    <img
                      src={product.thumbnail}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No img</span>
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <div>
                    <p className="font-medium text-gray-900">{truncateText(product.name, 30)}</p>
                    <p className="text-sm text-gray-600">
                      {truncateText(product.shortDescription, 40)}
                    </p>
                  </div>
                </td>
                <td className="p-4">
                  <div>
                    <p className="font-medium">{product.sellerShopName}</p>
                    <p className="text-sm text-gray-600">ID: {product.sellerId}</p>
                  </div>
                </td>
                <td className="p-4">
                  <span className="font-medium">{product.brand}</span>
                  {product.model && <p className="text-sm text-gray-600">{product.model}</p>}
                </td>
                <td className="p-4">
                  <span className="font-semibold text-orange-600">
                    {product.currentPrice.toLocaleString('vi-VN')} VND
                  </span>
                  <p className="text-sm text-gray-600">SL: {product.quantity}</p>
                </td>
                <td className="p-4">
                  <Badge className={getStatusColor(product.status)}>{product.status}</Badge>
                  {product.retraded && (
                    <Badge className="bg-blue-100 text-blue-800 ml-1">Retrade</Badge>
                  )}
                </td>
                <td className="p-4">
                  {product.verified ? (
                    <div className="flex items-center text-green-600">
                      <Check className="w-4 h-4 mr-1" />
                      <span className="text-sm">Đã xác minh</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-500">
                      <X className="w-4 h-4 mr-1" />
                      <span className="text-sm">Chưa xác minh</span>
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRowClick(product.id);
                    }}
                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    <span className="text-sm">Xem</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Trước
          </button>

          <span className="px-3 py-1 text-sm">
            {currentPage + 1} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage >= totalPages - 1}
            className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
}
