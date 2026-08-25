import dayjs, { ConfigType } from "dayjs";
import 'dayjs/locale/ru';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
dayjs.locale('ru');

export const formatDate = (date: ConfigType, formatStr: string = 'D MMMM YYYY'): string => {
  if (!date) return '';
  return dayjs(date).format(formatStr);
};

export const formatRelative = (date: ConfigType): string => {
  if (!date) return '';
  return dayjs(date).fromNow();
};

export const isPast = (date: ConfigType): boolean => {
  if (!date) return false;
  return dayjs(date).isBefore(dayjs());
};

