import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/en'; // load on demand

dayjs.extend(relativeTime);
dayjs.locale('en');

export const relativeDate = (date: Date) => dayjs(date).fromNow();

export function monthYearToDate([month, year]: [number, number]): Date {
  return new Date(year, month - 1, 1);
}
