import { handlePhoneInput } from '@/components/input/InputHandle';
import { checkEmailAvailability, checkUsernameAvailability } from '@/services/account.api';
import { registerInternal } from '@/services/auth.api';
import { fileApi } from '@/services/file.api';
import Joi from 'joi';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

export type ValidationState = {
  isValid: boolean | null;
  isValidating: boolean;
  message: string;
};

export type FormData = {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  gender: string;
  avatarUrl: string;
  password: string;
  rePassword: string;
};

export type CustomerRegisterHookReturn = {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;

  usernameValidation: ValidationState;
  emailValidation: ValidationState;

  errors: Record<string, string>;

  avatarFile: File | null;
  avatarPreview: string;
  avatarError: string;
  handleAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeAvatar: () => void;
  triggerFileInput: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;

  showPassword: boolean;
  showConfirmPassword: boolean;
  togglePasswordVisibility: (field: 'password' | 'confirmPassword') => void;

  termsAccepted: boolean;
  setTermsAccepted: (accepted: boolean) => void;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
};

const registerSchema = Joi.object({
  username: Joi.string().required().min(3).max(30).alphanum().messages({
    'string.empty': 'Tên đăng nhập không được để trống',
    'string.min': 'Tên đăng nhập phải có ít nhất 3 ký tự',
    'string.max': 'Tên đăng nhập không được vượt quá 30 ký tự',
    'string.alphanum': 'Tên đăng nhập chỉ được chứa chữ cái và số',
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.empty': 'Email không được để trống',
      'string.email': 'Vui lòng nhập email hợp lệ',
    }),
  firstName: Joi.string().required().min(1).max(50).messages({
    'string.empty': 'Họ không được để trống',
    'string.max': 'Họ không được vượt quá 50 ký tự',
  }),
  lastName: Joi.string().required().min(1).max(50).messages({
    'string.empty': 'Tên không được để trống',
    'string.max': 'Tên không được vượt quá 50 ký tự',
  }),
  phone: Joi.string()
    .required()
    .pattern(/^[0-9]{10}$/)
    .messages({
      'string.empty': 'Số điện thoại không được để trống',
      'string.pattern.base': 'Số điện thoại phải có 10 chữ số',
    }),
  address: Joi.string().optional().allow('').max(200).messages({
    'string.max': 'Địa chỉ không được vượt quá 200 ký tự',
  }),
  gender: Joi.string().optional().allow(''),
  password: Joi.string().required().min(6).max(128).messages({
    'string.empty': 'Mật khẩu không được để trống',
    'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
    'string.max': 'Mật khẩu không được vượt quá 128 ký tự',
  }),
  rePassword: Joi.string().required().valid(Joi.ref('password')).messages({
    'string.empty': 'Xác nhận mật khẩu không được để trống',
    'any.only': 'Mật khẩu và xác nhận mật khẩu không khớp',
  }),
  avatarUrl: Joi.string().optional().allow(''),
});

const useDebounce = (callback: () => void, delay: number, dependencies: React.DependencyList) => {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(callback, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, dependencies);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return { cancel };
};

