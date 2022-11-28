import { BehaviorSubject, Observable, distinctUntilKeyChanged, pluck, Subscription } from 'rxjs';
import { AnyValue } from '../types';

import { logger } from './log.tools';

export interface ActionWithPayload<StateActions, Payload = unknown> {
  type: StateActions;
  payload: Payload;
}

export interface ActionWithoutPayload<StateActions> {
  type: StateActions;
}

export type Action<StateActions, Payload = void> = Payload extends void
  ? ActionWithoutPayload<StateActions>
  : ActionWithPayload<StateActions, Payload>;

export type ReducerFn<S, StateActions, Payload = AnyValue> =
  | ((state: S, action: ActionWithPayload<StateActions, Payload>) => S)
  | ((state: S, action: ActionWithoutPayload<StateActions>) => S);

export interface CreateStoreOptions {
  label: string;
  isSilent: boolean;
}

class Store<S, StateActions> {
  #state: BehaviorSubject<S>;

  #reducerFns: Map<StateActions, ReducerFn<S, StateActions>>;

  #options: Partial<CreateStoreOptions>;

  constructor(
    reducerFns: Map<StateActions, ReducerFn<S, StateActions>>,
    initialState: S,
    options?: Partial<CreateStoreOptions>,
  ) {
    this.#state = new BehaviorSubject(initialState);
    this.#reducerFns = reducerFns;
    this.#options = options ?? {};
  }

  #logger(message: string) {
    if (this.#options.isSilent) return;

    const makeLabel = () => `${this.#options.label} >> `;

    logger.info(`${this.#options?.label ? makeLabel() : ''}${message}`);
  }

  #reducer(state: S, action: Action<StateActions, unknown>) {
    this.#logger(`[${action.type}]`);

    const fn = this.#reducerFns.get(action.type);

    if (fn) return fn(state, action);

    return state;
  }

  select<K extends keyof S>(key: K): Observable<S[K]> {
    return this.#state.pipe(distinctUntilKeyChanged(key), pluck(key));
  }

  subscribe(callback: (state: S) => void): Subscription {
    return this.#state.subscribe(callback);
  }

  dispatch = <Payload = void>(action: Action<Payload>): void => {
    const oldState = this.#state.getValue();

    // use of AnyValue because TS can't decide what type of reducer is
    // needed to be used here
    const newState = this.#reducer(oldState, action as AnyValue);

    this.#state.next(newState);
  };

  asyncDispatch = async <Result>(_: StateActions, runner: (state: S) => Promise<Result>): Promise<void> => {
    const currentState = this.#state.getValue();

    const payload: Result = await runner(currentState);

    // @ts-ignore - temp
    const resultAction: ActionWithPayload<StateActions, Result> = { type: 'reset_state', payload };

    this.dispatch(resultAction);
  };

  get value() {
    return this.#state.value;
  }

  resetStore() {
    this.dispatch({ type: 'reset_store' });
  }
}

/**
 * Create reactive store
 * @param {Map} reducerFns Map object of reducer functions
 * @param {Object} initialState can be {} for empty or Record<string, unknown> for custom
 * @param {CreateStoreOptions} [options]
 * @returns {Store<State,StateActions>} store ready to use
 * @example
 * ```typescript
 *
 * enum StateActions {
 *   ADD_ONE = 'add_one',
 *   RESET_STORE = 'reset_store',
 * }
 *
 * const MAP = new Map<StateActions, ReducerFn<State, StateActions>>();
 *
 * MAP.set(StateActions.RESET_STORE, () => ({}));
 *
 * MAP.set(StateActions.ADD_ONE, (state: State, action:
 * ActionWithPayload<StateActions, Flag>) =>
 *  assoc(action.payload.flagId, action.payload.value, state),
 * );
 *
 * const store = createStore(MAP, {}, { label: 'FLAGS_STORE', isSilent: true });
 *
 * // to send whole store on WS connection
 * store.subscribe(() => socket.emit('flags', store.value));
 *
 * // restore from DB on startup
 * export async function reStore(): PromisedResult<boolean> {
 *  const storeFromDb = await DbFlag.find({});
 *
 *  const newStore = reduce((acc, elem) => append(elem, acc), [] as Flags, storeFromDb);
 *
 *  store.dispatch(updateSetOfFlags(newStore));
 *  return success(true);
 * }
 *
 * // function to wrap getting item from store
 * export function getFlagByIdController(flagId: string) {
 *  if (!(flagId in store.value)) return failure('FlagId provided is not available');
 *
 *  return success(store.select(flagId));
 * }
 * ```
 */
export function createStore<S, StateActions>(
  reducerFns: Map<StateActions, ReducerFn<S, StateActions>>,
  initialState: S,
  options?: Partial<CreateStoreOptions>,
) {
  return new Store<S, StateActions>(reducerFns, initialState, options);
}
