'use client';

import { useSecurityForm } from '@/hooks/use-security-form';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordFormProps {
  onSubmit: (values: ChangePasswordFormValues) => Promise<boolean>;
  onCancel?: () => void;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ onSubmit, onCancel }) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const initialValues: ChangePasswordFormValues = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  const validateForm = (values: ChangePasswordFormValues) => {
    const errors: Partial<Record<keyof ChangePasswordFormValues, string>> = {};

    if (!values.currentPassword.trim()) {
      errors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
    }

    if (!values.newPassword.trim()) {
      errors.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else if (values.newPassword.length < 8) {
      errors.newPassword = 'Mật khẩu mới phải có ít nhất 8 ký tự';
    } else if (!/[A-Z]/.test(values.newPassword)) {
      errors.newPassword = 'Mật khẩu mới phải có ít nhất 1 ký tự hoa';
    } else if (!/[0-9]/.test(values.newPassword)) {
      errors.newPassword = 'Mật khẩu mới phải có ít nhất 1 số';
    } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(values.newPassword)) {
      errors.newPassword = 'Mật khẩu mới phải có ít nhất 1 ký tự đặc biệt';
    } else if (values.newPassword === values.currentPassword) {
      errors.newPassword = 'Mật khẩu mới không được trùng với mật khẩu hiện tại';
    }

    if (!values.confirmPassword.trim()) {
      errors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
    } else if (values.newPassword !== values.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    return errors;
  };

  const { values, errors, isSubmitting, formError, handleInputChange, handleSubmit } =
    useSecurityForm({
      initialValues,
      onSubmit,
      validate: validateForm,
    });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm flex items-start gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mt-0.5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>{formError}</span>
        </div>
      )}

      <div>
        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Mật khẩu hiện tại
        </label>
        <div className="relative">
          <input
            id="currentPassword"
            name="currentPassword"
            type={showCurrentPassword ? 'text' : 'password'}
            value={values.currentPassword}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 ${
              errors.currentPassword
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-amber-500 focus:ring-amber-500'
            }`}
            placeholder="Nhập mật khẩu hiện tại"
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
          >
            {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.currentPassword && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.currentPassword}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="newPassword"
          className="text-sm font-medium text-gray-700 mb-1 flex items-center justify-between"
        >
          <span>Mật khẩu mới</span>
          <span className="text-xs text-gray-500">
            Ít nhất 8 ký tự, 1 chữ hoa, 1 số và 1 ký tự đặc biệt
          </span>
        </label>
        <div className="relative">
          <input
            id="newPassword"
            name="newPassword"
            type={showNewPassword ? 'text' : 'password'}
            value={values.newPassword}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 ${
              errors.newPassword
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-amber-500 focus:ring-amber-500'
            }`}
            placeholder="Nhập mật khẩu mới"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
          >
            {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.newPassword && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.newPassword}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Xác nhận mật khẩu mới
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={values.confirmPassword}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 ${
              errors.confirmPassword
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-amber-500 focus:ring-amber-500'
            }`}
            placeholder="Xác nhận mật khẩu mới"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Hủy bỏ
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 rounded-md text-sm font-medium bg-[#FFECBC] text-[#976100] hover:bg-[#FFE7A8] transition-colors disabled:opacity-50 flex items-center justify-center shadow-sm"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#976100]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Đang xử lý...
            </>
          ) : (
            'Đổi mật khẩu'
          )}
        </button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
