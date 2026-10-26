import { Sanatorium } from "@/pages/Dictionary/Sanatorium/types";

export interface Relative {
  id: string;
  type: string;
  name: string;
  birthdate?: string;
  description?: string;
};

export interface Document {
  id: number;
  user_id: number;
  status: string;
  is_author: boolean;
  created_at: string;
  updated_at: string;
};

export interface Application {
  id: number;
  can_edit: boolean;
  can_delete: boolean;
  sanatorium_id: number;
  to_organization: string;
  to_manager_name: string;
  app_date: string;
  user_name: string;
  user_organization: string;
  user_department: string;
  user_position: string;
  user_place: string;
  user_telephone_inner: string;
  user_telephone_outer: string;
  user_relatives: Relative[];
  vacation_start: string;
  vacation_end: string;
  any_date_during_vacation: boolean;
  arrival_date_from: string|undefined;
  arrival_date_to: string|undefined;
  create_at: string;
  updated_at: string;
  sanatorium: Sanatorium;
  sanatoriumsAdditional: Sanatorium[];
  document: Document;
}

type RelativeValidationLabels = {
  "user_relatives.*.type": string;
  "user_relatives.*.name": string;
  "user_relatives.*.birthdate": string;
  "user_relatives.*.description" :string;
};

export type ApplicationLabels = {
  [K in keyof Application]: string;
} & {
  status: string;
  user: string;
  sanatorium: string;
  sanatoriums: string;
  vacation_period: string;
  vacation_and_arrival_period: string;
} & RelativeValidationLabels;
