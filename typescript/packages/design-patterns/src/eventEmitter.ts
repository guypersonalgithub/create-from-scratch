import { generateSecureRandomString } from "@packages/randomizer";

type GetIDCallbacksArgs<T extends string[]> = {
  event: T[number];
};

type SubscribeArgs<T extends string[]> = {
  event: T[number];
  callback: () => void;
};

type EmitArgs<T extends string[]> = {
  event: T[number];
};

export class EventEmitter<T extends string[]> {
  private listeners = new Map<T[number], { id: string; callback: Function }[]>();

  private getIDCallbacks = ({ event }: GetIDCallbacksArgs<T>) =>
    this.listeners.get(event)?.slice() || [];

  on({ event, callback }: SubscribeArgs<T>) {
    const id = generateSecureRandomString();
    const idCallbacks = this.getIDCallbacks({ event });
    idCallbacks.push({ id, callback });
    this.listeners.set(event, idCallbacks);

    return () => {
      const clone = idCallbacks.slice();
      this.listeners.set(
        event,
        clone.filter((listener) => listener.id !== id),
      );
    };
  }

  emit({ event }: EmitArgs<T>) {
    const idCallbacks = this.getIDCallbacks({ event });
    idCallbacks.forEach((listener) => listener.callback());
  }
}
