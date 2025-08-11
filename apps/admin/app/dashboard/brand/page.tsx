"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Package,
  RefreshCw,
  Filter,
  XCircle,
  AlertCircle,
  Plus,
  Search,
  Eye,
  ImageIcon,
  Tag,
  Building2,
} from "lucide-react"
import useBrandManager from "@/hooks/use-brand-manager"
import { MultiSelect } from "@/components/ui/multi-select"

const AdvancedFilters = ({
  searchQuery,
  onSearch,
}: {
  searchQuery: string
  onSearch: (query: string) => void
}) => {
  const [filterType, setFilterType] = useState("")
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)

  const handleClearFilters = () => {
    setFilterType("")
    setLocalSearchQuery("")
    onSearch("")
  }

  const handleSearch = () => {
    onSearch(localSearchQuery)
  }

  return (
    <Card>
      {/* <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Advanced Filters</CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={handleClearFilters}>
            <XCircle className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search Brands</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  placeholder="Search by name or ID..."
                  className="pl-10"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} size="sm">
                Search
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filter-type">Filter Type</Label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger id="filter-type">
                <SelectValue placeholder="Select filter type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Brand Name</SelectItem>
                <SelectItem value="id">Brand ID</SelectItem>
                <SelectItem value="category">Category</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Quick Actions</Label>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onSearch("")}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </CardContent> */}
    </Card>
  )
}

