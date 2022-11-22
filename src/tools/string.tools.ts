export function capitalize(s: string): string {
  const split = s.split('');

  return `${split[0]?.toUpperCase()}${split.slice(-(split.length - 1)).join('')}`;
}

interface MakePluralOptions {
  customEnding: string;
  customPluralForm: string;
}

export function makePlural(s: string, qty: number, opts?: Partial<MakePluralOptions>): string {
  if (qty === 1) return s;

  if (opts?.customPluralForm) return opts.customPluralForm;

  if (opts?.customEnding) return `${s.slice(0, -1)}${opts.customEnding}`;

  return `${s}s`;
}
