import { Observer } from "@packages/design-patterns";

type PublicUpdater<Func> = Func extends (state: any, ...args: infer Args) => any
  ? (...args: Args) => void
  : () => void;

type StateManagementArgs<
  T extends Record<string, unknown>,
  S extends Record<string, (state: T, ...args: any[]) => Partial<T>>,
> = {
  initialState: T;
  stateUpdates?: S;
};

export const stateManagement = <
  T extends Record<string, unknown>,
  S extends Record<string, (state: T, ...args: any[]) => Partial<T>>,
>({
  initialState,
  stateUpdates,
}: StateManagementArgs<T, S>) => {
  const observer = new Observer<T>(initialState);

  const updateCallbacks = {} as { [K in keyof S]: PublicUpdater<S[K]> };

  const callbacks = (stateUpdates ?? {}) as S;

  for (const callback in callbacks) {
    const typedCallback = callback as keyof S;
    updateCallbacks[typedCallback] = ((arg?: any) => {
      const state = observer.getState();
      const originalFn = callbacks[typedCallback];
      if (typeof originalFn === "function") {
        if (arg !== undefined) {
          observer.setState(originalFn(state, arg));
        } else {
          observer.setState(originalFn(state));
        }
      }
    }) as any;
  }

  return {
    fullSubscribe: (data: (args: T) => void) =>
      observer.subscribe({ full: true, callback: data, initial: true }),
    subscribe: observer.subscribe,
    getData: observer.getState,
    stateUpdates: updateCallbacks,
  };
};
