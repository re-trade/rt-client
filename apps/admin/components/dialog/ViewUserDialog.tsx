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
                {user.roles.map((role) => (
                  <span
                    key={role}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700"
                  >
                    {role.includes('ADMIN') && <Shield className="h-3 w-3" />}
                    {role.replace('ROLE_', '')}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-medium">Status</div>
            <div className="col-span-3">
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  user.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {user.enabled ? 'Active' : 'Banned'}
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
            variant={user.enabled ? 'destructive' : 'default'}
            onClick={() => onToggleBan(user.id, user.enabled ? 'active' : 'banned')}
            className="flex items-center gap-2"
          >
            <Ban className="h-4 w-4" />
            {user.enabled ? 'Ban User' : 'Unban User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
