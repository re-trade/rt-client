import { useToast } from '@/context/ToastContext';
import { checkEmailAvailability, checkUsernameAvailability } from '@/services/account.api';
import { registerInternal } from '@/services/auth.api';

import Joi from 'joi';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface Province {
  code: number;
  name: string;
  districts: District[];
}

export interface District {
  code: number;
  name: string;
  wards: Ward[];
}

export interface Ward {
  code: number;
  name: string;
}

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

  password: string;
  rePassword: string;
};

export type CustomerRegisterHookReturn = {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;

  usernameValidation: ValidationState;
  emailValidation: ValidationState;
  phoneValidation: ValidationState;

  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;

  showPassword: boolean;
  showConfirmPassword: boolean;
  togglePasswordVisibility: (field: 'password' | 'confirmPassword') => void;

  termsAccepted: boolean;
  setTermsAccepted: (accepted: boolean) => void;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
};

const registerSchema = Joi.object({
  username: Joi.string()
    .required()
    .min(3)
    .max(30)
    .pattern(/^[a-z][a-z0-9]*$/)
    .messages({
      'string.empty': 'Tên đăng nhập không được để trống',
      'string.min': 'Tên đăng nhập phải có ít nhất 3 ký tự',
      'string.max': 'Tên đăng nhập không được vượt quá 30 ký tự',
      'string.pattern.base':
        'Tên đăng nhập phải bắt đầu bằng chữ cái thường và chỉ chứa chữ cái thường và số',
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
  address: Joi.string().required().min(1).max(200).messages({
    'string.empty': 'Vui lòng chọn đầy đủ Tỉnh/Thành phố, Quận/Huyện và Phường/Xã',
    'string.min': 'Vui lòng chọn đầy đủ Tỉnh/Thành phố, Quận/Huyện và Phường/Xã',
    'string.max': 'Địa chỉ không được vượt quá 200 ký tự',
    'any.required': 'Vui lòng chọn đầy đủ Tỉnh/Thành phố, Quận/Huyện và Phường/Xã',
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
});

const useDebounce = (callback: () => void, delay: number, dependencies: React.DependencyList) => {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      savedCallback.current();
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [...dependencies, delay]);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return { cancel };
};

export const useCustomerRegister = (): CustomerRegisterHookReturn => {
  const router = useRouter();
  const { showToast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    gender: '',

    password: '',
    rePassword: '',
  });

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

  const [phoneValidation, setPhoneValidation] = useState<ValidationState>({
    isValid: null,
    isValidating: false,
    message: '',
  });

  const [currentUsername, setCurrentUsername] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateUsername = useCallback(async (username: string) => {
    if (!username) {
      setUsernameValidation({
        isValid: null,
        isValidating: false,
        message: '',
      });
      return;
    }

    if (/[A-Z]/.test(username)) {
      setUsernameValidation({
        isValid: false,
        isValidating: false,
        message: 'Tên đăng nhập chỉ được chứa chữ cái thường và số',
      });
      return;
    }

    if (/^[0-9]/.test(username)) {
      setUsernameValidation({
        isValid: false,
        isValidating: false,
        message: 'Tên đăng nhập không được bắt đầu bằng số',
      });
      return;
    }

    if (/[^a-z0-9]/.test(username)) {
      setUsernameValidation({
        isValid: false,
        isValidating: false,
        message:
          'Tên đăng nhập chỉ được chứa chữ cái thường và số, không có ký tự đặc biệt hoặc khoảng trắng',
      });
      return;
    }

    if (username.length < 3) {
      setUsernameValidation({
        isValid: false,
        isValidating: false,
        message: 'Tên đăng nhập phải có ít nhất 3 ký tự',
      });
      return;
    }

    if (username.length > 30) {
      setUsernameValidation({
        isValid: false,
        isValidating: false,
        message: 'Tên đăng nhập không được vượt quá 30 ký tự',
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
    } catch {
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
    } catch {
      setEmailValidation({
        isValid: false,
        isValidating: false,
        message: 'Không thể kiểm tra email. Vui lòng thử lại.',
      });
    }
  }, []);

  const validatePhone = useCallback((phone: string) => {
    if (!phone) {
      setPhoneValidation({
        isValid: null,
        isValidating: false,
        message: '',
      });
      return;
    }

    if (!/^\d*$/.test(phone)) {
      setPhoneValidation({
        isValid: false,
        isValidating: false,
        message: 'Số điện thoại chỉ được chứa chữ số',
      });
      return;
    }

    if (phone.length !== 10) {
      setPhoneValidation({
        isValid: false,
        isValidating: false,
        message: 'Số điện thoại phải có đúng 10 chữ số',
      });
      return;
    }

    setPhoneValidation({
      isValid: true,
      isValidating: false,
      message: 'Số điện thoại hợp lệ',
    });
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
      const { name } = e.target;
      let { value } = e.target;

      if (name === 'username') {
        value = value.toLowerCase();
        value = value.replace(/[^a-z0-9]/g, '');
        if (value.length > 30) {
          value = value.substring(0, 30);
        }

        setCurrentUsername(value);
        validateUsername(value);
      } else if (name === 'phone') {
        value = value.replace(/[^0-9]/g, '');
        if (value.length > 10) {
          value = value.substring(0, 10);
        }

        validatePhone(value);
      } else if (name === 'email') {
        setCurrentEmail(value);
        if (!value) {
          setEmailValidation({
            isValid: null,
            isValidating: false,
            message: '',
          });
        }
      } else if (name === 'address') {
        setErrors((prev) => ({ ...prev, address: '' }));
      }

      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: '' }));
    },
    [validateUsername, validatePhone],
  );

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

      try {
        if (!termsAccepted) {
          setErrors((prev) => ({
            ...prev,
            terms: 'Bạn phải đồng ý với Điều khoản và Chính sách.',
          }));
          showToast('Vui lòng đồng ý với Điều khoản và Chính sách', 'error');
          setIsLoading(false);
          return;
        }

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
          showToast('Tên đăng nhập chưa hợp lệ', 'error');
          setIsLoading(false);
          return;
        }

        if (emailValidation.isValid === false) {
          setErrors((prev) => ({
            ...prev,
            email: emailValidation.message,
          }));
          showToast('Email chưa hợp lệ', 'error');
          setIsLoading(false);
          return;
        }

        if (phoneValidation.isValid === false) {
          setErrors((prev) => ({
            ...prev,
            phone: phoneValidation.message,
          }));
          showToast('Số điện thoại chưa hợp lệ', 'error');
          setIsLoading(false);
          return;
        }

        const addressParts = formData.address.split(',').map((part) => part.trim());
        if (!formData.address || addressParts.length < 3) {
          setErrors((prev) => ({
            ...prev,
            address: 'Vui lòng chọn đầy đủ Tỉnh/Thành phố, Quận/Huyện và Phường/Xã',
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
          showToast('Vui lòng kiểm tra lại thông tin đăng ký', 'error');
          setIsLoading(false);
          return;
        }

        const submitData = {
          ...formData,
          gender: formData.gender ? Number(formData.gender) : undefined,
        };

        await registerInternal(submitData);
        showToast(
          'Đăng ký tài khoản thành công! Đang chuyển hướng đến trang đăng nhập...',
          'success',
        );
        setTimeout(() => router.push('/login'), 2000);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : 'Có lỗi xảy ra. Vui lòng thử lại.';
        setErrors((prev) => ({ ...prev, general: errorMessage }));
        showToast(errorMessage, 'error');
      } finally {
        setIsLoading(false);
      }
    },
    [formData, termsAccepted, usernameValidation, emailValidation, phoneValidation, router],
  );

  return {
    formData,
    handleInputChange,

    usernameValidation,
    emailValidation,
    phoneValidation,

    errors,
    setErrors,

    showPassword,
    showConfirmPassword,
    togglePasswordVisibility,

    termsAccepted,
    setTermsAccepted,
    isLoading,
    handleSubmit,
  };
};
