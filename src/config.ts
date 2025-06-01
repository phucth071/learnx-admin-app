import { getSiteURL } from '@/lib/get-site-url';
import { LogLevel } from '@/lib/logger';

export interface Config {
  site: { name: string; description: string; themeColor: string; url: string; logo: string };
  logLevel: keyof typeof LogLevel;
}

export const config: Config = {
  site: {
    name: 'Learn-X', // Update the site name here
    description: '',
    themeColor: '#090a0b',
    url: getSiteURL(),
    logo: './assets/utez-logo-emblem.svg' // Update the path to the new logo here
  },
  logLevel: (process.env.NEXT_PUBLIC_LOG_LEVEL as keyof typeof LogLevel) ?? LogLevel.ALL,
};
