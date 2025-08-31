'use client';

import { productHistoryApi } from '@/services/product-history.api';
import { productApi, type TProduct } from '@/services/product.api';
import { getSellerProfile, type TSellerProfile } from '@/services/report.seller.api';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type TProductHistory = {
  productId: string;
  productName: string;
  productThumbnail: string;
  productDescription: string;
  ownerId: string;
  ownerName: string;
  ownerAvatarUrl: string;
};

export const useProductDetail = (productId: string | null) => {
  const [product, setProduct] = useState<TProduct | null>(null);
  const [sellerProfile, setSellerProfile] = useState<TSellerProfile | null>(null);
  const [productHistory, setProductHistory] = useState<TProductHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [sellerLoading, setSellerLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchProduct = async (id: string) => {
    try {
      setLoading(true);
      const productData = await productApi.getProduct(id);
      setProduct(productData);

      if (productData?.sellerId) {
        fetchSellerProfile(productData.sellerId);
      }
    } catch (error) {
      toast.error('Không thể tải thông tin sản phẩm');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchSellerProfile = async (sellerId: string) => {
    try {
      setSellerLoading(true);
      const seller = await getSellerProfile(sellerId);
      setSellerProfile(seller || null);
    } catch (error) {
      toast.error('Không thể tải thông tin người bán');
      setSellerProfile(null);
    } finally {
      setSellerLoading(false);
    }
  };

  const fetchProductHistory = async (id: string) => {
    try {
      setHistoryLoading(true);
      const response = await productHistoryApi.getProductHistory(id);
      setProductHistory(response);
      console.log('Product history:', response);
    } catch (error) {
      toast.error('Không thể tải lịch sử sản phẩm');
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleVerifyProduct = async () => {
    if (!product) return;

    try {
      setActionLoading(true);
      const response = await productApi.verifyProduct(product.id);
      if (response.success) {
        setProduct({ ...product, verified: true });
        toast.success('Đã xác minh sản phẩm');
      }
    } catch (error) {
      toast.error('Không thể xác minh sản phẩm');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnverifyProduct = async () => {
    if (!product) return;

    try {
      setActionLoading(true);
      const response = await productApi.unverifyProduct(product.id);
      if (response.success) {
        setProduct({ ...product, verified: false });
        toast.success('Đã hủy xác minh sản phẩm');
      }
    } catch (error) {
      toast.error('Không thể hủy xác minh sản phẩm');
    } finally {
      setActionLoading(false);
    }
  };

  const refetchProduct = () => {
    if (productId) {
      fetchProduct(productId);
    }
  };

  const refetchProductHistory = () => {
    if (productId) {
      fetchProductHistory(productId);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
      fetchProductHistory(productId);
    }
  }, [productId]);

  return {
    product,
    sellerProfile,
    productHistory,
    loading,
    historyLoading,
    sellerLoading,
    actionLoading,
    fetchProduct,
    fetchSellerProfile,
    fetchProductHistory,
    handleVerifyProduct,
    handleUnverifyProduct,
    refetchProduct,
    refetchProductHistory,
  };
};
