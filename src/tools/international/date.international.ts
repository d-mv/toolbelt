export function monthYearToDate([month, year]: [number, number]): Date {
	return new Date(year, month - 1, 1);
}
