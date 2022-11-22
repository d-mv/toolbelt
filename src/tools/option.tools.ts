export type Some<Payload = unknown> = { isSome: true; payload: Payload };

export type None = { isSome: false };

export type Option<Payload = unknown> = None | Some<Payload>;

export function option<Payload = unknown>(payload: unknown): Option<Payload> {
  if (option === null || option === undefined) return { isSome: false };

  return { isSome: true, payload: payload as Payload };
}
