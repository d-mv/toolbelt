import { path } from 'ramda';

import { isNilOrEmpty } from './logic.tools';
import { logger } from './log.tools';

export function setupTxt(textObject: Record<string, unknown>) {
  return function txt(section: string[]) {
    const messageSection = path(section, textObject) as Record<string, string>;

    if (isNilOrEmpty(messageSection)) throw new Error('Missing errors templates');

    return function getMessage(message: string) {
      const result = path<string>([message], messageSection);

      if (!result) logger.warn(`Missing message at ${section.join('/')}/${message}`);

      return result ?? '';
    };
  };
}
