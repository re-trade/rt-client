"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useReportSeller } from "@/hooks/use-report-seller-manager"
import { AlertCircle, CheckCircle, Eye, Filter, Package, RefreshCw, Search, XCircle, Plus, X } from "lucide-react"
import { useState } from "react"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import type { TEvidence } from "@/services/report.seller.api"

const ReportStats = ({ reports }: { reports: any[] }) => {
  const totalReports = reports.length
  const verifiedReports = reports.filter((p) => p.resolutionStatus === "ACCEPTED").length
  const rejectedReports = reports.filter((p) => p.resolutionStatus === "REJECTED").length
  const pendingReports = reports.filter((p) => p.resolutionStatus === "PENDING").length

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Tổng số tố cáo</p>
            <p className="text-2xl font-bold">{totalReports}</p>
          </div>
          <Package className="h-8 w-8 text-blue-500" />
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Đã duyệt</p>
            <p className="text-2xl font-bold text-green-600">{verifiedReports}</p>
          </div>
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Đã từ chối</p>
            <p className="text-2xl font-bold text-red-600">{rejectedReports}</p>
          </div>
          <XCircle className="h-8 w-8 text-red-500" />
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Đang chờ</p>
            <p className="text-2xl font-bold text-orange-600">{pendingReports}</p>
          </div>
          <AlertCircle className="h-8 w-8 text-orange-500" />
        </div>
      </Card>
    </div>
  )
}

const AdvancedFilters = ({ searchQuery, onSearch, selectedCategory, setSelectedCategory }: any) => {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-4 w-4" />
        <h3 className="font-medium">Bộ lọc nâng cao</h3>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm tố cáo..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="accepted">Đã xác minh</SelectItem>
            <SelectItem value="pending">Chờ duyệt</SelectItem>
            <SelectItem value="rejected">Từ chối</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Card>
  )
}

