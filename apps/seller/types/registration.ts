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

export interface SellerFormData {
  shopName: string;
  description: string;
  email: string;
  phoneNumber: string;
  avatarUrl: File | null | string;
  background: File | null | string;
  addressLine: string;
  district: string;
  ward: string;
  state: string;
  identityNumber: string;
  identityFrontImage: File | null;
  identityBackImage: File | null;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface RegistrationStep {
  id: number;
  title: string;
  description: string;
  component: string;
}

export interface RegistrationState {
  currentStep: number;
  formData: SellerFormData;
  errors: ValidationErrors;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  loading: boolean;
  provinces: Province[];
  districts: District[];
  wards: Ward[];
}

export const defaultFormData: SellerFormData = {
  shopName: '',
  description: '',
  email: '',
  phoneNumber: '',
  avatarUrl: null,
  background: null,
  addressLine: '',
  district: '',
  ward: '',
  state: '',
  identityNumber: '',
  identityFrontImage: null,
  identityBackImage: null,
};

export const registrationSteps: RegistrationStep[] = [
  {
    id: 1,
    title: 'Thông tin seller',
    description: 'Tên seller và mô tả',
    component: 'ShopInfoStep',
  },
  { id: 2, title: 'Địa chỉ', description: 'Vị trí cửa hàng', component: 'AddressStep' },
  { id: 3, title: 'Giấy tờ', description: 'CMND/CCCD', component: 'IdentityInfoStep' },
  { id: 4, title: 'Hoàn tất', description: 'Xác nhận thông tin', component: 'ConfirmationStep' },
];
