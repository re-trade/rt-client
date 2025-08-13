"use client"

import {
  type TEvidence,
  type TReportSellerProfile,
  acceptReport,
  getEvidence,
  getReports,
  postEvidence,
  rejectReport,
  uploadImage,
} from "@/services/report.seller.api"
import { useCallback, useEffect, useState } from "react"

const useReportSeller = () => {
  const [reports, setReports] = useState<TReportSellerProfile[]>([])
  const [page, setPage] = useState<number>(1)
  const [maxPage, setMaxPage] = useState<number>(1)
  const [totalReports, setTotalReports] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [evidence, setEvidence] = useState<TEvidence[] | null>(null)
  const [evidenceLoading, setEvidenceLoading] = useState<boolean>(false)
  const [evidenceError, setEvidenceError] = useState<string | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  const [evidencePage, setEvidencePage] = useState<number>(1)
  const [evidenceMaxPage, setEvidenceMaxPage] = useState<number>(1)
  const [totalEvidence, setTotalEvidence] = useState<number>(0)

  const pageSize = 10
  const evidencePageSize = 5 // Smaller page size for evidence

  const fetchReports = useCallback(
    async (searchQuery?: string, customPage?: number) => {
      setLoading(true)
      setError(null)
      try {
        const response = await getReports((customPage ?? page) - 1, pageSize, searchQuery)
        if (response && response.success) {
          setReports(response.content || [])
          setMaxPage(response.pagination?.totalPages ?? 1)
          setTotalReports(response.pagination?.totalElements ?? response.content?.length ?? 0)
        } else {
          setReports([])
          setMaxPage(1)
          setTotalReports(0)
          setError(response?.messages?.[0] || "Failed to get reports")
        }
      } catch (err) {
        setReports([])
        setMaxPage(1)
        setTotalReports(0)
        setError(err instanceof Error ? err.message : "Failed to get reports")
      } finally {
        setLoading(false)
      }
    },
    [page],
  )

  const fetchEvidence = useCallback(
    async (id: string, customPage?: number) => {
      if (!id || id.trim() === "") {
        console.error("Invalid report ID provided to fetchEvidence")
        setEvidence([])
        setEvidenceError("Invalid report ID")
        return []
      }

      setEvidenceLoading(true)
      setEvidenceError(null)
      try {
        const response = await getEvidence(id, (customPage ?? evidencePage) - 1, evidencePageSize)
        if (response && response.success) {
          setEvidence(response.content || [])
          setEvidenceMaxPage(response.pagination?.totalPages ?? 1)
          setTotalEvidence(response.pagination?.totalElements ?? response.content?.length ?? 0)
          return response.content || []
        } else {
          setEvidence([])
          setEvidenceMaxPage(1)
          setTotalEvidence(0)
          setEvidenceError(response?.messages?.[0] || "Failed to fetch evidence")
          return []
        }
      } catch (err: any) {
        const errorMessage = "Không thể tải bằng chứng: " + (err.message || "Lỗi không xác định")
        setEvidence([])
        setEvidenceMaxPage(1)
        setTotalEvidence(0)
        setEvidenceError(errorMessage)
        return []
      } finally {
        setEvidenceLoading(false)
      }
    },
    [evidencePage],
  )

  const postEvidenceAction = useCallback(
    async (id: string, evidenceData: { evidenceFiles?: File[]; evidenceUrls?: string[]; note: string }) => {
      if (!id || id.trim() === "") {
        return { success: false, message: "Invalid report ID" }
      }

      setEvidenceLoading(true)
      setEvidenceError(null)
      try {
        let evidenceUrls: string[] = evidenceData.evidenceUrls?.filter((url) => url && url.trim() !== "") || []

        if (evidenceData.evidenceFiles?.length) {
          setIsUploadingImage(true)
          const uploadPromises = evidenceData.evidenceFiles.map(async (file) => {
            const url = await uploadImage(file)
            if (!url) {
              throw new Error(`Failed to upload file: ${file.name}`)
            }
            return url
          })
          const uploadedUrls = (await Promise.all(uploadPromises)).filter((url): url is string => !!url)
          evidenceUrls = [...evidenceUrls, ...uploadedUrls]
          setIsUploadingImage(false)
        }

        if (!evidenceUrls.length && !evidenceData.note?.trim()) {
          setEvidenceError("Either evidence files/URLs or note is required")
          return { success: false, message: "Either evidence files/URLs or note is required" }
        }

        const response = await postEvidence(id, {
          evidenceUrls,
          note: evidenceData.note,
        })

        if (response.success) {
          await fetchEvidence(id)
          return { success: true, message: "Evidence posted successfully" }
        }
        setEvidenceError(response.messages?.[0] || "Failed to post evidence")
        return { success: false, message: response.messages?.[0] || "Failed to post evidence" }
      } catch (err: any) {
        const errorMessage = err.message || "Failed to post evidence"
        setEvidenceError(errorMessage)
        return { success: false, message: errorMessage }
      } finally {
        setEvidenceLoading(false)
        setIsUploadingImage(false)
      }
    },
    [fetchEvidence],
  )

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  const refetch = () => fetchReports()

  const goToPage = (newPage: number, searchQuery?: string) => {
    setPage(newPage)
    fetchReports(searchQuery, newPage)
  }

  const searchReports = (searchQuery: string) => {
    setPage(1)
    fetchReports(searchQuery, 1)
  }

  const handleAccept = useCallback(
    async (id: string) => {
      try {
        const result = await acceptReport(id)
        if (result?.success) {
          await fetchReports()
          return true
        }
        setError("Failed to accept report")
        return false
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to accept report")
        return false
      }
    },
    [fetchReports],
  )

  const handleReject = useCallback(
    async (id: string) => {
      try {
        const result = await rejectReport(id)
        if (result?.success) {
          await fetchReports()
          return true
        }
        setError("Failed to reject report")
        return false
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to reject report")
        return false
      }
    },
    [fetchReports],
  )

  // Added evidence pagination navigation function
  const goToEvidencePage = (newPage: number, reportId: string) => {
    setEvidencePage(newPage)
    fetchEvidence(reportId, newPage)
  }

  return {
    reports,
    page,
    maxPage,
    totalReports,
    loading,
    error,
    evidence,
    evidenceLoading,
    evidenceError,
    refetch,
    goToPage,
    searchReports,
    acceptReport: handleAccept,
    rejectReport: handleReject,
    fetchEvidence,
    postEvidence: postEvidenceAction,
    isUploadingImage,
    evidencePage,
    evidenceMaxPage,
    totalEvidence,
    goToEvidencePage,
  }
}

export { useReportSeller }
