type Listener<T> = (value: T) => void;
type PartialState<T> = Partial<T> | ((state: T) => Partial<T>);

export class Observer<T extends Record<string, unknown>> {
  private state: T;
  private listeners: { [K in keyof T]?: Listener<T[K]>[] } = {};
  private fullListeners: Listener<T>[] = [];

  constructor(initialState: T) {
    this.state = initialState;
  }

  getState = (): T => this.state;

  setState = (partialState: PartialState<T>) => {
    const prevState = { ...this.state };
    const newState = typeof partialState === "function" ? partialState(this.state) : partialState;

    this.state = { ...this.state, ...newState };

    (Object.keys(newState) as (keyof T)[]).forEach((key) => {
      if (this.state[key] !== prevState[key] && this.listeners[key]) {
        this.listeners[key]?.forEach((listener) => listener(this.state[key]));
      }
    });

    // TODO: Add deep check to ensure the object changed.
    this.fullListeners.forEach((listener) => listener(this.state));
  };

  subscribe = <K extends keyof T>({
    properties = [],
    listener,
    initial,
  }: (
    | { properties: K[]; listener: Listener<T[K]> }
    | { properties?: never; listener: Listener<T> }
  ) & { initial?: boolean }) => {
    if (properties.length === 0) {
      this.fullListeners.push(listener as Listener<T>);
      if (initial) {
        (listener as Listener<T>)(this.state);
      }
    } else {
      properties.forEach((property) => {
        if (!this.listeners[property]) {
          this.listeners[property] = [];
        }
        this.listeners[property]?.push(listener as Listener<T[K]>);
      });

      if (initial) {
        properties.forEach((property) => {
          (listener as Listener<T[K]>)(this.state[property]);
        });
      }
    }

    return () => {
      if (properties.length === 0) {
        this.fullListeners.filter((l) => l !== listener);
      } else {
        properties.forEach((property) => {
          this.listeners[property] = this.listeners[property]?.filter((l) => l !== listener);
        });
      }
    };
  };
}
