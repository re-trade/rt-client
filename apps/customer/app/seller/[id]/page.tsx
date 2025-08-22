'use client';
import SellerProductsSection from '@/components/seller/SellerProductsSection';
import { useAuth } from '@/context/AuthContext';
import { useSellerProfile } from '@/hooks/use-seller-profile';
import { getAchievementBgColor, getAchievementIcon } from '@/utils/achievement-icons';
import {
  IconCalendar,
  IconClock,
  IconMail,
  IconMapPin,
  IconMedal,
  IconPackage,
  IconPhone,
  IconShieldCheck,
  IconShieldX,
  IconShoppingBag,
  IconStar,
  IconTrophy,
  IconUser,
} from '@tabler/icons-react';
import { Award } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function SellerDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const {
    sellerProfile,
    sellerMetrics,
    achievements,
    loading,
    loadingMetrics,
    loadingAchievements,
    error,
  } = useSellerProfile(id);
  const { sellerProfile: currentUserSellerProfile } = useAuth();

  const router = useRouter();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const formatRating = (rating: number) => {
    return Number(rating).toFixed(1) + '/5';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-64 bg-orange-200 rounded-2xl mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-8 bg-orange-200 rounded w-1/2"></div>
                <div className="h-24 bg-orange-200 rounded"></div>
              </div>
              <div className="space-y-4">
                <div className="h-6 bg-orange-200 rounded w-1/3"></div>
                <div className="h-4 bg-orange-200 rounded"></div>
                <div className="h-4 bg-orange-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!sellerProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Người bán không tồn tại</h1>
          <p className="text-gray-600">Không tìm thấy thông tin người bán này.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <div className="relative h-64 md:h-80">
        <Image
          src={sellerProfile.background}
          alt="Seller background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/30"></div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-7xl mx-auto flex items-end gap-6">
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-4 border-white shadow-2xl overflow-hidden bg-white">
                <Image
                  src={sellerProfile.avatarUrl}
                  alt={sellerProfile.shopName}
                  fill
                  className="object-cover"
                />
              </div>
              {sellerProfile.verified && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                  <IconShieldCheck size={16} className="text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {sellerProfile.shopName}
                </h1>
                {currentUserSellerProfile?.id === id && (
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <IconUser size={14} />
                    Đây là bạn
                  </span>
                )}
                {sellerProfile.verified ? (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <IconShieldCheck size={14} />
                    Đã xác minh
                  </span>
                ) : (
                  <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <IconShieldX size={14} />
                    Chưa xác minh
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-white/90">
                <span className="flex items-center gap-1 text-sm">
                  <IconCalendar size={16} />
                  Tham gia từ {formatDate(sellerProfile.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-orange-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-orange-600 rounded"></div>
                Giới thiệu
              </h2>
              <p className="text-gray-600 leading-relaxed">{sellerProfile.description}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {loadingMetrics ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100 text-center animate-pulse"
                  >
                    <div className="w-8 h-8 bg-gray-200 rounded mx-auto mb-3"></div>
                    <div className="h-8 bg-gray-200 rounded mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                ))
              ) : error && !sellerMetrics ? (
                <div className="col-span-2 md:col-span-4 bg-white rounded-2xl p-6 shadow-lg border border-orange-100 text-center">
                  <div className="text-gray-500 mb-2">
                    <IconShieldX className="w-8 h-8 mx-auto mb-2" />
                    Không thể tải thống kê
                  </div>
                  <p className="text-sm text-gray-400">Vui lòng thử lại sau</p>
                </div>
              ) : (
                [
                  {
                    label: 'Sản phẩm',
                    value: sellerMetrics ? formatNumber(sellerMetrics.productQuantity) : '0',
                    icon: IconPackage,
                  },
                  {
                    label: 'Đánh giá',
                    value: sellerMetrics ? formatRating(sellerMetrics.avgVote) : '0.0/5',
                    icon: IconStar,
                  },
                  {
                    label: 'Tổng đơn hàng',
                    value: sellerMetrics ? formatNumber(sellerMetrics.totalOrder) : '0',
                    icon: IconShoppingBag,
                  },
                  {
                    label: 'Đơn hàng thành công',
                    value: sellerMetrics ? formatNumber(sellerMetrics.totalOrderSold) : '0',
                    icon: IconShieldCheck,
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100 text-center"
                  >
                    <stat.icon className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))
              )}
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-orange-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-orange-600 rounded"></div>
                Thành tích đạt được
              </h2>
              {loadingAchievements ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
              ) : achievements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => {
                    const Icon = getAchievementIcon(achievement.code);
                    const bgColor = getAchievementBgColor(achievement.code);

                    return (
                      <div
                        key={achievement.id}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          achievement.achieved
                            ? 'border-green-200 bg-green-50'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-10 h-10 ${bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}
                          >
                            {achievement.achieved ? (
                              <IconTrophy size={20} className="text-orange-600" />
                            ) : (
                              <Icon size={20} className="text-orange-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3
                              className={`font-semibold mb-1 ${achievement.achieved ? 'text-green-800' : 'text-gray-700'}`}
                            >
                              {achievement.name}
                            </h3>
                            <p
                              className={`text-sm mb-2 ${achievement.achieved ? 'text-green-600' : 'text-gray-600'}`}
                            >
                              {achievement.description}
                            </p>
                            {achievement.achieved && achievement.achievedAt && (
                              <div className="flex items-center gap-1 text-green-600 text-sm">
                                <IconMedal size={14} />
                                <span>Đạt được: {formatDate(achievement.achievedAt)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Award className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có thành tích</h3>
                  <p className="text-gray-500">Người bán này chưa đạt được thành tích nào.</p>
                </div>
              )}
            </div>

            {/* Recent Updates */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-orange-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-orange-600 rounded"></div>
                Cập nhật gần đây
              </h2>
              <div className="flex items-center gap-3 text-gray-600">
                <IconClock size={18} className="text-orange-500 flex-shrink-0" />
                <span className="text-sm">
                  Cập nhật lần cuối: {formatDate(sellerProfile.updatedAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-orange-100">
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-orange-500 to-orange-600 rounded"></div>
                Thông tin liên hệ
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <IconMapPin size={18} className="text-orange-500 flex-shrink-0 mt-1" />
                  <div className="text-sm">
                    <div className="text-gray-800 font-medium mb-1">Địa chỉ</div>
                    <div className="text-gray-600">
                      {sellerProfile.addressLine}, {sellerProfile.ward}, {sellerProfile.district},{' '}
                      {sellerProfile.state}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <IconPhone size={18} className="text-orange-500 flex-shrink-0" />
                  <div className="text-sm">
                    <div className="text-gray-800 font-medium mb-1">Điện thoại</div>
                    <a
                      href={`tel:${sellerProfile.phoneNumber}`}
                      className="text-orange-600 hover:text-orange-700 transition-colors"
                    >
                      {sellerProfile.phoneNumber}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <IconMail size={18} className="text-orange-500 flex-shrink-0" />
                  <div className="text-sm">
                    <div className="text-gray-800 font-medium mb-1">Email</div>
                    <a
                      href={`mailto:${sellerProfile.email}`}
                      className="text-orange-600 hover:text-orange-700 transition-colors"
                    >
                      {sellerProfile.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {currentUserSellerProfile?.id !== id && (
              <div className="space-y-3">
                <button
                  onClick={() => router.push(`/chat/${sellerProfile.accountId}`)}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Chat với người bán
                </button>
              </div>
            )}

            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
              <h4 className="font-bold text-gray-800 mb-4">Cam kết chất lượng</h4>
              <div className="space-y-3">
                {[
                  { icon: '✓', text: 'Sản phẩm chính hãng', color: 'bg-green-500' },
                  { icon: '⚡', text: 'Giao hàng nhanh chóng', color: 'bg-blue-500' },
                  { icon: '★', text: 'Dịch vụ 5 sao', color: 'bg-orange-500' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 ${item.color} rounded-full flex items-center justify-center`}
                    >
                      <span className="text-white font-bold text-xs">{item.icon}</span>
                    </div>
                    <span className="text-sm text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <SellerProductsSection sellerId={id} sellerName={sellerProfile.shopName} />
      </div>
    </div>
  );
}
