export const TOKEN_COOKIE = "token";
export const ADMIN_COOKIE = "admin_user";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export type AdminUser = {
  id: string;
  fullName: string;
  email: string;
};
