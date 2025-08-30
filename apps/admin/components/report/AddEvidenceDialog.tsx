'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Package, PlusCircle, Upload, XCircle } from 'lucide-react';
import { useRef, useState } from 'react';

interface AddEvidenceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    evidenceFiles: File[];
    evidenceUrls: string[];
    note: string;
  }) => Promise<void>;
  isSubmitting: boolean;
  uploadProgress: number;
  uploadStatus: 'idle' | 'uploading' | 'processing' | 'success' | 'error';
}

export default function AddEvidenceDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  uploadProgress,
  uploadStatus,
}: AddEvidenceDialogProps) {
  const [evidenceNote, setEvidenceNote] = useState('');
  const [evidenceUrls, setEvidenceUrls] = useState<string[]>(['']);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setSelectedFiles(newFiles);
      event.target.value = '';
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === dropZoneRef.current) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleAddUrlField = () => {
    setEvidenceUrls([...evidenceUrls, '']);
  };

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...evidenceUrls];
    newUrls[index] = value;
    setEvidenceUrls(newUrls);
  };

  const handleRemoveUrl = (index: number) => {
    const newUrls = evidenceUrls.filter((_, i) => i !== index);
    if (newUrls.length === 0) {
      newUrls.push('');
    }
    setEvidenceUrls(newUrls);
  };

  const handleSubmit = async () => {
    const filteredUrls = evidenceUrls.filter((url) => url.trim() !== '');
    await onSubmit({
      evidenceFiles: selectedFiles,
      evidenceUrls: filteredUrls,
      note: evidenceNote,
    });
  };

  const resetForm = () => {
    setEvidenceNote('');
    setEvidenceUrls(['']);
    setSelectedFiles([]);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onOpenChange(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open && !isSubmitting) {
          handleClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[700px] md:max-w-[800px] p-6">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-2xl font-bold text-orange-600">
            Thêm bằng chứng mới
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            Tải lên hình ảnh hoặc thêm ghi chú làm bằng chứng cho báo cáo này.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-6">
          {/* Note Section */}
          <div className="grid gap-3">
            <Label htmlFor="note" className="text-base font-medium">
              Ghi chú
            </Label>
            <Textarea
              id="note"
              value={evidenceNote}
              onChange={(e) => setEvidenceNote(e.target.value)}
              placeholder="Thêm ghi chú về bằng chứng này..."
              className="resize-none min-h-[120px] text-base p-3"
              rows={4}
              disabled={isSubmitting}
            />
          </div>

          {/* URL Section */}
          <div className="grid gap-3">
            <Label className="text-base font-medium">Liên kết bằng chứng</Label>
            <div className="space-y-2">
              {evidenceUrls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={url}
                    onChange={(e) => handleUrlChange(index, e.target.value)}
                    placeholder="https://example.com/evidence.jpg"
                    disabled={isSubmitting}
                    className="flex-1"
                  />
                  {evidenceUrls.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveUrl(index)}
                      disabled={isSubmitting}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddUrlField}
                disabled={isSubmitting}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Thêm liên kết
              </Button>
            </div>
          </div>

          {/* File Upload Section */}
          <div className="grid gap-3">
            <Label className="text-base font-medium">Tải lên hình ảnh/tài liệu</Label>
            <Input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
              id="evidence-files"
              disabled={isSubmitting}
            />
            <div
              ref={dropZoneRef}
              className={`border-2 border-dashed ${
                isSubmitting ? 'opacity-50 pointer-events-none' : ''
              } ${
                isDragging ? 'border-orange-500 bg-orange-50' : 'border-gray-300'
              } rounded-lg p-8 text-center hover:border-orange-400 cursor-pointer transition-all duration-200`}
              onClick={() => !isSubmitting && fileInputRef.current?.click()}
              onDragEnter={!isSubmitting ? handleDragEnter : undefined}
              onDragOver={!isSubmitting ? handleDragOver : undefined}
              onDragLeave={!isSubmitting ? handleDragLeave : undefined}
              onDrop={!isSubmitting ? handleDrop : undefined}
            >
              <Upload
                className={`h-8 w-8 mx-auto mb-4 ${
                  isDragging ? 'text-orange-600 scale-110' : 'text-orange-500'
                } transition-transform duration-200`}
              />
              <p className="font-medium text-lg mb-1">Kéo thả file vào đây hoặc nhấp để tải lên</p>
              <p className="text-sm text-muted-foreground">
                Hỗ trợ ảnh, PDF, Word (tối đa 10MB/file)
              </p>
            </div>

            {/* Selected Files */}
            {selectedFiles.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-sm">File đã chọn ({selectedFiles.length})</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    disabled={isSubmitting}
                    className="text-sm text-orange-600 hover:text-orange-700 hover:bg-orange-50 disabled:opacity-50"
                    onClick={() => !isSubmitting && setSelectedFiles([])}
                  >
                    Xóa tất cả
                  </Button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-md hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        {file.type.startsWith('image/') ? (
                          <div className="w-10 h-10 bg-orange-100 rounded flex items-center justify-center overflow-hidden">
                            <img
                              src={URL.createObjectURL(file)}
                              alt="Preview"
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-orange-100 rounded flex items-center justify-center">
                            <Package className="h-5 w-5 text-orange-600" />
                          </div>
                        )}
                        <div className="overflow-hidden">
                          <p className="font-medium truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        disabled={isSubmitting}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 disabled:opacity-50"
                        onClick={() =>
                          !isSubmitting &&
                          setSelectedFiles(selectedFiles.filter((_, i) => i !== index))
                        }
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-6 pt-4 border-t gap-3">
          {uploadStatus !== 'uploading' &&
            uploadStatus !== 'processing' &&
            uploadStatus !== 'success' && (
              <Button
                variant="outline"
                size="lg"
                className="min-w-[120px]"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
            )}

          {uploadStatus === 'idle' || uploadStatus === 'error' ? (
            <Button
              size="lg"
              className="min-w-[180px] bg-orange-500 hover:bg-orange-600 text-white"
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                (evidenceNote.trim() === '' &&
                  selectedFiles.length === 0 &&
                  evidenceUrls.every((url) => url.trim() === ''))
              }
            >
              <div className="flex items-center justify-center gap-2">
                <PlusCircle className="h-5 w-5" />
                <span>Thêm bằng chứng</span>
              </div>
            </Button>
          ) : (
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">
                  {uploadStatus === 'uploading' && 'Đang tải lên...'}
                  {uploadStatus === 'processing' && 'Đang xử lý...'}
                  {uploadStatus === 'success' && 'Hoàn thành!'}
                </span>
                <span className="text-sm font-medium">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    uploadStatus === 'success' ? 'bg-green-500' : 'bg-orange-500'
                  }`}
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
