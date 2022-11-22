import { path } from 'ramda';

export interface GetMessageFromErrorOptions {
  defMessage: string;
}

export function getMessageFromError(err: unknown, options?: Partial<GetMessageFromErrorOptions>): string {
  const defaultReturn = (isIncorrect = false) =>
    options?.defMessage ?? isIncorrect ? 'Incorrect error object' : 'Unknown error';

  if (!err) return defaultReturn();

  if (typeof err !== 'object') return defaultReturn(true);

  if (!('message' in err) && !('data' in err) && 'errors' in err) return defaultReturn(true);

  const result =
    path(['data', 'errors'], err) ??
    path(['errors'], err) ??
    path(['data', 'message'], err) ??
    path(['response', 'data', 'message'], err) ??
    path(['response', 'data', 'errors'], err) ??
    path(['response', 'data', 'error'], err) ??
    path(['response', 'errors'], err) ??
    path(['message'], err) ??
    defaultReturn();

  if (Array.isArray(result)) return result.join('; ');

  if (typeof result === 'string') return result;

  return String(result);
}
