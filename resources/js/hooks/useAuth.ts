import { Role, User } from "@/pages/Users/types";
import { PageProps } from "@/types";
import { usePage } from "@inertiajs/react";

interface UserAuthReturn {
  user: User | null;
  roles: string[];
  hasRole: (role: string) => boolean;
  isAdmin: boolean;
}

export function useAuth(): UserAuthReturn {
  const { auth } = usePage<PageProps>().props;

  const user = auth?.user;
  const roles = (auth?.user?.roles) ? auth.user.roles.map((role: Role) => role.name) : [];

  const hasRole = (role: string): boolean => {
    if (!user) return false;
    return roles.includes(role);
  };

  return {
    user,
    roles,
    hasRole,
    isAdmin: hasRole('admin'),
  };
}
