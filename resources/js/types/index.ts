import { User } from '@/pages/Users/types';
import { PageProps as InertiaPageProps } from '@inertiajs/core';

export interface PageProps extends InertiaPageProps {
  auth: {
    user: User | null;
  };
  flash: {
    success: string | null;
    error: string | null;
  };
  appName: string;
  [key: string]: unknown;
}
