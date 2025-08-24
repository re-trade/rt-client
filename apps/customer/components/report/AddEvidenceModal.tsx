'use client';

import LoadingSpinner from '@/components/common/Loading';
import { useToast } from '@/context/ToastContext';
import { customerReportApi } from '@services/report.api';
import { IconFilePlus, IconUpload, IconX } from '@tabler/icons-react';
import { useState } from 'react';

interface AddEvidenceModalProps {
  reportId: string;
  isOpen: boolean;
  onClose: () => void;
  onEvidenceAdded: () => void;
}

export default function AddEvidenceModal({
  reportId,
  isOpen,
  onClose,
  onEvidenceAdded,
}: AddEvidenceModalProps) {
  const [notes, setNotes] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);

      const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0 && !notes.trim()) {
      toast.showToast('Vui lòng cung cấp bằng chứng hoặc ghi chú.', 'error');
      return;
    }
    setLoading(true);
    try {
      await customerReportApi.addEvidence(reportId, notes, files);
      toast.showToast('Bổ sung bằng chứng thành công!', 'success');
      onEvidenceAdded();
      onClose();
    } catch (error) {
      toast.showToast('Không thể bổ sung bằng chứng. Vui lòng thử lại.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl transform transition-all duration-300 scale-95 group-[.is-open]:scale-100">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Bổ sung bằng chứng</h2>
            <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
              <IconX size={24} className="text-gray-600" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ghi chú (tùy chọn)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Thêm mô tả hoặc ghi chú cho bằng chứng..."
                rows={4}
                className="w-full px-4 py-3 border rounded-xl bg-gray-50 text-gray-900 resize-none focus:ring-2 focus:ring-orange-400 border-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tải lên bằng chứng
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-400 transition-all duration-200 bg-white">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="evidence-upload-modal"
                />
                <label
                  htmlFor="evidence-upload-modal"
                  className="cursor-pointer flex flex-col items-center gap-3 text-gray-600"
                >
                  <IconUpload size={36} className="text-gray-400" />
                  <p className="font-semibold">Nhấp để tải lên hình ảnh</p>
                  <p className="text-sm">PNG, JPG tối đa 5MB mỗi file</p>
                </label>
              </div>
            </div>

            {previews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {previews.map((src, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={src}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-28 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1.5 shadow-md hover:bg-red-700"
                    >
                      <IconX size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 bg-gray-50 rounded-b-2xl flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-semibold"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 flex items-center gap-2 font-semibold"
            >
              {loading && <LoadingSpinner className="w-5 h-5" />}
              {loading ? 'Đang gửi...' : 'Gửi bằng chứng'}
              {!loading && <IconFilePlus size={18} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
