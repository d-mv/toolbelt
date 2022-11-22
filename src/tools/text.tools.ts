import { path } from 'ramda';

import { RecordObject } from '../types';

function buildPath(sectionOrPath: string | string[], keyOrPath: string | string[]) {
  const pathToValue = typeof sectionOrPath === 'string' ? [sectionOrPath] : sectionOrPath;

  return typeof keyOrPath === 'string' ? [...pathToValue, keyOrPath] : [...pathToValue, ...keyOrPath];
}

export function setupText(textData: RecordObject) {
  return function setSection(sectionOrPath: string | string[]) {
    return function get(keyOrPath: string | string[]) {
      return (path(buildPath(sectionOrPath, keyOrPath), textData) as string) ?? '';
    };
  };
}
