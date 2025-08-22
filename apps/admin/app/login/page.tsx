'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { loginInternal } from '@/services/auth.api';
import Joi from 'joi';
import { EyeIcon, EyeOffIcon, KeyIcon, LoaderIcon, UserIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';

interface LoginForm {
  username: string;
  password: string;
}

const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    'string.empty': 'Vui lòng nhập tên đăng nhập',
    'any.required': 'Vui lòng nhập tên đăng nhập',
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Vui lòng nhập mật khẩu',
    'string.min': 'Mật khẩu phải có ít nhất {#limit} ký tự',
    'any.required': 'Vui lòng nhập mật khẩu',
  }),
});

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get('error');
  const { isAuth } = useAuth(true); // Không tự động check auth
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<LoginForm>({
    username: '',
    password: '',
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const isFormValid = formData.username.trim() !== '' && formData.password.trim() !== '';

  const validateForm = () => {
    const { error } = loginSchema.validate(formData, { abortEarly: false });
    if (error) {
      const errors: Record<string, string> = {};
      error.details.forEach((detail) => {
        if (detail.path[0]) {
          errors[detail.path[0].toString()] = detail.message;
        }
      });
      setValidationErrors(errors);

      // Display warning toast for validation errors
      toast.warning('Vui lòng điền đầy đủ thông tin đăng nhập!', {
        duration: 4000,
        style: {
          backgroundColor: '#fffbeb',
          borderColor: '#fbbf24',
          borderWidth: '2px',
          color: '#b45309',
          fontWeight: 'bold',
        },
        icon: '⚠️',
      });
      return false;
    }
    setValidationErrors({});
    return true;
  };

  const handleInputChange =
    (field: keyof LoginForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
      if (validationErrors[field]) {
        setValidationErrors((prev) => ({
          ...prev,
          [field]: '',
        }));
      }
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    toast.info(`Đang đăng nhập với tài khoản ${formData.username}...`, {
      duration: 2000,
      style: {
        backgroundColor: '#eff6ff',
        borderColor: '#93c5fd',
        borderWidth: '2px',
        color: '#2563eb',
      },
      icon: '🔄',
    });

    setIsLoading(true);
    try {
      await loginInternal(formData);
      await isAuth();
      toast.success('Đăng nhập thành công! Chào mừng bạn quay trở lại.', {
        duration: 3000,
        icon: '🎉',
        style: {
          backgroundColor: '#ecfdf5',
          borderColor: '#34d399',
          borderWidth: '2px',
          color: '#047857',
          fontWeight: 'bold',
        },
      });
      router.push('/dashboard');
    } catch (err) {
      setError('Tên đăng nhập hoặc mật khẩu không đúng');
      toast.error('Đăng nhập thất bại! Tên đăng nhập hoặc mật khẩu không chính xác.', {
        duration: 5000,
        style: {
          backgroundColor: '#fef2f2',
          borderColor: '#f87171',
          borderWidth: '2px',
          color: '#dc2626',
          fontWeight: 'bold',
        },
        icon: '❌',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">ReTrade Admin</CardTitle>
            <CardDescription className="text-center">Đăng nhập để quản lý hệ thống</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {errorParam === 'unauthorized' && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 text-center border-l-4 border-red-500">
                  Bạn không có quyền truy cập. Vui lòng đăng nhập với tài khoản admin.
                </div>
              )}
              {errorParam === 'session-expired' && (
                <div className="rounded-lg bg-amber-50 p-4 text-sm text-amber-600 text-center border-l-4 border-amber-500">
                  Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="username">Tên đăng nhập</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="username"
                    className="pl-10"
                    placeholder="Nhập tên đăng nhập"
                    value={formData.username}
                    onChange={handleInputChange('username')}
                  />
                </div>
                {validationErrors.username && (
                  <p className="text-sm text-red-500">{validationErrors.username}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="relative">
                  <KeyIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="pl-10 pr-10"
                    placeholder="Nhập mật khẩu"
                    value={formData.password}
                    onChange={handleInputChange('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-primary"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="text-sm text-red-500">{validationErrors.password}</p>
                )}
              </div>
              {error && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 border-l-4 border-red-500 font-medium">
                  {error}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                size="lg"
                type="submit"
                disabled={isLoading || !isFormValid}
              >
                {isLoading && <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
