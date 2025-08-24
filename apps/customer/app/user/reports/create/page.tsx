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
import { storageApi } from '../../../../../seller/service/storage.api';

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
    evidenceFiles: [],
  });

  const [errors, setErrors] = useState<ReportFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [reportTypes, setReportTypes] = useState<ReportType[]>([]);
  const [comboDetails, setComboDetails] = useState<OrderCombo | null>(null);
  const [isFetchingCombo, setIsFetchingCombo] = useState(true);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

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

    setLoading(true);
    setErrors({});

    try {
      let uploadedUrls: string[] = [];
      if (formData.evidenceFiles.length > 0) {
        setIsUploading(true);
        const response = await storageApi.fileBulkUpload(formData.evidenceFiles);
        if (response.success && response.content) {
          uploadedUrls = response.content;
        } else {
          throw new Error(response.messages?.[0] || 'File upload failed');
        }
        setIsUploading(false);
      }

      await customerReportApi.createReport({
        sellerId: formData.sellerId,
        typeReport: formData.typeReport,
        content: formData.content.trim(),
        orderId: formData.comboId,
        productId: formData.productId,
        evidenceUrls: uploadedUrls,
      });

      setSuccess(true);
      setTimeout(() => {
        router.push('/user/reports');
      }, 2000);
    } catch (error) {
      console.error('Failed to create report:', error);
      setErrors({
        general: 'Không thể tạo báo cáo. Vui lòng thử lại sau.',
      });
    } finally {
      setIsUploading(false);
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    setFormData((prev) => ({
      ...prev,
      evidenceFiles: [...prev.evidenceFiles, ...newFiles],
    }));

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeEvidence = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      evidenceFiles: prev.evidenceFiles.filter((_, i) => i !== index),
    }));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-white to-orange-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl border border-green-200 p-8 max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <IconCheck size={48} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Báo cáo đã được tạo thành công!</h2>
          <p className="text-gray-600 mb-6">
            Báo cáo của bạn đã được gửi và sẽ được xử lý trong thời gian sớm nhất.
          </p>
          <p className="text-sm text-gray-500">Đang chuyển hướng về danh sách báo cáo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-white to-orange-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tạo báo cáo mới</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Mô tả chi tiết vấn đề bạn gặp phải với đơn hàng này.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl border border-gray-200"
        >
          <div className="p-6 sm:p-8 space-y-8">
            {errors.general && (
              <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <IconAlertCircle size={24} className="text-red-500" />
                  <p className="text-red-700 font-medium">{errors.general}</p>
                </div>
              </div>
            )}

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">Thông tin đơn hàng</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6 font-mono">
                <div>
                  <span className="text-gray-600">Mã đơn hàng:</span>
                  <p className="font-semibold text-gray-800">{formData.comboId}</p>
                </div>
                <div>
                  <span className="text-gray-600">Mã người bán:</span>
                  <p className="font-semibold text-gray-800">{formData.sellerId}</p>
                </div>
              </div>
              {isFetchingCombo ? (
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-40 animate-pulse"></div>
                  <div className="border border-gray-200 rounded-xl p-4 space-y-4">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                comboDetails && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Chọn sản phẩm để báo cáo <span className="text-red-500">*</span>
                    </label>
                    <div className="border border-gray-200 rounded-xl p-2 space-y-2">
                      {comboDetails.items.map((product: OrderItem) => (
                        <label
                          key={product.productId}
                          className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all duration-200 ${formData.productId === product.productId ? 'bg-orange-100 ring-2 ring-orange-400' : 'hover:bg-gray-100'}`}
                        >
                          <input
                            type="radio"
                            name="product-selection"
                            value={product.productId}
                            checked={formData.productId === product.productId}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, productId: e.target.value }))
                            }
                            className="h-5 w-5 text-orange-600 border-gray-300 focus:ring-orange-500"
                          />
                          <img
                            src={product.itemThumbnail}
                            alt={product.itemName}
                            className="w-16 h-16 object-cover rounded-md border border-gray-200"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{product.itemName}</p>
                            <p className="text-sm text-gray-600">Số lượng: {product.quantity}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                    {errors.productId && (
                      <p className="text-red-500 text-sm mt-2">{errors.productId}</p>
                    )}
                  </div>
                )
              )}
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại báo cáo <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.typeReport}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, typeReport: e.target.value as ReportType }))
                  }
                  className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 bg-white text-gray-900 focus:ring-2 focus:ring-orange-400 ${
                    errors.typeReport ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="" className="text-gray-500">
                    Chọn loại báo cáo
                  </option>
                  {reportTypes.map((type) => (
                    <option key={type} value={type} className="text-gray-900 bg-white">
                      {type}
                    </option>
                  ))}
                </select>
                {errors.typeReport && (
                  <p className="text-red-500 text-sm mt-2">{errors.typeReport}</p>
                )}
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
                  className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 bg-white text-gray-900 resize-none focus:ring-2 focus:ring-orange-400 ${
                    errors.content ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                <div className="flex justify-between items-center mt-2">
                  {errors.content ? (
                    <p className="text-red-500 text-sm">{errors.content}</p>
                  ) : (
                    <p className="text-gray-500 text-sm">Tối thiểu 10 ký tự</p>
                  )}
                  <p className="text-gray-500 text-sm">{formData.content.length}/1000</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bằng chứng (tùy chọn)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-400 transition-all duration-200 bg-white">
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
                    className="cursor-pointer flex flex-col items-center gap-3 text-gray-600"
                  >
                    <IconUpload size={36} className="text-gray-400" />
                    <p className="font-semibold">Nhấp để tải lên hình ảnh bằng chứng</p>
                    <p className="text-sm">PNG, JPG tối đa 5MB mỗi file</p>
                  </label>
                </div>

                {/* Evidence Preview */}
                {previews.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
                    {previews.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Evidence ${index + 1}`}
                          className="w-full h-28 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeEvidence(index)}
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1.5 shadow-md hover:bg-red-700 transition-all duration-200 scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100"
                        >
                          <IconX size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200 p-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-8 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-100 transition-all duration-300 font-semibold"
              disabled={loading || isUploading}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading || isUploading}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold"
            >
              {(loading || isUploading) && <LoadingSpinner className="w-5 h-5" />}
              {isUploading ? 'Đang tải lên...' : loading ? 'Đang gửi...' : 'Gửi báo cáo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
