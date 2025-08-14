'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Ban, Eye, Shield } from 'lucide-react';

// Import the actual types from the API service
import type { AccountResponse } from '@/services/account.api';
import { getRoleDisplayName, hasRole } from '@/services/account.api';

interface ViewUserDialogProps {
  user: AccountResponse;
  onToggleBan: (userId: string, currentStatus: string) => void;
}

export function ViewUserDialog({ user, onToggleBan }: ViewUserDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>View detailed information about the user.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-medium">Username</div>
            <div className="col-span-3">{user.username}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-medium">Email</div>
            <div className="col-span-3">{user.email}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-medium">Roles</div>
            <div className="col-span-3">
              <div className="flex items-center gap-2">
                {user.locked ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <Ban className="h-3 w-3" />
                    Vai trò tạm thời không khả dụng
                  </span>
                ) : (
                  <>
                    {(user.roles || []).map((role, index) => (
                      <span
                        key={typeof role === 'string' ? role : `role-${index}`}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700"
                      >
                        {hasRole([role], 'ROLE_ADMIN') && <Shield className="h-3 w-3" />}
                        {getRoleDisplayName(role)}
                      </span>
                    ))}
                    {(!user.roles || user.roles.length === 0) && (
                      <span className="text-xs text-gray-500">Chưa được phân quyền</span>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-medium">Status</div>
            <div className="col-span-3">
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  user.locked
                    ? 'bg-red-100 text-red-800'
                    : user.enabled
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {user.locked ? 'Tài khoản bị cấm' : user.enabled ? 'Hoạt động' : 'Vô hiệu hóa'}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-medium">Join Date</div>
            <div className="col-span-3">{new Date(user.joinInDate).toLocaleDateString()}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-medium">Last Login</div>
            <div className="col-span-3">
              {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant={user.locked ? 'default' : 'destructive'}
            onClick={() => onToggleBan(user.id, user.locked ? 'banned' : 'active')}
            className="flex items-center gap-2"
          >
            <Ban className="h-4 w-4" />
            {user.locked ? 'Bỏ cấm tài khoản' : 'Cấm tài khoản'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
