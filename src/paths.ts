export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    accounts: '/dashboard/accounts',
    permissions: '/dashboard/permissions', 
    profile: '/dashboard/profile'
  },
  errors: { notFound: '/errors/not-found' },
} as const;