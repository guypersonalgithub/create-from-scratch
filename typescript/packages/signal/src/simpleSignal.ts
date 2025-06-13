type Subscriber<T> = (value: T) => void;

export class SimpleSignal<T> {
  private _value: T;
  private subscribers: Set<Subscriber<T>> = new Set();

  constructor(initialValue: T) {
    this._value = initialValue;
  }

  get value(): T {
    return this._value;
  }

  set value(newValue: T) {
    if (this._value !== newValue) {
      this._value = newValue;
      this.notify();
    }
  }

  subscribe(subscriber: Subscriber<T>): () => void {
    this.subscribers.add(subscriber);
    subscriber(this._value);

    return () => this.subscribers.delete(subscriber);
  }

  private notify() {
    for (const subscriber of this.subscribers) {
      subscriber(this._value);
    }
  }
}
