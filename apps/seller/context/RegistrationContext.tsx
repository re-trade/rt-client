'use client';

import {
  defaultFormData,
  District,
  Province,
  RegistrationState,
  SellerFormData,
  ValidationErrors,
  Ward,
} from '@/types/registration';
import { createContext, ReactNode, useContext, useMemo, useReducer } from 'react';

interface RegistrationContextType extends RegistrationState {
  setCurrentStep: (step: number) => void;
  updateFormData: (data: Partial<SellerFormData>) => void;
  updateField: (field: keyof SellerFormData, value: any) => void;
  setErrors: (errors: ValidationErrors) => void;
  setFieldError: (field: string, error: string) => void;
  clearFieldError: (field: string) => void;
  setTouched: (field: string, touched: boolean) => void;
  setIsSubmitting: (submitting: boolean) => void;
  setLoading: (loading: boolean) => void;
  setProvinces: (provinces: Province[]) => void;
  setDistricts: (districts: District[]) => void;
  setWards: (wards: Ward[]) => void;
  resetForm: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
}

type RegistrationAction =
  | { type: 'SET_CURRENT_STEP'; payload: number }
  | { type: 'UPDATE_FORM_DATA'; payload: Partial<SellerFormData> }
  | { type: 'UPDATE_FIELD'; payload: { field: keyof SellerFormData; value: any } }
  | { type: 'SET_ERRORS'; payload: ValidationErrors }
  | { type: 'SET_FIELD_ERROR'; payload: { field: string; error: string } }
  | { type: 'CLEAR_FIELD_ERROR'; payload: string }
  | { type: 'SET_TOUCHED'; payload: { field: string; touched: boolean } }
  | { type: 'SET_IS_SUBMITTING'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_PROVINCES'; payload: Province[] }
  | { type: 'SET_DISTRICTS'; payload: District[] }
  | { type: 'SET_WARDS'; payload: Ward[] }
  | { type: 'RESET_FORM' }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'GO_TO_STEP'; payload: number };

const initialState: RegistrationState = {
  currentStep: 1,
  formData: defaultFormData,
  errors: {},
  touched: {},
  isSubmitting: false,
  loading: false,
  provinces: [],
  districts: [],
  wards: [],
};

function registrationReducer(
  state: RegistrationState,
  action: RegistrationAction,
): RegistrationState {
  switch (action.type) {
    case 'SET_CURRENT_STEP':
      return { ...state, currentStep: action.payload };

    case 'UPDATE_FORM_DATA':
      return { ...state, formData: { ...state.formData, ...action.payload } };

    case 'UPDATE_FIELD':
      return {
        ...state,
        formData: { ...state.formData, [action.payload.field]: action.payload.value },
      };

    case 'SET_ERRORS':
      return { ...state, errors: action.payload };

    case 'SET_FIELD_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.payload.field]: action.payload.error },
      };

    case 'CLEAR_FIELD_ERROR':
      const { [action.payload]: _, ...remainingErrors } = state.errors;
      return { ...state, errors: remainingErrors };

    case 'SET_TOUCHED':
      return {
        ...state,
        touched: { ...state.touched, [action.payload.field]: action.payload.touched },
      };

    case 'SET_IS_SUBMITTING':
      return { ...state, isSubmitting: action.payload };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_PROVINCES':
      return { ...state, provinces: action.payload };

    case 'SET_DISTRICTS':
      return { ...state, districts: action.payload };

    case 'SET_WARDS':
      return { ...state, wards: action.payload };

    case 'RESET_FORM':
      return { ...initialState };

    case 'NEXT_STEP':
      return { ...state, currentStep: Math.min(state.currentStep + 1, 5) };

    case 'PREV_STEP':
      return { ...state, currentStep: Math.max(state.currentStep - 1, 1) };

    case 'GO_TO_STEP':
      return { ...state, currentStep: Math.max(1, Math.min(action.payload, 5)) };

    default:
      return state;
  }
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(registrationReducer, initialState);

  const contextValue: RegistrationContextType = useMemo(
    () => ({
      ...state,
      setCurrentStep: (step: number) => dispatch({ type: 'SET_CURRENT_STEP', payload: step }),
      updateFormData: (data: Partial<SellerFormData>) =>
        dispatch({ type: 'UPDATE_FORM_DATA', payload: data }),
      updateField: (field: keyof SellerFormData, value: any) =>
        dispatch({ type: 'UPDATE_FIELD', payload: { field, value } }),
      setErrors: (errors: ValidationErrors) => dispatch({ type: 'SET_ERRORS', payload: errors }),
      setFieldError: (field: string, error: string) =>
        dispatch({ type: 'SET_FIELD_ERROR', payload: { field, error } }),
      clearFieldError: (field: string) => dispatch({ type: 'CLEAR_FIELD_ERROR', payload: field }),
      setTouched: (field: string, touched: boolean) =>
        dispatch({ type: 'SET_TOUCHED', payload: { field, touched } }),
      setIsSubmitting: (submitting: boolean) =>
        dispatch({ type: 'SET_IS_SUBMITTING', payload: submitting }),
      setLoading: (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading }),
      setProvinces: (provinces: Province[]) =>
        dispatch({ type: 'SET_PROVINCES', payload: provinces }),
      setDistricts: (districts: District[]) =>
        dispatch({ type: 'SET_DISTRICTS', payload: districts }),
      setWards: (wards: Ward[]) => dispatch({ type: 'SET_WARDS', payload: wards }),
      resetForm: () => dispatch({ type: 'RESET_FORM' }),
      nextStep: () => dispatch({ type: 'NEXT_STEP' }),
      prevStep: () => dispatch({ type: 'PREV_STEP' }),
      goToStep: (step: number) => dispatch({ type: 'GO_TO_STEP', payload: step }),
    }),
    [state],
  );

  return (
    <RegistrationContext.Provider value={contextValue}>{children}</RegistrationContext.Provider>
  );
}

export function useRegistration() {
  const context = useContext(RegistrationContext);
  if (context === undefined) {
    throw new Error('useRegistration must be used within a RegistrationProvider');
  }
  return context;
}
