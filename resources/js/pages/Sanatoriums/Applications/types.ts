import { Sanatorium } from "@/pages/Dictionary/Sanatorium/types";

export interface Relative {
  id: string;
  type: string;
  name: string;
  birthdate?: string;
  description?: string;
};

export interface Application {
  id: number;
  sanatorium_id: number;
  app_date: string;
  user_name: string;
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
  status: string;
  create_at: string;
  updated_at: string;
  sanatoriumsAdditional: Sanatorium[];
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
  sanatorium: string;
} & RelativeValidationLabels;
