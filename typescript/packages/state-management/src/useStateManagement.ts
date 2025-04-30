import { useRef, useSyncExternalStore } from "react";
import { shallowObjectsEqual } from "@packages/object-utils";

type UseStateManagementArgs<T extends Record<string, unknown>, D> = {
  fullSubscribe: (listener: () => void) => () => void;
  getData: () => T;
  selector: (state: T) => D;
};

// TODO: Add another way to sync with the state management through a simple state callback.

export const useStateManagement = <T extends Record<string, unknown>, D>({
  fullSubscribe,
  getData,
  selector,
}: UseStateManagementArgs<T, D>) => {
  return useSyncExternalStore(
    fullSubscribe,
    () => selector(getData()),
    () => selector(getData()),
  );
};

export const useComplexStateManagement = <T extends Record<string, unknown>, D>({
  fullSubscribe,
  getData,
  selector,
}: UseStateManagementArgs<T, D>) => {
  const previous = useRef<D>(undefined);

  return useSyncExternalStore(
    fullSubscribe,
    () => {
      const newSelected = selector(getData());
      if (shallowObjectsEqual({ objA: newSelected, objB: previous.current })) {
        return previous.current as D;
      }

      previous.current = newSelected;
      return newSelected;
    },
    () => selector(getData()),
  );
};
