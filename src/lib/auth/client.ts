
import axios from '@/axios/axios';
import Cookies from 'js-cookie';
import { BaseResponse } from '@/types/baseResponse';
import { logger } from '@/lib/default-logger';
import { User } from '@/types/user';

export interface SignUpParams {
  fullName: string;
  email: string;
  password: string;
}

export interface SignInWithOAuthParams {
  provider: 'GOOGLE' | 'DATABASE';
}

export interface SignInWithPasswordParams {
  emailForm: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  fullName: string;
  email: string;
  avatar: string;
  role: string;
}

class AuthClient {
  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
    return { error: 'Social authentication not implemented' };
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ data?: User, error?: string }> {
    const { emailForm, password } = params;
    const routePath  = '/auth/authenticate';
    try {
      const response = await axios.post<BaseResponse<AuthResponse>>(routePath, { email: emailForm, password });
      const data = response.data.data;
      logger.debug('Sign in with password response: ', data);
      const { accessToken, refreshToken, fullName, email, avatar, role } = data;

      if (role !== 'ADMIN') {
        return { error: 'You have no permission to access this pages!' };
      }

      const user: User = {
        fullName,
        email,
        avatarUrl: avatar,
        role,
      };

      Cookies.set('access_token', accessToken);
      Cookies.set('refresh_token', refreshToken);
      localStorage.setItem('logged_user', JSON.stringify(user));
      logger.debug('User logged in: ', user);
      return { data: user };
    } catch (error) {
      logger.error('Sign in with password error: ', error);
      return { error: 'An unknown error occurred' };
    }
  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    const user = localStorage.getItem('logged_user');

    if (!user) {
      return { data: null };
    }

    return { data: JSON.parse(user) as User };
  }

  async signOut(): Promise<{ error?: string }> {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    localStorage.removeItem('logged_user');
    return {};
  }
}

export const authClient = new AuthClient();
