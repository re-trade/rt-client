'use client';

import { useSecurityForm } from '@/hooks/use-security-form';
import { useState } from 'react';

interface ChangeEmailFormValues {
  currentEmail: string;
  newEmail: string;
  password: string;
}

interface ChangeEmailFormProps {
  currentEmail: string;
  onSubmit: (values: ChangeEmailFormValues) => Promise<boolean>;
  onCancel?: () => void;
}

const ChangeEmailForm: React.FC<ChangeEmailFormProps> = ({ currentEmail, onSubmit, onCancel }) => {
  const [showPassword, setShowPassword] = useState(false);

  const initialValues: ChangeEmailFormValues = {
    currentEmail,
    newEmail: '',
    password: '',
  };

  const validateForm = (values: ChangeEmailFormValues) => {
    const errors: Partial<Record<keyof ChangeEmailFormValues, string>> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!values.newEmail.trim()) {
      errors.newEmail = 'Vui lòng nhập email mới';
    } else if (!emailRegex.test(values.newEmail)) {
      errors.newEmail = 'Email không hợp lệ';
    } else if (values.newEmail === values.currentEmail) {
      errors.newEmail = 'Email mới không được trùng với email hiện tại';
    }

    if (!values.password.trim()) {
      errors.password = 'Vui lòng nhập mật khẩu để xác nhận';
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
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {formError}
        </div>
      )}

      <div>
        <label htmlFor="currentEmail" className="block text-sm font-medium text-gray-700 mb-1">
          Email hiện tại
        </label>
        <input
          id="currentEmail"
          type="email"
          value={values.currentEmail}
          disabled
          className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
        />
      </div>

      <div>
        <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700 mb-1">
          Email mới
        </label>
        <input
          id="newEmail"
          name="newEmail"
          type="email"
          value={values.newEmail}
          onChange={handleInputChange}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 ${
            errors.newEmail
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-600'
              : 'border-gray-300 focus:border-amber-500 focus:ring-amber-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white'
          }`}
          placeholder="Nhập email mới"
        />
        {errors.newEmail && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.newEmail}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Mật khẩu
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={values.password}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 ${
              errors.password
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-600'
                : 'border-gray-300 focus:border-amber-500 focus:ring-amber-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white'
            }`}
            placeholder="Nhập mật khẩu để xác nhận"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                  clipRule="evenodd"
                />
                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
              </svg>
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
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
          className="px-4 py-2 rounded-md text-sm font-medium bg-[#FFECBC] text-[#976100] hover:bg-[#FFE7A8] transition-colors disabled:opacity-50 flex items-center justify-center"
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
            'Đổi email'
          )}
        </button>
      </div>
    </form>
  );
};

export default ChangeEmailForm;