const ReportDetailModal = ({
  report,
  isOpen,
  onClose,
  onVerify,
  onReject,
}: {
  report: any
  isOpen: boolean
  onClose: () => void
  onVerify?: (id: string) => void
  onReject?: (id: string) => void
}) => {
  if (!report) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Thông tin tố cáo
          </DialogTitle>
          <DialogDescription>Thông tin chi tiết về tố cáo</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6">
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">ID</p>
                <p className="break-all">{report.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">ID khách hàng</p>
                <p>{report.customerId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">ID sản phẩm</p>
                <p>{report.productId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">ID đơn hàng</p>
                <p>{report.orderId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">ID người bán</p>
                <p>{report.sellerId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Loại tố cáo</p>
                <p>{report.typeReport}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-muted-foreground">Nội dung</p>
                <p className="whitespace-pre-wrap">{report.content}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ngày tạo</p>
                <p>{new Date(report.createdAt).toLocaleDateString("vi-VN")}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Trạng thái</p>
                <p
                  className={
                    report.resolutionStatus === "ACCEPTED"
                      ? "text-green-600"
                      : report.resolutionStatus === "REJECTED"
                        ? "text-red-600"
                        : "text-orange-600"
                  }
                >
                  {report.resolutionStatus === "ACCEPTED"
                    ? "Đã xác minh"
                    : report.resolutionStatus === "REJECTED"
                      ? "Đã từ chối"
                      : "Chờ duyệt"}
                </p>
              </div>
            </div>
          </div>
        </div>
        {report.resolutionStatus === "PENDING" && (
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              className="text-green-600 border-green-600 hover:bg-green-50 bg-transparent"
              onClick={() => onVerify && onVerify(report.id)}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Đồng ý tố cáo
            </Button>
            <Button
              variant="outline"
              className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
              onClick={() => onReject && onReject(report.id)}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Từ chối tố cáo
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

const ReportActions = ({ report, onVerify, onReject, onView }: any) => {
  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="icon" onClick={() => onView(report)} title="Xem chi tiết">
        <Eye className="h-4 w-4" />
      </Button>
      {report.resolutionStatus === "PENDING" && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onVerify(report.id)}
            className="text-green-600 hover:text-green-700 hover:bg-green-50"
            title="Chấp nhận"
          >
            <CheckCircle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onReject(report.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            title="Từ chối"
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  )
}

const EvidenceDetailModal = ({
  evidence,
  isOpen,
  onClose,
  reportId,
  onEvidenceUpdate,
}: {
  evidence: TEvidence[] | null
  isOpen: boolean
  onClose: () => void
  reportId: string
  onEvidenceUpdate: (newEvidence: TEvidence[]) => void
}) => {
  const [fullSizeImage, setFullSizeImage] = useState<string | null>(null)
  const [isAddEvidenceOpen, setIsAddEvidenceOpen] = useState(false)
  const [newEvidence, setNewEvidence] = useState<{ evidenceUrls: string[]; note: string }>({
    evidenceUrls: [""],
    note: "",
  })
  const [postError, setPostError] = useState<string | null>(null)
  const [postSuccess, setPostSuccess] = useState<string | null>(null)

  const { fetchEvidence, postEvidence, evidenceLoading } = useReportSeller()

  const handleImageClick = (url: string) => {
    setFullSizeImage(url)
  }

  const handleCloseFullSize = () => {
    setFullSizeImage(null)
  }

  const handleAddUrl = () => {
    setNewEvidence((prev) => ({
      ...prev,
      evidenceUrls: [...prev.evidenceUrls, ""],
    }))
  }

  const handleRemoveUrl = (index: number) => {
    setNewEvidence((prev) => ({
      ...prev,
      evidenceUrls: prev.evidenceUrls.filter((_, i) => i !== index),
    }))
  }

  const handleUrlChange = (index: number, value: string) => {
    setNewEvidence((prev) => ({
      ...prev,
      evidenceUrls: prev.evidenceUrls.map((url, i) => (i === index ? value : url)),
    }))
  }

  const handleNoteChange = (value: string) => {
    setNewEvidence((prev) => ({
      ...prev,
      note: value,
    }))
  }

  const handlePostEvidence = async () => {
    try {
      setPostError(null)
      setPostSuccess(null)

      const result = await postEvidence(reportId, {
        evidenceUrls: newEvidence.evidenceUrls.filter((url) => url.trim()),
        note: newEvidence.note,
      })

      if (result.success) {
        setPostSuccess("Thêm bằng chứng thành công!")
        setNewEvidence({ evidenceUrls: [""], note: "" })
        setIsAddEvidenceOpen(false)

        // Fetch updated evidence list
        const updatedEvidence = await fetchEvidence(reportId)
        onEvidenceUpdate(updatedEvidence)

        // Clear success message after 3 seconds
        setTimeout(() => setPostSuccess(null), 3000)
      } else {
        setPostError(result.message || "Không thể thêm bằng chứng")
      }
    } catch (error: any) {
      setPostError(error.message || "Có lỗi xảy ra khi thêm bằng chứng")
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Chi tiết bằng chứng
            </DialogTitle>
            <DialogDescription>Thông tin chi tiết về bằng chứng cho báo cáo ID: {reportId}</DialogDescription>
          </DialogHeader>

          <Button onClick={() => setIsAddEvidenceOpen(true)} className="mb-4" disabled={!reportId}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm bằng chứng
          </Button>

          {postSuccess && (
            <div className="p-4 border-green-200 bg-green-50 flex items-center gap-2 text-green-700 rounded-md">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">Thành công:</span> {postSuccess}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPostSuccess(null)}
                className="text-green-600 hover:text-green-700 ml-auto"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {postError && (
            <div className="p-4 border-red-200 bg-red-50 flex items-center gap-2 text-red-700 rounded-md">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Lỗi:</span> {postError}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPostError(null)}
                className="text-red-600 hover:text-red-700 ml-auto"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {evidence && Array.isArray(evidence) && evidence.length > 0 ? (
            <div className="grid gap-6">
              {evidence.map((item, index) => (
                <div key={item.id || index} className="grid gap-4 border-b pb-4 last:border-b-0">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">ID</p>
                      <p className="break-all text-sm">{item.id || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Vai trò người gửi</p>
                      <p className="text-sm">{item.senderRole || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Tên người gửi</p>
                      <p className="text-sm">{item.senderName || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">ID người gửi</p>
                      <p className="break-all text-sm">{item.senderId || "N/A"}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-muted-foreground">Ghi chú</p>
                      <p className="whitespace-pre-wrap text-sm">{item.notes || "Không có ghi chú"}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-muted-foreground">Hình ảnh/Video</p>
                      {Array.isArray(item.evidenceUrls) && item.evidenceUrls.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                          {item.evidenceUrls.map((url, urlIndex) => {
                            const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)(\?.*)?$/i.test(url)
                            return isImage ? (
                              <div key={urlIndex} className="relative">
                                <img
                                  src={url || "/placeholder.svg"}
                                  alt={`Bằng chứng ${urlIndex + 1}`}
                                  className="max-w-full h-auto object-contain rounded-md cursor-pointer border hover:shadow-md transition-shadow"
                                  style={{ maxHeight: "200px" }}
                                  onClick={() => handleImageClick(url)}
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none"
                                    const nextSibling = e.currentTarget.nextElementSibling
                                    if (nextSibling instanceof HTMLElement) {
                                      nextSibling.style.display = "block"
                                    }
                                  }}
                                />
                                <p className="text-red-600 text-sm mt-1 hidden">Không thể tải hình ảnh</p>
                              </div>
                            ) : (
                              <a
                                key={urlIndex}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline truncate block p-2 border rounded hover:bg-blue-50 transition-colors"
                              >
                                {url}
                              </a>
                            )
                          })}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm">Không có bằng chứng</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Không có dữ liệu bằng chứng</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Full size image modal */}
      <Dialog open={!!fullSizeImage} onOpenChange={handleCloseFullSize}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
          <VisuallyHidden>
            <DialogTitle>Hình ảnh toàn màn hình</DialogTitle>
          </VisuallyHidden>
          <div className="relative">
            {fullSizeImage && (
              <img
                src={fullSizeImage || "/placeholder.svg"}
                alt="Hình ảnh toàn màn hình"
                className="w-full h-auto max-h-[90vh] object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none"
                  const nextSibling = e.currentTarget.nextElementSibling
                  if (nextSibling instanceof HTMLElement) {
                    nextSibling.style.display = "block"
                  }
                }}
              />
            )}
            <p className="text-red-600 text-sm mt-1 hidden text-center">Không thể tải hình ảnh</p>
            <button
              onClick={handleCloseFullSize}
              className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
              aria-label="Đóng hình ảnh toàn màn hình"
            >
              ✕
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add evidence modal */}
      <Dialog
        open={isAddEvidenceOpen}
        onOpenChange={(open) => {
          setIsAddEvidenceOpen(open)
          if (!open) {
            setNewEvidence({ evidenceUrls: [""], note: "" })
            setPostError(null)
            setPostSuccess(null)
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Thêm bằng chứng mới</DialogTitle>
            <DialogDescription>Nhập các URL bằng chứng và ghi chú cho báo cáo ID: {reportId}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">URLs bằng chứng:</label>
              {newEvidence.evidenceUrls.map((url, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder="Nhập URL bằng chứng (ví dụ: https://example.com/image.jpg)"
                    value={url}
                    onChange={(e) => handleUrlChange(index, e.target.value)}
                    className="flex-1"
                  />
                  {newEvidence.evidenceUrls.length > 1 && (
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveUrl(index)} aria-label="Xóa URL">
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" onClick={handleAddUrl} className="w-full bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Thêm URL
              </Button>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Ghi chú:</label>
              <Input
                placeholder="Nhập ghi chú về bằng chứng"
                value={newEvidence.note}
                onChange={(e) => handleNoteChange(e.target.value)}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handlePostEvidence} disabled={evidenceLoading || !reportId} className="flex-1">
                {evidenceLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    Đang gửi...
                  </>
                ) : (
                  "Gửi bằng chứng"
                )}
              </Button>
              <Button variant="outline" onClick={() => setIsAddEvidenceOpen(false)} disabled={evidenceLoading}>
                Hủy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default function ReportManagementPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null)
  const [selectedEvidence, setSelectedEvidence] = useState<TEvidence[] | null>(null)
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false)

  const {
    reports = [],
    page,
    maxPage,
    totalReports,
    loading,
    error,
    refetch,
    goToPage,
    searchReports,
    acceptReport,
    rejectReport,
    fetchEvidence,
  } = useReportSeller()

  const handleEvidenceUpdate = (newEvidence: TEvidence[]) => {
    setSelectedEvidence(newEvidence)
  }

  const handleRefresh = () => {
    refetch()
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    searchReports(query)
  }

  const handlePageChange = (newPage: number) => {
    goToPage(newPage, searchQuery)
  }

  const handleVerify = async (reportId: string) => {
    const result = await acceptReport(reportId)
    if (result) {
      setDeleteSuccess("Xác minh tố cáo thành công!")
      setTimeout(() => setDeleteSuccess(null), 5000)
    } else {
      setDeleteError("Lỗi xác minh tố cáo")
      setTimeout(() => setDeleteError(null), 5000)
    }
  }

  const handleReject = async (reportId: string) => {
    const result = await rejectReport(reportId)
    if (result) {
      setDeleteSuccess("Từ chối tố cáo thành công!")
      setTimeout(() => setDeleteSuccess(null), 5000)
    } else {
      setDeleteError("Lỗi từ chối tố cáo")
      setTimeout(() => setDeleteError(null), 5000)
    }
  }

  const handleView = (report: any) => {
    setSelectedReport(report)
    setIsDetailModalOpen(true)
  }

  const handleViewEvidence = async (reportId: string) => {
    try {
      const evidenceArray = await fetchEvidence(reportId)
      setSelectedEvidence(evidenceArray)
      setSelectedReport({ id: reportId })
      setIsEvidenceModalOpen(true)
    } catch (error) {
      console.error("Error fetching evidence:", error)
      setDeleteError("Lỗi khi tải bằng chứng")
      setTimeout(() => setDeleteError(null), 5000)
      setSelectedEvidence([])
    }
  }

  const filteredReports = reports.filter((report) => {
    const matchesCategory =
      selectedCategory === "all" || report.resolutionStatus.toLowerCase().includes(selectedCategory.toLowerCase())
    return matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý tố cáo người bán</h1>
            <p className="text-gray-600 mt-1">Xem và xử lý các tố cáo từ khách hàng</p>
          </div>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
        </div>

        {deleteSuccess && (
          <Card className="p-4 border-green-200 bg-green-50">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-4 w-4" />
              <div className="flex-1">
                <span className="font-medium">Thành công:</span> {deleteSuccess}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeleteSuccess(null)}
                className="text-green-600 hover:text-green-700"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}

        {(error || deleteError) && (
          <Card className="p-4 border-red-200 bg-red-50">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <div className="flex-1">
                <span className="font-medium">Lỗi:</span> {error || deleteError}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDeleteError(null)
                  setDeleteError(null)
                }}
                className="text-red-600 hover:text-red-700"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}

        <ReportStats reports={reports} />

        <AdvancedFilters
          searchQuery={searchQuery}
          onSearch={handleSearch}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Danh sách tố cáo</h2>
            <div className="text-sm text-muted-foreground">Tổng cộng: {totalReports} tố cáo</div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
              <span className="ml-2 text-gray-600">Đang tải...</span>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nội dung tố cáo</TableHead>
                    <TableHead>Loại tố cáo</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead>Hành động</TableHead>
                    <TableHead>Bằng chứng</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.length > 0 ? (
                    filteredReports.map((report) => (
                      <TableRow key={report.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium max-w-xs">
                          <div className="truncate" title={report.content}>
                            {report.content || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {report.typeReport || "N/A"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              report.resolutionStatus === "ACCEPTED"
                                ? "bg-green-100 text-green-800"
                                : report.resolutionStatus === "REJECTED"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-orange-100 text-orange-800"
                            }`}
                          >
                            {report.resolutionStatus === "ACCEPTED"
                              ? "Đã xác minh"
                              : report.resolutionStatus === "REJECTED"
                                ? "Đã từ chối"
                                : "Chờ duyệt"}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {new Date(report.createdAt).toLocaleDateString("vi-VN")}
                        </TableCell>
                        <TableCell>
                          <ReportActions
                            report={report}
                            onVerify={handleVerify}
                            onReject={handleReject}
                            onView={handleView}
                          />
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => handleViewEvidence(report.id)}>
                            <Package className="h-4 w-4 mr-1" />
                            Xem
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        Không có tố cáo nào
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {filteredReports.length > 0 && (
                <div className="mt-6 flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Hiển thị {(page - 1) * 10 + 1} - {Math.min(page * 10, totalReports)} trong số {totalReports} tố cáo
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 1}
                      onClick={() => handlePageChange(page - 1)}
                    >
                      Trước
                    </Button>
                    <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded">
                      {page} / {maxPage}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === maxPage}
                      onClick={() => handlePageChange(page + 1)}
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>

        <ReportDetailModal
          report={selectedReport}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          onVerify={handleVerify}
          onReject={handleReject}
        />

        <EvidenceDetailModal
          evidence={selectedEvidence}
          isOpen={isEvidenceModalOpen}
          onClose={() => setIsEvidenceModalOpen(false)}
          reportId={selectedReport?.id || ""}
          onEvidenceUpdate={handleEvidenceUpdate}
        />
      </div>
    </div>
  )
}
