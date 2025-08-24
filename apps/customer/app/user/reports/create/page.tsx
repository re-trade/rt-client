'use client';

import LoadingSpinner from '@/components/common/Loading';
import { orderApi, type OrderCombo, OrderItem } from '@services/order.api';
import {
  customerReportApi,
  type ReportFormData,
  type ReportFormErrors,
  type ReportType,
} from '@services/report.api';
import { IconAlertCircle, IconCheck, IconUpload, IconX } from '@tabler/icons-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CreateReportPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const comboId = searchParams.get('comboId');
  const sellerId = searchParams.get('sellerId');

  const [formData, setFormData] = useState<ReportFormData>({
    productId: '',
    comboId: comboId || '',
    sellerId: sellerId || '',
    typeReport: '' as ReportType,
    content: '',
    evidenceUrls: [],
  });

  const [errors, setErrors] = useState<ReportFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [reportTypes, setReportTypes] = useState<ReportType[]>([]);
  const [comboDetails, setComboDetails] = useState<OrderCombo | null>(null);
  const [isFetchingCombo, setIsFetchingCombo] = useState(true);

  useEffect(() => {
    if (!comboId || !sellerId) {
      router.push('/user/reports/search');
      return;
    }

    const fetchInitialData = async () => {
      try {
        setIsFetchingCombo(true);
        const [types, combo] = await Promise.all([
          customerReportApi.getReportTypes(),
          orderApi.getOrderById(comboId),
        ]);
        setReportTypes(types);
        setComboDetails(combo);
      } catch (error) {
        setErrors((prev) => ({ ...prev, general: 'Không thể tải thông tin đơn hàng.' }));
      } finally {
        setIsFetchingCombo(false);
      }
    };

    fetchInitialData();
  }, [comboId, sellerId, router]);

  const validateForm = (): boolean => {
    const newErrors: ReportFormErrors = {};

    if (!formData.productId) {
      newErrors.productId = 'Vui lòng chọn một sản phẩm để báo cáo';
    }

    if (!formData.typeReport) {
      newErrors.typeReport = 'Vui lòng chọn loại báo cáo';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Vui lòng mô tả chi tiết vấn đề';
    } else if (formData.content.trim().length < 10) {
      newErrors.content = 'Mô tả phải có ít nhất 10 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      setErrors({});

      await customerReportApi.createReport({
        sellerId: formData.sellerId,
        typeReport: formData.typeReport,
        content: formData.content.trim(),
        orderId: formData.comboId,
        productId: formData.productId,
        evidenceUrls: formData.evidenceUrls,
      });

      setSuccess(true);
      setTimeout(() => {
        router.push('/user/reports');
      }, 2000);
    } catch (error) {
      console.error('Error creating report:', error);
      setErrors({
        general: 'Không thể tạo báo cáo. Vui lòng thử lại sau.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newUrls = Array.from(files).map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({
      ...prev,
      evidenceUrls: [...prev.evidenceUrls, ...newUrls],
    }));
  };

  const removeEvidence = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      evidenceUrls: prev.evidenceUrls.filter((_, i) => i !== index),
    }));
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconCheck size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">
            Báo cáo đã được tạo thành công!
          </h2>
          <p className="text-green-600 mb-4">
            Báo cáo của bạn đã được gửi và sẽ được xử lý trong thời gian sớm nhất.
          </p>
          <p className="text-sm text-green-600">Đang chuyển hướng về danh sách báo cáo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Tạo báo cáo mới
        </h1>
        <p className="text-gray-600 mt-2">Mô tả chi tiết vấn đề bạn gặp phải với đơn hàng này</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-orange-200 p-6">
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <IconAlertCircle size={20} className="text-red-500" />
              <p className="text-red-600">{errors.general}</p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Thông tin đơn hàng</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Mã đơn hàng:</span>
                <p className="font-medium">{formData.comboId}</p>
              </div>
              <div>
                <span className="text-gray-600">Mã người bán:</span>
                <p className="font-medium">{formData.sellerId}</p>
              </div>
            </div>
            {isFetchingCombo ? (
              <div className="space-y-4">
                <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="w-16 h-16 bg-gray-200 rounded animate-pulse"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              comboDetails && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn sản phẩm để báo cáo <span className="text-red-500">*</span>
                  </label>
                  <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                    {comboDetails.items.map((product: OrderItem) => (
                      <label
                        key={product.productId}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="product-selection"
                          value={product.productId}
                          checked={formData.productId === product.productId}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, productId: e.target.value }))
                          }
                          className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                        />
                        <img
                          src={product.itemThumbnail}
                          alt={product.itemName}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{product.itemName}</p>
                          <p className="text-sm text-gray-600">Số lượng: {product.quantity}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.productId && (
                    <p className="text-red-500 text-sm mt-1">{errors.productId}</p>
                  )}
                </div>
              )
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại báo cáo <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.typeReport}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, typeReport: e.target.value as ReportType }))
              }
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 ${
                errors.typeReport ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Chọn loại báo cáo</option>
              {reportTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.typeReport && <p className="text-red-500 text-sm mt-1">{errors.typeReport}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả chi tiết <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
              placeholder="Vui lòng mô tả chi tiết vấn đề bạn gặp phải..."
              rows={6}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 resize-none ${
                errors.content ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.content ? (
                <p className="text-red-500 text-sm">{errors.content}</p>
              ) : (
                <p className="text-gray-500 text-sm">Tối thiểu 10 ký tự</p>
              )}
              <p className="text-gray-500 text-sm">{formData.content.length}/1000</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bằng chứng</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="evidence-upload"
              />
              <label
                htmlFor="evidence-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <IconUpload size={32} className="text-gray-400" />
                <p className="text-gray-600">Nhấp để tải lên hình ảnh bằng chứng</p>
                <p className="text-sm text-gray-500">PNG, JPG tối đa 5MB mỗi file</p>
              </label>
            </div>

            {/* Evidence Preview */}
            {formData.evidenceUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {formData.evidenceUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Evidence ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeEvidence(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <IconX size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            disabled={loading}
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && <LoadingSpinner />}
            {loading ? 'Đang gửi...' : 'Gửi báo cáo'}
          </button>
        </div>
      </form>
    </div>
  );
}
