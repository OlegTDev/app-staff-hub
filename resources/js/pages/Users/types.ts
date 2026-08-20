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
  created_at?: string | null;
  updated_at?: string | null;
}
