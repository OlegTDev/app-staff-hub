
export interface Role {
  id: number;
  name: string;
  description: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  login: string;
  company?: string;
  department?: string;
  position?: string;
  domain: string;
  telephone?: string;
  created_at: string;
  updated_at: string;

  roles: Role[];
}

export type UserLabels = {
  id: string;
  name: string;
  email: string;
  login: string;
  company: string;
  department: string;
  position: string;
  telephone: string;
  domain: string;
  created_at: string;
  updated_at: string;
  roles: string;
}
