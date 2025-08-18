'use client';

import { DetailedUserDialog } from '@/components/dialog/DetailedUserDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAccountManager } from '@/hooks/use-account-manager';
import {
  DetailedAccountResponse,
  getAccountById,
  getRoleDisplayName,
  hasRole,
  RoleObject,
} from '@/services/account.api';
import {
  AlertCircle,
  Ban,
  Calendar,
  Download,
  Edit,
  Eye,
  Loader2,
  MoreHorizontal,
  RefreshCw,
  Search,
  Shield,
  User,
  UserCheck,
  Users,
  UserX,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

const roles = ['All', 'ROLE_ADMIN', 'ROLE_CUSTOMER', 'ROLE_SELLER'];
const statuses = [
  { value: 'All', label: 'Tất cả trạng thái' },
  { value: 'active', label: 'Đang hoạt động' },
  { value: 'banned', label: 'Bị cấm' },
];

export default function UserManagementPage() {
  const {
    accounts,
    loading,
    error,
    page,
    setPage,
    searchQuery,
    setSearchQuery,
    selectedRole,
    setSelectedRole,
    selectedStatus,
    setSelectedStatus,
    total,
    pageSize,
    refresh,
    banAccount,
    unbanAccount,
    banSeller,
    unbanSeller,
  } = useAccountManager();

  const [selectedUser, setSelectedUser] = useState<DetailedAccountResponse | null>(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [loadingUserDetails, setLoadingUserDetails] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleToggleBan = async (
    userId: string,
    currentStatus: string,
    banType: 'account' | 'seller' = 'account',
  ) => {
    const enabled = currentStatus !== 'banned';

    try {
      let success = false;

      if (banType === 'seller') {
        success = enabled ? await banSeller(userId) : await unbanSeller(userId);
      } else {
        success = enabled ? await banAccount(userId) : await unbanAccount(userId);
      }

      if (success) {
        await refresh();
        if (selectedUser && selectedUser.id === userId) {
          await handleViewUserDetails(userId);
        }
      }

      return success;
    } catch (error) {
      console.error('Error toggling ban status:', error);
      return false;
    }
  };

  const handleViewUserDetails = async (userId: string) => {
    setLoadingUserDetails(true);
    try {
      const response = await getAccountById(userId);
      if (response?.success && response.content) {
        setSelectedUser(response.content);
        setUserDialogOpen(true);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoadingUserDetails(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const handleExport = () => {
    try {
      if (accounts.length === 0) {
        toast.warning('Không có dữ liệu để xuất!');
        return;
      }

      setExporting(true);

      // Chuẩn bị dữ liệu để export
      const exportData = accounts.map((user) => ({
        'ID Người dùng': user.id,
        'Tên đăng nhập': user.username,
        Email: user.email,
        'Trạng thái tài khoản': user.enabled ? 'Hoạt động' : 'Bị cấm',
        'Trạng thái khóa': user.locked ? 'Bị khóa' : 'Không bị khóa',
        'Sử dụng 2FA': user.using2FA ? 'Có' : 'Không',
        'Đã đổi tên': user.changedUsername ? 'Có' : 'Không',
        'Lần đăng nhập cuối': user.lastLogin
          ? new Date(user.lastLogin).toLocaleDateString('vi-VN')
          : 'Chưa đăng nhập',
        'Ngày tham gia': formatDate(user.joinInDate),
        'Vai trò':
          user.roles?.map((role) => getRoleDisplayName(role)).join(', ') || 'Chưa có vai trò',
        'Vai trò Seller': hasRole(user.roles || [], 'ROLE_SELLER') ? 'Có' : 'Không',
        'Vai trò Customer': hasRole(user.roles || [], 'ROLE_CUSTOMER') ? 'Có' : 'Không',
        'Vai trò Admin': hasRole(user.roles || [], 'ROLE_ADMIN') ? 'Có' : 'Không',
      }));

      // Tạo workbook và worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Điều chỉnh độ rộng cột
      const columnWidths = [
        { wch: 15 }, // ID Người dùng
        { wch: 20 }, // Tên đăng nhập
        { wch: 25 }, // Email
        { wch: 20 }, // Trạng thái tài khoản
        { wch: 20 }, // Trạng thái khóa
        { wch: 15 }, // Sử dụng 2FA
        { wch: 15 }, // Đã đổi tên
        { wch: 20 }, // Lần đăng nhập cuối
        { wch: 15 }, // Ngày tham gia
        { wch: 30 }, // Vai trò
        { wch: 15 }, // Vai trò Seller
        { wch: 15 }, // Vai trò Customer
        { wch: 15 }, // Vai trò Admin
      ];
      worksheet['!cols'] = columnWidths;

      // Thêm worksheet vào workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Người dùng');

      // Tạo tên file với timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const fileName = `danh_sach_nguoi_dung_trang_${page + 1}_${timestamp}.xlsx`;

      // Download file
      XLSX.writeFile(workbook, fileName);

      toast.success(`Đã xuất ${exportData.length} người dùng từ trang ${page + 1} thành công!`);
    } catch (error) {
      console.error('Lỗi khi xuất dữ liệu:', error);
      toast.error('Có lỗi xảy ra khi xuất dữ liệu. Vui lòng thử lại.');
    } finally {
      setExporting(false);
    }
  };

  const handleExportAll = async () => {
    try {
      if (total === 0) {
        toast.warning('Không có dữ liệu để xuất!');
        return;
      }

      toast.info('Đang chuẩn bị xuất tất cả người dùng...');
      setExporting(true);

      // TODO: Implement API call để lấy tất cả người dùng
      // Hiện tại sẽ sử dụng dữ liệu trang hiện tại
      toast.warning(
        'Tính năng xuất tất cả người dùng cần API riêng. Hiện tại chỉ xuất được trang hiện tại.',
      );
    } catch (error) {
      console.error('Lỗi khi xuất tất cả dữ liệu:', error);
      toast.error('Có lỗi xảy ra khi xuất tất cả dữ liệu. Vui lòng thử lại.');
    } finally {
      setExporting(false);
    }
  };

  const handleActiveRole = (roles: RoleObject[], targetRole: 'ROLE_SELLER' | 'ROLE_CUSTOMER') => {
    const role = roles.find((r) => r.code === targetRole);
    if (!role) return true;
    return role.enabled;
  };

  const getStatusBadge = (enabled: boolean, locked: boolean) => {
    if (locked) {
      return (
        <span
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border"
          style={{
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            borderColor: '#fecaca',
          }}
        >
          <Ban className="h-3 w-3" />
          Tài khoản bị cấm
        </span>
      );
    }

    return enabled ? (
      <span
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border"
        style={{
          backgroundColor: '#ecfdf5',
          color: '#047857',
          borderColor: '#a7f3d0',
        }}
      >
        <UserCheck className="h-3 w-3" />
        Hoạt động
      </span>
    ) : (
      <span
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border"
        style={{
          backgroundColor: '#fef2f2',
          color: '#dc2626',
          borderColor: '#fecaca',
        }}
      >
        <UserX className="h-3 w-3" />
        Bị cấm
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl border border-orange-200/50 shadow-sm">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent mb-1">
                  Quản lý người dùng
                </h1>
                <p className="text-slate-600">
                  Hiện tại {accounts.length} trong tổng số {total} người dùng
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={refresh}
                variant="outline"
                size="sm"
                disabled={loading}
                className="flex items-center gap-2 border-slate-200 hover:bg-slate-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Làm mới
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 border-slate-200 hover:bg-slate-50"
                    disabled={accounts.length === 0 || loading || exporting}
                  >
                    {exporting ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    {exporting ? 'Đang xuất...' : 'Xuất dữ liệu'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-white/95 backdrop-blur-sm shadow-xl border-slate-200"
                >
                  <DropdownMenuLabel className="text-slate-700">Chọn loại xuất</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleExport}
                    className="hover:bg-blue-50 hover:text-blue-700"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Xuất trang hiện tại ({accounts.length} người dùng)
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleExportAll()}
                    className="hover:bg-green-50 hover:text-green-700"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Xuất tất cả ({total} người dùng)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {error && (
          <Card className="mb-6 border-red-200/50 bg-red-50/50 shadow-sm">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3 text-red-700">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium">Có lỗi xảy ra</p>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refresh()}
                  className="border-red-200 text-red-700 hover:bg-red-100 shadow-sm"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Thử lại
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filters */}
        <Card className="mb-6 shadow-sm border-slate-200/50 bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Tìm kiếm theo tên người dùng hoặc email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-slate-200 focus:border-orange-400 focus:ring-orange-400/20 bg-white/50"
                />
              </div>
              <div className="flex gap-2">
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-[180px] border-slate-200 bg-white/50">
                    <SelectValue placeholder="Vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => {
                      const displayName =
                        role === 'All' ? 'Tất cả vai trò' : getRoleDisplayName(role);
                      return (
                        <SelectItem key={role} value={role}>
                          {displayName}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[180px] border-slate-200 bg-white/50">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg shadow-slate-200/50 border-slate-200/50 bg-white/80 backdrop-blur-sm">
          <CardHeader className="border-b border-slate-200/50 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Users className="h-5 w-5 text-orange-600" />
                  Danh sách người dùng
                </CardTitle>
                <CardDescription className="text-slate-600">
                  {total > 0
                    ? `Quản lý và theo dõi ${total} người dùng trong hệ thống`
                    : 'Không tìm thấy người dùng nào'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center space-y-3">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto text-orange-600" />
                  <p className="text-slate-600">Đang tải dữ liệu...</p>
                </div>
              </div>
            ) : accounts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-full p-6 mb-4 border border-orange-200/50">
                  <Users className="h-12 w-12 text-orange-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  Không tìm thấy người dùng
                </h3>
                <p className="text-slate-600 max-w-md">
                  Không có người dùng nào phù hợp với tiêu chí tìm kiếm của bạn.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-200 bg-slate-50/50 select-none">
                      <TableHead className="font-semibold text-slate-700">Tên người dùng</TableHead>
                      <TableHead className="font-semibold text-slate-700">Email</TableHead>
                      <TableHead className="font-semibold text-slate-700">Vai trò</TableHead>
                      <TableHead className="font-semibold text-slate-700">Trạng thái</TableHead>
                      <TableHead className="font-semibold text-slate-700">Ngày tham gia</TableHead>
                      <TableHead className="font-semibold text-slate-700 text-right w-24">
                        Thao tác
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accounts.map((user, index) => (
                      <TableRow
                        key={user.id}
                        className="hover:bg-slate-50/50 transition-colors duration-200 border-slate-200"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <TableCell className="font-medium">{user.username}</TableCell>
                        <TableCell className="text-slate-600">{user.email}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {user.locked ? (
                              <Ban className="h-4 w-4 text-red-500" />
                            ) : hasRole(user.roles || [], 'ROLE_ADMIN') ? (
                              <Shield className="h-4 w-4 text-red-500" />
                            ) : (
                              <User className="h-4 w-4 text-orange-500" />
                            )}
                            <span className="text-sm font-medium">
                              {user.locked
                                ? 'Vai trò tạm thời không khả dụng'
                                : (user.roles || [])
                                    .map((role) => getRoleDisplayName(role))
                                    .join(', ') || 'Chưa có vai trò'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(user.enabled, user.locked)}</TableCell>
                        <TableCell className="text-slate-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            <span className="text-sm">{formatDate(user.joinInDate)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-600 hover:text-orange-600 hover:bg-orange-50"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem
                                onClick={() => handleViewUserDetails(user.id)}
                                className="cursor-pointer"
                                disabled={loadingUserDetails}
                              >
                                {loadingUserDetails ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <Eye className="h-4 w-4 mr-2" />
                                )}
                                Xem chi tiết
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  // Handle edit roles
                                }}
                                className="cursor-pointer"
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Chỉnh sửa vai trò
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() =>
                                  handleToggleBan(
                                    user.id,
                                    user.locked ? 'banned' : 'active',
                                    'account',
                                  )
                                }
                                className={`cursor-pointer ${
                                  user.locked
                                    ? 'text-emerald-600 focus:text-emerald-600 focus:bg-emerald-50'
                                    : 'text-red-600 focus:text-red-600 focus:bg-red-50'
                                }`}
                              >
                                {user.locked ? (
                                  <UserCheck className="h-4 w-4 mr-2" />
                                ) : (
                                  <Ban className="h-4 w-4 mr-2" />
                                )}
                                {user.locked ? 'Bỏ cấm tài khoản' : 'Cấm tài khoản'}
                              </DropdownMenuItem>
                              {hasRole(user.roles || [], 'ROLE_SELLER') && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleToggleBan(
                                      user.id,
                                      !handleActiveRole(user.roles, 'ROLE_SELLER')
                                        ? 'banned'
                                        : 'active',
                                      'seller',
                                    )
                                  }
                                  className="cursor-pointer text-orange-600 focus:text-orange-600 focus:bg-orange-50"
                                >
                                  <Ban className="h-4 w-4 mr-2" />
                                  Cấm người bán
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {accounts.length > 0 && (
          <Card className="mt-6 shadow-sm border-slate-200/50 bg-white/80 backdrop-blur-sm">
            <CardContent className="py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-slate-600">
                  Hiển thị {page * pageSize + 1} đến {Math.min((page + 1) * pageSize, total)} trong
                  tổng số {total} người dùng
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 0}
                    className="border-slate-200 text-slate-700 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700 disabled:opacity-50"
                  >
                    Trước
                  </Button>
                  <div className="flex items-center gap-1 px-3 py-1 bg-orange-50 rounded-md border border-orange-200">
                    <span className="text-sm text-slate-600">Trang</span>
                    <span className="text-sm font-medium text-orange-700">{page + 1}</span>
                    <span className="text-sm text-slate-600">/ {Math.ceil(total / pageSize)}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={(page + 1) * pageSize >= total}
                    className="border-slate-200 text-slate-700 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700 disabled:opacity-50"
                  >
                    Sau
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed User Dialog */}
        {selectedUser && (
          <DetailedUserDialog
            user={selectedUser}
            onToggleBan={handleToggleBan}
            open={userDialogOpen}
            onOpenChange={setUserDialogOpen}
          />
        )}
      </div>
    </div>
  );
}
