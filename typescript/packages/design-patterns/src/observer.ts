import { areObjectsEqual } from "@packages/object-utils";
import { generateSecureRandomString } from "@packages/randomizer";

type Listener<T> = (value: T) => void;
type PartialState<T> = Partial<T> | ((state: T) => Partial<T>);

interface ListenerConfig<T, K extends keyof T, F extends boolean> {
  id: string;
  properties?: K[]; // Null or empty array indicates a full state listener
  full: F; // If true, callback receives the entire state `T`, otherwise receives partial state
  callback: Listener<
    K extends keyof T
      ? F extends true
        ? T
        : K[] extends [] | undefined
          ? T
          : Partial<Pick<T, K>>
      : T
  >;
}

export class Observer<T extends Record<string, unknown>> {
  private state: T;
  private listeners: ListenerConfig<T, keyof T, boolean>[] = [];

  constructor(initialState: T) {
    this.state = initialState;
  }

  getState = (): T => this.state;

  setState = (partialState: PartialState<T>) => {
    const prevState = { ...this.state };
    const newState = typeof partialState === "function" ? partialState(this.state) : partialState;

    const changed = new Set<keyof T>();
    for (const property in newState) {
      const newValue = newState[property];
      const oldValue = prevState[property];

      const areEqual = areObjectsEqual({ obj1: oldValue, obj2: newValue });
      if (!areEqual) {
        changed.add(property);
      }
    }

    this.state = { ...this.state, ...newState };

    if (changed.size > 0) {
      this.listeners.forEach(({ properties, full, callback }) => {
        if (!properties || properties.length === 0 || full) {
          (callback as Listener<T>)(this.state);
        } else {
          const wasListenedPropertyChanged = !!properties.find((key) => changed.has(key));

          if (wasListenedPropertyChanged) {
            const partialUpdate = Object.fromEntries(
              properties.map((key) => [key, this.state[key]]),
            ) as Partial<Pick<T, keyof T>>;
            (callback as Listener<Partial<Pick<T, keyof T>>>)(partialUpdate);
          }
        }
      });
    }
  };

  subscribe = <K extends keyof T, F extends boolean = false>({
    properties,
    full = false as F,
    callback,
    initial,
  }: Omit<ListenerConfig<T, K, F>, "id"> & {
    initial?: boolean;
  }) => {
    const id = generateSecureRandomString();
    const config: ListenerConfig<T, K, F> = {
      id,
      properties,
      full,
      callback,
    };

    this.listeners.push(config as ListenerConfig<T, keyof T, boolean>);

    if (initial) {
      if (!properties || properties.length === 0 || full) {
        (callback as Listener<T>)(this.state);
      } else {
        const initialValues = Object.fromEntries(
          properties.map((property) => [property, this.state[property]]),
        ) as Partial<Pick<T, K>>;
        (callback as Listener<Partial<Pick<T, K>>>)(initialValues);
      }
    }

    return () => {
      this.listeners = this.listeners.filter((listener) => listener.id !== id);
    };
  };
}
