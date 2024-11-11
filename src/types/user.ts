export interface User {
  fullName?: string;
  avatarUrl?: string;
  email?: string;
  role?: string;

  [key: string]: unknown;
}
