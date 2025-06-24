'use client';
import { useCallback, useState } from 'react';

export interface UseSecurityFormOptions<T> {
  initialValues: T;
  onSubmit: (values: T) => Promise<boolean>;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
}

export function useSecurityForm<T>({
  initialValues,
  onSubmit,
  onSuccess,
  onError,
  validate,
}: UseSecurityFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = useCallback(
    (field: keyof T, value: unknown) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [errors],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      handleChange(name as keyof T, value);
    },
    [handleChange],
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsSuccess(false);
    setFormError(null);
  }, [initialValues]);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      setFormError(null);

      if (validate) {
        const validationErrors = validate(values);
        const hasErrors = Object.keys(validationErrors).length > 0;

        if (hasErrors) {
          setErrors(validationErrors);
          return false;
        }
      }

      setIsSubmitting(true);

      try {
        const result = await onSubmit(values);

        if (result) {
          setIsSuccess(true);
          if (onSuccess) {
            onSuccess();
          }
        }

        return result;
      } catch (error) {
        setFormError(error instanceof Error ? error.message : 'An error occurred');
        if (onError) {
          onError(error);
        }
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validate, onSubmit, onSuccess, onError],
  );

  return {
    values,
    errors,
    isSubmitting,
    isSuccess,
    formError,
    handleChange,
    handleInputChange,
    handleSubmit,
    resetForm,
    setValues,
  };
}
