export function sample<T>(choices: T[]): T {
  const arrOfFractions: number[] = choices.map((_, i) => (1 / choices.length) * (i + 1));

  const random = Math.random();

  let resultIndex = 0;

  let fractionsIndex = 0;

  while (fractionsIndex < arrOfFractions.length) {
    if (random <= (arrOfFractions[fractionsIndex] ?? 0)) {
      resultIndex = fractionsIndex;
      break;
    }

    fractionsIndex += 1;
  }

  return choices[resultIndex] as T;
}
