type Listener<T> = (value: T) => void;
type PartialState<T> = Partial<T> | ((state: T) => Partial<T>);

export class Observer<T extends Record<string, unknown>> {
  private state: T;
  private listeners: { [K in keyof T]?: Listener<T[K]>[] } = {};

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
  };

  subscribe = <K extends keyof T>(properties: K[], listener: Listener<T[K]>) => {
    properties.forEach((property) => {
      if (!this.listeners[property]) {
        this.listeners[property] = [];
      }
      this.listeners[property]?.push(listener);
    });

    return () => {
      properties.forEach((property) => {
        this.listeners[property] = this.listeners[property]?.filter((l) => l !== listener);
      });
    };
  };
}
