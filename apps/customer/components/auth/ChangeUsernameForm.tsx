'use client';

import { useSecurityForm } from '@/hooks/use-security-form';
import Joi from 'joi';
import { useCallback, useState } from 'react';

interface ChangeUsernameForm {
  currentUsername: string;
  newUsername: string;
  password: string;
}

interface ChangeUsernameFormProps {
  currentUsername: string;
  hasChangedUsername?: boolean;
  onSubmit: (values: ChangeUsernameForm) => Promise<boolean>;
  onCancel?: () => void;
  checkUsernameAvailability?: (username: string) => Promise<boolean>;
}

const ChangeUsernameForm: React.FC<ChangeUsernameFormProps> = ({
  currentUsername,
  hasChangedUsername = false,
  onSubmit,
  onCancel,
  checkUsernameAvailability,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const initialValues: ChangeUsernameForm = {
    currentUsername,
    newUsername: '',
    password: '',
  };

  const checkUsernameDebounced = useCallback(
    async (username: string) => {
      if (!checkUsernameAvailability || !username || username === currentUsername) {
        setUsernameAvailable(null);
        setIsCheckingUsername(false);
        return;
      }

      if (username.length < 3 || !/^[a-zA-Z0-9_]+$/.test(username)) {
        setUsernameAvailable(null);
        setIsCheckingUsername(false);
        return;
      }

      setIsCheckingUsername(true);
      try {
        const isAvailable = await checkUsernameAvailability(username);
        setUsernameAvailable(isAvailable);
      } catch {
        setUsernameAvailable(null);
      } finally {
        setIsCheckingUsername(false);
      }
    },
    [checkUsernameAvailability, currentUsername],
  );

  const handleUsernameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const username = e.target.value;

      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      setUsernameAvailable(null);
      setIsCheckingUsername(false);

      const timer = setTimeout(() => {
        checkUsernameDebounced(username);
      }, 800);

      setDebounceTimer(timer);
    },
    [debounceTimer, checkUsernameDebounced],
  );

  const validationSchema = Joi.object({
    currentUsername: Joi.string().required(),
    newUsername: Joi.string()
      .min(3)
      .pattern(/^[a-zA-Z0-9_]+$/)
      .invalid(Joi.ref('currentUsername'))
      .required()
      .messages({
        'string.empty': 'Vui lòng nhập tên đăng nhập mới',
        'string.min': 'Tên đăng nhập phải có ít nhất 3 ký tự',
        'string.pattern.base': 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới',
        'any.invalid': 'Tên đăng nhập mới không được trùng với tên hiện tại',
        'any.required': 'Vui lòng nhập tên đăng nhập mới',
      }),
    password: Joi.string().required().messages({
      'string.empty': 'Vui lòng nhập mật khẩu để xác nhận',
      'any.required': 'Vui lòng nhập mật khẩu để xác nhận',
    }),
  });

  const validateForm = (values: ChangeUsernameForm) => {
    const { error } = validationSchema.validate(values, { abortEarly: false });

    if (!error) return {};

    const errors: Partial<Record<keyof ChangeUsernameForm, string>> = {};

    error.details.forEach((detail) => {
      const fieldName = detail.path[0] as keyof ChangeUsernameForm;
      if (!errors[fieldName]) {
        errors[fieldName] = detail.message;
      }
    });

    if (checkUsernameAvailability && values.newUsername && usernameAvailable === false) {
      errors.newUsername = 'Tên đăng nhập này đã được sử dụng';
    }

    return errors;
  };

  const { values, errors, isSubmitting, formError, handleInputChange, handleSubmit } =
    useSecurityForm({
      initialValues,
      onSubmit,
      validate: validateForm,
    });

  const handleUsernameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(e);
    handleUsernameChange(e);
  };

  if (hasChangedUsername) {
    return (
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md text-sm">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="font-medium">Thông báo</p>
              <p className="mt-1">
                Bạn đã thay đổi tên đăng nhập một lần rồi. Mỗi tài khoản chỉ được phép thay đổi tên
                đăng nhập một lần duy nhất để đảm bảo tính bảo mật.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="currentUsername"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tên đăng nhập hiện tại
            </label>
            <input
              id="currentUsername"
              type="text"
              value={currentUsername}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
            />
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-center">
            <svg
              className="w-12 h-12 text-gray-400 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <p className="text-sm text-gray-600 font-medium">Tính năng đã bị khóa</p>
            <p className="text-xs text-gray-500 mt-1">
              Bạn đã sử dụng hết lượt thay đổi tên đăng nhập
            </p>
          </div>

          <div className="flex justify-end">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Đóng
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-md text-sm">
        <div className="flex items-start">
          <svg
            className="w-5 h-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <p className="font-medium">Lưu ý quan trọng</p>
            <p className="mt-1">
              <strong>Bạn chỉ có thể thay đổi tên đăng nhập một lần duy nhất.</strong> Sau khi thay
              đổi thành công, bạn sẽ được chuyển hướng về trang đăng nhập để đăng nhập lại với tên
              đăng nhập mới.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {formError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {formError}
          </div>
        )}

        <div>
          <label htmlFor="currentUsername" className="block text-sm font-medium text-gray-700 mb-1">
            Tên đăng nhập hiện tại
          </label>
          <input
            id="currentUsername"
            type="text"
            value={values.currentUsername}
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
          />
        </div>

        <div>
          <label htmlFor="newUsername" className="block text-sm font-medium text-gray-700 mb-1">
            Tên đăng nhập mới
          </label>
          <div className="relative">
            <input
              id="newUsername"
              name="newUsername"
              type="text"
              value={values.newUsername}
              onChange={handleUsernameInputChange}
              className={`w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-1 ${
                errors.newUsername
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-600'
                  : usernameAvailable === true
                    ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                    : usernameAvailable === false
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-amber-500 focus:ring-amber-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white'
              }`}
              placeholder="Nhập tên đăng nhập mới"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {isCheckingUsername ? (
                <svg
                  className="animate-spin h-4 w-4 text-gray-400"
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
              ) : usernameAvailable === true ? (
                <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : usernameAvailable === false ? (
                <svg className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : null}
            </div>
          </div>

          {!errors.newUsername && values.newUsername && (
            <>
              {isCheckingUsername && (
                <p className="mt-1 text-sm text-gray-500">Đang kiểm tra tính khả dụng...</p>
              )}
              {usernameAvailable === true && (
                <p className="mt-1 text-sm text-green-600">✓ Tên đăng nhập có thể sử dụng</p>
              )}
              {usernameAvailable === false && (
                <p className="mt-1 text-sm text-red-600">✗ Tên đăng nhập này đã được sử dụng</p>
              )}
            </>
          )}

          {errors.newUsername && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.newUsername}</p>
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
            disabled={isSubmitting || isCheckingUsername || usernameAvailable === false}
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
              'Đổi tên đăng nhập'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangeUsernameForm;