export const useCustomerRegister = (): CustomerRegisterHookReturn => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    gender: '',
    avatarUrl: '',
    password: '',
    rePassword: '',
  });

  // Validation states
  const [usernameValidation, setUsernameValidation] = useState<ValidationState>({
    isValid: null,
    isValidating: false,
    message: '',
  });

  const [emailValidation, setEmailValidation] = useState<ValidationState>({
    isValid: null,
    isValidating: false,
    message: '',
  });

  const [currentUsername, setCurrentUsername] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [avatarError, setAvatarError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateUsername = useCallback(async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameValidation({
        isValid: null,
        isValidating: false,
        message: '',
      });
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!usernameRegex.test(username)) {
      setUsernameValidation({
        isValid: false,
        isValidating: false,
        message: 'Tên đăng nhập chỉ được chứa chữ cái và số',
      });
      return;
    }

    setUsernameValidation((prev) => ({
      ...prev,
      isValidating: true,
    }));

    try {
      const isAvailable = await checkUsernameAvailability(username);
      setUsernameValidation({
        isValid: isAvailable,
        isValidating: false,
        message: isAvailable ? 'Tên đăng nhập có thể sử dụng' : 'Tên đăng nhập đã được sử dụng',
      });
    } catch (error) {
      setUsernameValidation({
        isValid: false,
        isValidating: false,
        message: 'Không thể kiểm tra tên đăng nhập. Vui lòng thử lại.',
      });
    }
  }, []);

  const validateEmail = useCallback(async (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      setEmailValidation({
        isValid: null,
        isValidating: false,
        message: '',
      });
      return;
    }

    if (!emailRegex.test(email)) {
      setEmailValidation({
        isValid: false,
        isValidating: false,
        message: 'Định dạng email không hợp lệ',
      });
      return;
    }

    setEmailValidation((prev) => ({
      ...prev,
      isValidating: true,
    }));

    try {
      const isAvailable = await checkEmailAvailability(email);
      setEmailValidation({
        isValid: isAvailable,
        isValidating: false,
        message: isAvailable ? 'Email có thể sử dụng' : 'Email đã được sử dụng',
      });
    } catch (error) {
      setEmailValidation({
        isValid: false,
        isValidating: false,
        message: 'Không thể kiểm tra email. Vui lòng thử lại.',
      });
    }
  }, []);

  const { cancel: cancelUsernameDebounce } = useDebounce(
    () => {
      if (currentUsername) {
        validateUsername(currentUsername);
      }
    },
    400,
    [currentUsername],
  );

  const { cancel: cancelEmailDebounce } = useDebounce(
    () => {
      if (currentEmail) {
        validateEmail(currentEmail);
      }
    },
    400,
    [currentEmail],
  );

  useEffect(() => {
    return () => {
      cancelUsernameDebounce();
      cancelEmailDebounce();
    };
  }, [cancelUsernameDebounce, cancelEmailDebounce]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;

      if (name === 'phone' && e.target instanceof HTMLInputElement) {
        handlePhoneInput(e as React.ChangeEvent<HTMLInputElement>);
      }

      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: '' }));

      if (name === 'username') {
        setCurrentUsername(value);
        if (!value) {
          setUsernameValidation({
            isValid: null,
            isValidating: false,
            message: '',
          });
        }
      } else if (name === 'email') {
        setCurrentEmail(value);
        if (!value) {
          setEmailValidation({
            isValid: null,
            isValidating: false,
            message: '',
          });
        }
      }
    },
    [],
  );

  const handleAvatarUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setAvatarError('');
    if (file) {
      if (!file.type.startsWith('image/')) {
        setAvatarError('Vui lòng chọn file hình ảnh hợp lệ.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setAvatarError('Kích thước file không được vượt quá 5MB.');
        return;
      }

      setAvatarFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const removeAvatar = useCallback(() => {
    setAvatarFile(null);
    setAvatarPreview('');
    setFormData((prev) => ({ ...prev, avatarUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const togglePasswordVisibility = useCallback(
    (field: 'password' | 'confirmPassword') => {
      if (field === 'password') setShowPassword(!showPassword);
      else setShowConfirmPassword(!showConfirmPassword);
    },
    [showPassword, showConfirmPassword],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setErrors({});
      setAvatarError('');

      try {
        if (!termsAccepted) {
          setErrors((prev) => ({
            ...prev,
            terms: 'Bạn phải đồng ý với Điều khoản và Chính sách.',
          }));
          setIsLoading(false);
          return;
        }

        // Check validation states
        if (usernameValidation.isValidating || emailValidation.isValidating) {
          setErrors((prev) => ({
            ...prev,
            general: 'Đang kiểm tra thông tin. Vui lòng đợi...',
          }));
          setIsLoading(false);
          return;
        }

        if (usernameValidation.isValid === false) {
          setErrors((prev) => ({
            ...prev,
            username: usernameValidation.message,
          }));
          setIsLoading(false);
          return;
        }

        if (emailValidation.isValid === false) {
          setErrors((prev) => ({
            ...prev,
            email: emailValidation.message,
          }));
          setIsLoading(false);
          return;
        }

        const validation = registerSchema.validate(formData, { abortEarly: false });
        if (validation.error) {
          const newErrors: Record<string, string> = {};
          validation.error.details.forEach((error) => {
            if (error.path[0]) {
              newErrors[error.path[0].toString()] = error.message;
            }
          });
          setErrors(newErrors);
          setIsLoading(false);
          return;
        }

        let avatarUrl = formData.avatarUrl;
        if (avatarFile) {
          avatarUrl = await fileApi.fileUpload(avatarFile);
        }
        const submitData = {
          ...formData,
          gender: formData.gender ? Number(formData.gender) : undefined,
          avatarUrl,
        };

        await registerInternal(submitData);
        setTimeout(() => router.push('/login'), 2000);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : 'Có lỗi xảy ra. Vui lòng thử lại.';
        setErrors((prev) => ({ ...prev, general: errorMessage }));
      } finally {
        setIsLoading(false);
      }
    },
    [formData, termsAccepted, usernameValidation, emailValidation, avatarFile, router],
  );

  return {
    formData,
    handleInputChange,

    usernameValidation,
    emailValidation,

    errors,

    avatarFile,
    avatarPreview,
    avatarError,
    handleAvatarUpload,
    removeAvatar,
    triggerFileInput,
    fileInputRef,

    showPassword,
    showConfirmPassword,
    togglePasswordVisibility,

    termsAccepted,
    setTermsAccepted,
    isLoading,
    handleSubmit,
  };
};