const BrandDetailModal = ({
  brand,
  isOpen,
  onClose,
}: {
  brand: any | null
  isOpen: boolean
  onClose: () => void
}) => {
  if (!brand) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Brand Details
          </DialogTitle>
          <DialogDescription>Complete information about this brand</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-center">
            {brand.imgUrl ? (
              <div className="relative">
                <img
                  src={brand.imgUrl || "/placeholder.svg?height=96&width=96"}
                  alt={`${brand.name} logo`}
                  className="h-24 w-24 rounded-full object-cover border-4 border-primary/20 shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-1">
                  <ImageIcon className="h-4 w-4" />
                </div>
              </div>
            ) : (
              <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center border-4 border-primary/20">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Brand ID</Label>
                <p className="text-lg font-mono bg-muted px-3 py-2 rounded-md">{brand.id}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Tên nhãn hàng</Label>
                <p className="text-xl font-semibold">{brand.name}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Logo URL</Label>
                <p className="text-sm break-all bg-muted px-3 py-2 rounded-md">
                  {brand.imgUrl || "No logo URL provided"}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Categories</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary">
                    <Tag className="h-3 w-3 mr-1" />
                    Sample Category
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const FormField = ({
  label,
  required = false,
  error,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) => (
  <div className="space-y-2">
    <Label className="text-sm font-medium">
      {label}
      {required && <span className="text-destructive ml-1">*</span>}
    </Label>
    {children}
    {error && (
      <p className="text-sm text-destructive flex items-center gap-1">
        <AlertCircle className="h-3 w-3" />
        {error}
      </p>
    )}
  </div>
)

export default function BrandManagementPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedBrand, setSelectedBrand] = useState<any | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [newBrandName, setNewBrandName] = useState("")
  const [newBrandImgUrl, setNewBrandImgUrl] = useState("")
  const [newBrandDescription, setNewBrandDescription] = useState("")
  const [newSelectedCategoryIds, setNewSelectedCategoryIds] = useState<string[]>([])

  const [errors, setErrors] = useState<Record<string, string>>({})

  const {
    brands,
    page,
    maxPage,
    totalBrands,
    loading,
    error,
    refetch,
    goToPage,
    fetchBrands,
    fetchCategories,
    categories,
    categoriesLoading,
    categoriesError,
    addBrand,
  } = useBrandManager()

  useEffect(() => {
    if (isAddModalOpen) {
      fetchCategories()
    }
  }, [isAddModalOpen, fetchCategories])

  const resetNewBrandForm = () => {
    setNewBrandName("")
    setNewBrandImgUrl("")
    setNewBrandDescription("")
    setNewSelectedCategoryIds([])
    setErrors({})
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!newBrandName.trim()) {
      newErrors.name = "Brand name is required"
    } else if (newBrandName.trim().length < 2) {
      newErrors.name = "Brand name must be at least 2 characters"
    }

    if (!newBrandImgUrl.trim()) {
      newErrors.imgUrl = "Logo URL is required"
    } else if (!isValidUrl(newBrandImgUrl)) {
      newErrors.imgUrl = "Please enter a valid URL"
    }

    if (!newBrandDescription.trim()) {
      newErrors.description = "Brand description is required"
    } else if (newBrandDescription.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters"
    }

    if (newSelectedCategoryIds.length === 0) {
      newErrors.categories = "Please select at least one category"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    fetchBrands(query, 1)
    setCurrentPage(1)
  }

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > maxPage) return
    setCurrentPage(newPage)
    goToPage(newPage, searchQuery)
  }

  const handleView = (brand: any) => {
    setSelectedBrand(brand)
    setIsDetailModalOpen(true)
  }

  const handleAddBrand = async () => {
    if (!validateForm()) {
      toast.error("Please fix the form errors before submitting")
      return
    }

    setIsSubmitting(true)
    try {
      const result = await addBrand({
        name: newBrandName.trim(),
        imgUrl: newBrandImgUrl.trim(),
        description: newBrandDescription.trim(),
        categoryIds: newSelectedCategoryIds,
      })

      if (result.success) {
        toast.success("Brand added successfully!")
        setIsAddModalOpen(false)
        resetNewBrandForm()
      } else {
        toast.error(result.message)
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred while adding the brand")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Brand Management</h1>
          <p className="text-muted-foreground mt-2">Manage your brand portfolio with ease</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} size="lg" className="shadow-lg">
          <Plus className="h-5 w-5 mr-2" />
          Add New Brand
        </Button>
      </div>

      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <div className="flex-1">
                <p className="font-medium">Error occurred</p>
                <p className="text-sm">{error}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {categoriesError && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <div className="flex-1">
                <p className="font-medium">Category Error</p>
                <p className="text-sm">{categoriesError}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <AdvancedFilters searchQuery={searchQuery} onSearch={handleSearch} />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Brand List
          </CardTitle>
          <CardDescription>
            {totalBrands > 0 ? `Showing ${brands.length} of ${totalBrands} brands` : "No brands found"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p className="text-muted-foreground">Loading brands...</p>
              </div>
            </div>
          ) : brands.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <div className="bg-muted rounded-full p-6">
                <Package className="h-12 w-12 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">No brands found</h3>
                <p className="text-muted-foreground">Try adjusting your search or add a new brand to get started</p>
              </div>
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Brand
              </Button>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Logo</TableHead>
                    <TableHead>Brand Name</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Categories</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {brands.map((brand) => (
                    <TableRow key={brand.id} className="hover:bg-muted/50">
                      <TableCell>
                        {brand.imgUrl ? (
                          <img
                            src={brand.imgUrl || "/placeholder.svg?height=40&width=40"}
                            alt={`${brand.name} logo`}
                            className="h-10 w-10 rounded-lg object-cover border shadow-sm"
                          />
                        ) : (
                          <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center border">
                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{brand.name}</p>
                          <p className="text-sm text-muted-foreground">Brand</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="bg-muted px-2 py-1 rounded text-sm">{brand.id}</code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          <Tag className="h-3 w-3 mr-1" />
                          Sample
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleView(brand)} className="shadow-sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {maxPage > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Page {page} of {maxPage} • {totalBrands} total brands
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, maxPage) }, (_, i) => {
                        const pageNum = i + 1
                        return (
                          <Button
                            key={pageNum}
                            variant={page === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            className="w-8 h-8 p-0"
                          >
                            {pageNum}
                          </Button>
                        )
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === maxPage}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <BrandDetailModal
        brand={selectedBrand}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedBrand(null)
        }}
      />

      <Dialog
        open={isAddModalOpen}
        onOpenChange={(open) => {
          setIsAddModalOpen(open)
          if (!open) resetNewBrandForm()
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Add New Brand
            </DialogTitle>
            <DialogDescription>Fill in the information below to create a new brand</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Brand Name" required error={errors.name}>
                <Input
                  value={newBrandName}
                  onChange={(e) => {
                    setNewBrandName(e.target.value)
                    if (errors.name) setErrors((prev) => ({ ...prev, name: "" }))
                  }}
                  placeholder="Enter brand name"
                  disabled={isSubmitting}
                />
              </FormField>

              <FormField label="Logo URL" required error={errors.imgUrl}>
                <Input
                  value={newBrandImgUrl}
                  onChange={(e) => {
                    setNewBrandImgUrl(e.target.value)
                    if (errors.imgUrl) setErrors((prev) => ({ ...prev, imgUrl: "" }))
                  }}
                  placeholder="https://example.com/logo.png"
                  disabled={isSubmitting}
                />
              </FormField>
            </div>

            <FormField label="Brand Description" required error={errors.description}>
              <Textarea
                value={newBrandDescription}
                onChange={(e) => {
                  setNewBrandDescription(e.target.value)
                  if (errors.description) setErrors((prev) => ({ ...prev, description: "" }))
                }}
                placeholder="Describe the brand, its values, and what makes it unique..."
                rows={4}
                disabled={isSubmitting}
              />
            </FormField>

            <FormField label="Categories" required error={errors.categories}>
              {categoriesLoading ? (
                <div className="flex items-center justify-center py-8 border rounded-md">
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  <span className="text-sm text-muted-foreground">Loading categories...</span>
                </div>
              ) : categoriesError ? (
                <div className="text-destructive text-sm bg-destructive/5 p-3 rounded-md">
                  Error loading categories: {categoriesError}
                </div>
              ) : (
                <MultiSelect
                  options={categories.map((cat) => ({
                    value: cat.id,
                    label: cat.name,
                  }))}
                  selected={newSelectedCategoryIds}
                  onChange={(selected) => {
                    setNewSelectedCategoryIds(selected)
                    if (errors.categories) setErrors((prev) => ({ ...prev, categories: "" }))
                  }}
                  placeholder="Select categories for this brand..."
                />
              )}
            </FormField>

            {newBrandImgUrl && isValidUrl(newBrandImgUrl) && (
              <div className="space-y-2">
                <Label>Logo Preview</Label>
                <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/20">
                  <img
                    src={newBrandImgUrl || "/placeholder.svg?height=48&width=48"}
                    alt="Logo preview"
                    className="h-12 w-12 rounded-lg object-cover border"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                    }}
                  />
                  <div>
                    <p className="font-medium">{newBrandName || "Brand Name"}</p>
                    <p className="text-sm text-muted-foreground">Logo preview</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Separator />

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleAddBrand} disabled={isSubmitting} className="min-w-24">
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Brand
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
