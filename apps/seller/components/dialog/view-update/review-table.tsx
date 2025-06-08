"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, MessageSquare, Star, CheckCircle, AlertTriangle } from "lucide-react"
import Image from "next/image"
import type { Review } from "@/app/dashboard/review-management/page" 

interface ReviewTableProps {
  reviews: Review[]
  onViewDetail: (review: Review) => void
  onReply: (review: Review) => void
}

export function ReviewTable({ reviews, onViewDetail, onReply }: ReviewTableProps) {
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    )
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "bg-green-100 text-green-800"
    if (rating >= 3) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Sản phẩm</TableHead>
              <TableHead>Đánh giá</TableHead>
              <TableHead>Nội dung</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={review.customerAvatar || "/placeholder.svg"} />
                      <AvatarFallback>{review.customerName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{review.customerName}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        {review.isVerifiedPurchase && (
                          <>
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            <span>Đã mua hàng</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Image
                      src={review.productImage || "/placeholder.svg"}
                      alt={review.productName}
                      width={40}
                      height={40}
                      className="rounded-md object-cover"
                    />
                    <div>
                      <div className="font-medium text-sm">{truncateText(review.productName, 30)}</div>
                      <div className="text-xs text-muted-foreground">#{review.orderId}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {renderStars(review.rating)}
                    <Badge className={getRatingColor(review.rating)}>{review.rating} sao</Badge>
                  </div>
                </TableCell>
                <TableCell className="max-w-xs">
                  <div>
                    <div className="font-medium text-sm">{truncateText(review.title, 40)}</div>
                    <div className="text-sm text-muted-foreground">{truncateText(review.content, 60)}</div>
                    {review.images && review.images.length > 0 && (
                      <div className="text-xs text-blue-600 mt-1">+{review.images.length} hình ảnh</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{new Date(review.createdAt).toLocaleDateString("vi-VN")}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {review.shopReply ? (
                      <Badge className="bg-green-100 text-green-800">Đã phản hồi</Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-800">Chưa phản hồi</Badge>
                    )}
                    {review.reported && (
                      <div className="flex items-center gap-1 text-xs text-red-600">
                        <AlertTriangle className="h-3 w-3" />
                        Bị báo cáo
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => onViewDetail(review)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {!review.shopReply && (
                      <Button variant="outline" size="sm" onClick={() => onReply(review)}>
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
