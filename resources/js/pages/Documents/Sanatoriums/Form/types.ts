import { Relative } from "../types";

export type FormEmployeeFields = {
  user_name?: string;
  user_department?: string;
  user_position?: string;
  user_place?: string;
  user_telephone_inner?: string;
  user_telephone_outer?: string;
  user_relatives: Relative[];
};

export type FormSanatoriumFields = {
  sanatorium_id?: number;
  sanatoriumsAdditional: number[];
  any_date_during_vacation: boolean;
  arrival_date_from?: string;
  arrival_date_to?: string;
};

export type FormVacationsFields = {
  vacation_start?: string;
  vacation_end?: string;
};

export type FormFields = FormEmployeeFields &
  FormSanatoriumFields &
  FormVacationsFields & {
    app_date?: string;
    agree: boolean;
  };

export type FormErrors<T> = Partial<Record<keyof T, string>>;
export type FormSetData<T> = <K extends keyof T>(key: K, value: T[K]) => void;
