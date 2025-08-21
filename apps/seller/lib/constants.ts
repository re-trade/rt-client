export const CUSTOMER_APP_URL =
  process.env.NEXT_PUBLIC_CUSTOMER_PORTAL_URL || 'http://localhost:3000';

export const CUSTOMER_ROUTES = {
  HOME: `${CUSTOMER_APP_URL}`,
  PRODUCTS: `${CUSTOMER_APP_URL}/product`,
  USER_PROFILE: `${CUSTOMER_APP_URL}/user`,
} as const;
