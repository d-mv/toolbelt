const ORDINALS = {
  one: 'st',
  two: 'nd',
  few: 'rd',
  many: 'th',
  zero: 'th',
  other: 'th',
};

export function makeOrdinalNumStr(number: number) {
  const formatter = new Intl.PluralRules('en-US', { type: 'ordinal' });

  return `${number}${ORDINALS[formatter.select(number)]}`;
}
