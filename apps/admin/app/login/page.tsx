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
import { loginInternal } from '@/services/auth.api';
import Joi from 'joi';
import { EyeIcon, EyeOffIcon, KeyIcon, LoaderIcon, UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

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
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<LoginForm>({
    username: '',
    password: '',
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

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

    setIsLoading(true);
    try {
      await loginInternal(formData);
      // Redirect to dashboard after successful login
      router.push('/dashboard');
    } catch (err) {
      setError('Tên đăng nhập hoặc mật khẩu không đúng');
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
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-500">{error}</div>
              )}
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg" type="submit" disabled={isLoading}>
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
