import { ApplicationLabels } from "../types";
import { FormFields } from "./types";
import * as z from "zod";
import { ru } from 'zod/locales';

z.config(ru());

type setErrorInertia = (field: keyof FormFields, value: string) => void;

export const validate = (step: number, data: FormFields, setError: setErrorInertia, labels: ApplicationLabels): boolean => {
  switch (step) {
    case 0:
      return validateUserData(data, setError, labels);
    case 1:
      return validateToSendData(data, setError, labels);
    case 2:
      return validateVacationPeriodData(data, setError, labels);
    case 3:
      return validateSanatoriumData(data, setError, labels);
    default:
      return true;
  }
};

const requiredTextFieldMessage = (label: string) => `Поле "${label}" обязательно для заполнения`;

const validateZod = (schema: z.ZodType, data: FormFields, setError: setErrorInertia): boolean => {
  let result = true;
  const resultValidate = schema.safeParse(data);
  if (!resultValidate.success) {
    const zodError = resultValidate.error;
    zodError.issues.forEach((issue) => {
      const fieldPath = issue.path.join(".");
      setError(fieldPath as keyof FormFields, issue.message);
    });
    result = false;
  }
  return result;
};

// Валидация "Данные сотрудника"
const validateUserData = (data: FormFields, setError: setErrorInertia, labels: ApplicationLabels): boolean => {
  const userDataValidateRelativeSchema = z.object({
    type: z.string().min(1, requiredTextFieldMessage(labels['user_relatives.*.type'])),
    name: z.string().min(5, requiredTextFieldMessage(labels['user_relatives.*.name'])),
    birthdate: z.string().min(10, requiredTextFieldMessage(labels['user_relatives.*.birthdate'])),
    description: z.string().optional(),
  });
  const userDataValidateSchema = z.object({
    user_name: z.string().min(5, requiredTextFieldMessage(labels.user_name)),
    user_organization: z.string().min(2, requiredTextFieldMessage(labels.user_organization)),
    user_department: z.string().min(2, requiredTextFieldMessage(labels.user_department)),
    user_position: z.string().min(2, requiredTextFieldMessage(labels.user_position)),
    user_place: z.string().min(2, requiredTextFieldMessage(labels.user_place)),
    user_telephone_inner: z.string().min(2, requiredTextFieldMessage(labels.user_telephone_inner)),
    user_telephone_outer: z.string().min(2, requiredTextFieldMessage(labels.user_telephone_outer)),
    user_relatives: z.array(userDataValidateRelativeSchema).optional().default([]),
  });

  return validateZod(userDataValidateSchema, data, setError);
};

// Валидация "Куда направляется"
const validateToSendData = (data: FormFields, setError: setErrorInertia, labels: ApplicationLabels): boolean => {
  const validateSchema = z.object({
    to_organization: z.string().min(5, requiredTextFieldMessage(labels.to_organization)),
    to_manager_name: z.string().min(5, requiredTextFieldMessage(labels.to_manager_name)),
  });

  return validateZod(validateSchema, data, setError);
};

// Валидация "Период отпуска"
const validateVacationPeriodData = (data: FormFields, setError: setErrorInertia, labels: ApplicationLabels): boolean => {
  const validateSchema = z.object({
    vacation_start: z.string().min(10, requiredTextFieldMessage(labels.vacation_start)),
    vacation_end: z.string().min(10, requiredTextFieldMessage(labels.vacation_end)),
  });

  return validateZod(validateSchema, data, setError);
};

// Валидация "Санаторий"
const validateSanatoriumData = (data: FormFields, setError: setErrorInertia, labels: ApplicationLabels): boolean => {
  const validateSchema = z.object({
    sanatorium_id: z.number(requiredTextFieldMessage(labels.sanatorium)),
    any_date_during_vacation: z.boolean(),
    arrival_date_from: z.string().nullable().optional(),
    arrival_date_to: z.string().nullable().optional(),
  })
    .refine((data) => data.any_date_during_vacation || (data.arrival_date_from && data.arrival_date_from.trim() !== ''), {
      error: requiredTextFieldMessage(labels.arrival_date_from),
      path: ['arrival_date_from'],
    })
    .refine((data) => data.any_date_during_vacation || (data.arrival_date_to && data.arrival_date_to.trim() !== ''), {
      error: requiredTextFieldMessage(labels.arrival_date_to),
      path: ['arrival_date_to'],
    });

  return validateZod(validateSchema, data, setError);
};
