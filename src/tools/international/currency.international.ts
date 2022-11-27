import currencyToSymbolMap from 'currency-symbol-map/map';
import { findFlagUrlByCountryName } from 'country-flags-svg';
import currencyCodes from 'currency-codes';

import { makeMatch } from '../object.tools';
import { Optional } from '../../types';

export interface CurrencyItem {
  id: string;
  symbol: string;
  label: string;
  name: string;
  flag?: string;
}

let currencies: CurrencyItem[] = [];

export function makeCurrencyList() {
  const MATCH_MISSING_FLAG_URL = makeMatch(
    {
      AED: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Flag_of_the_United_Arab_Emirates.svg',
      EUR: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Flag_of_Europe.svg',
      USD: 'https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg',
    },
    '',
  );

  Object.keys(currencyToSymbolMap).forEach(currencyKey => {
    // add all available data
    let tempResult: CurrencyItem = {
      id: currencyKey,
      symbol: currencyToSymbolMap[currencyKey],
      name: currencyCodes.code(currencyKey)?.currency ?? '',
      label: `${currencyKey} ${currencyToSymbolMap[currencyKey]} ${currencyCodes.code(currencyKey)?.currency ?? ''}`,
    };

    // find country
    const country = currencyCodes.code(currencyKey)?.countries[0];

    try {
      // if we have predefined flags -> use them
      // eslint-disable-next-line no-prototype-builtins
      if (MATCH_MISSING_FLAG_URL.hasOwnProperty(currencyKey))
        tempResult = { ...tempResult, flag: MATCH_MISSING_FLAG_URL[currencyKey] };
      else tempResult = { ...tempResult, flag: findFlagUrlByCountryName(country) };
    } catch {
      // just ignore
    }

    currencies = [...currencies, tempResult];
  });
}

export function getCurrencyList() {
  return currencies;
}

export function findCurrencyItemByValue(value: Optional<string>) {
  if (!value) return;

  return currencies.find(currency => currency.label === value);
}

export function getCurrencySymbolById(id: string) {
  return currencies.find(currency => currency.id === id)?.symbol ?? '$';
}
