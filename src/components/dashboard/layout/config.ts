import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  {
    key: 'accounts',
    title: 'Quản lý tài khoản',
    href: paths.dashboard.accounts,
    icon: 'users',
  },
  {
    key: 'permissions',
    title: 'Quản lý cấp quyền',
    href: paths.dashboard.permissions,
    icon: 'users',
  },
  {
    key: 'profile',
    title: 'Hồ sơ',
    href: paths.dashboard.profile,
    icon: 'user',
  }
] satisfies NavItemConfig[];