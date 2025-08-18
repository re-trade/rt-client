export const SELLER_APP_URL = process.env.NEXT_PUBLIC_SELLER_PORTAL_URL || 'http://localhost:3001';

export const SELLER_ROUTES = {
  REGISTER: `${SELLER_APP_URL}/register`,
  DASHBOARD: `${SELLER_APP_URL}/dashboard`,
} as const;
