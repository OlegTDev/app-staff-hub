export type Sanatorium = {
  id: number;
  name: string;
  city: string;
  address?: string;
  infrastructure: string[];
  services: string[];
  medical_profiles: string[];
  description?: string;
  created_at: string;
  updated_at: string;
}

export type SanatoriumLabels = {
  id: string;
  name: string;
  city: string;
  address: string;
  infrastructure: string;
  services: string;
  medical_profiles: string;
  description: string;
  created_at: string;
  updated_at: string;
}
