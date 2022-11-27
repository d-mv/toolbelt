import dayjs, { Dayjs, extend, locale } from 'dayjs';
import relativeTimePlugin from 'dayjs/plugin/relativeTime';
import isBetweenPlugin from 'dayjs/plugin/isBetween';
import durationPlugin, { DurationUnitType } from 'dayjs/plugin/duration';
import 'dayjs/locale/en'; // load on demand
import { compose, map, sort } from 'ramda';

locale('en');
extend(relativeTimePlugin);
extend(durationPlugin);
extend(isBetweenPlugin);

export const relativeDate = (date: Date) => dayjs(date).fromNow();

export function monthYearToDate([month, year]: [number, number]): Date {
  return new Date(year, month - 1, 1);
}

export function duration(start: Dayjs, end: Dayjs): number {
  return end.diff(start, 'days', false);
}

export function isWeekend(date: Dayjs): boolean {
  return [5, 6].includes(date.day());
}

export function isBetween(day: Dayjs, start: Dayjs, end: Dayjs) {
  return day.isBetween(start, end, 'days');
}

export function add(nDays: number, item: DurationUnitType) {
  return function call(day: Dayjs) {
    return day.add(nDays, item);
  };
}

export function subtract(nDays: number, item: DurationUnitType) {
  return function call(day: Dayjs) {
    return day.subtract(nDays, item);
  };
}

export function sortDays(data: Date[], returnAsDayjs?: false): Date[];

export function sortDays(data: Date[], returnAsDayjs: true): Dayjs[];

export function sortDays(data: Date[], returnAsDayjs?: boolean): (Date | Dayjs)[] {
  const sorter = (a: Date, b: Date) => {
    return dayjs(a).diff(dayjs(b), 'days');
  };

  if (!returnAsDayjs) return sort(sorter, data);

  return compose(map(dayjs), sort(sorter))(data);
}
