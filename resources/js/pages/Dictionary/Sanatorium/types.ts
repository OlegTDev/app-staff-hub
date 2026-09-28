export type SanatoriumPhoto = {
  id: number;
  type: string;
  photo_file: string;
  thumb_file: string;
};

export type Sanatorium = {
  id: number;
  name: string;
  city: string;
  address?: string;
  infrastructure: string[];
  services: string[];
  medical_profiles: string[];
  description?: string;
  photo_thumbnail?: string;
  created_at: string;
  updated_at: string;

  photos: SanatoriumPhoto[];
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
  photo_thumbnail: string;
  photos: string;
  created_at: string;
  updated_at: string;
}
