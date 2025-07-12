'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
import { Loader2, Search, Shield, User } from 'lucide-react';

const roleDisplayMap: Record<string, string> = {
  ROLE_ADMIN: 'Admin',
  ROLE_CUSTOMER: 'User',
  ROLE_SELLER: 'Seller',
};
const roles = ['All', ...Object.keys(roleDisplayMap)];
const statuses = ['All', 'active', 'banned'];

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
    toggleStatus,
    updateRoles,
  } = useAccountManager();

  if (loading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return <div className="flex h-[200px] items-center justify-center text-red-500">{error}</div>;
  }

  const handleToggleBan = async (userId: string, enabled: boolean) => {
    await toggleStatus(userId, !enabled);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">User Management</h1>
      </div>

      <Card className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Shop</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {user.roles.includes('ROLE_ADMIN') ? (
                        <Shield className="h-4 w-4 text-red-500" />
                      ) : (
                        <User className="h-4 w-4 text-blue-500" />
                      )}
                      <span className="capitalize">
                        {user.roles.map((role) => roleDisplayMap[role]).join(', ')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.enabled ? 'active' : 'banned'}
                    </span>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>{new Date(user.joinInDate).toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      {/*<ViewUserDialog user={user} onToggleBan={handleToggleBan} />*/}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {page * pageSize + 1} to {Math.min((page + 1) * pageSize, accounts.length)} of{' '}
            {accounts.length} users
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={(page + 1) * pageSize >= total}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
