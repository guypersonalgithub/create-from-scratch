import { type Dispatch, type SetStateAction, useEffect } from "react";
import { type ExtendedActionTypeRegistry, type PseudoActionData } from "../types";
import { fetchManagement } from "../observer";

type UseActionStateUpdaterArgs<K extends keyof ExtendedActionTypeRegistry> = {
  id: K;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setIsError: Dispatch<SetStateAction<boolean>>;
};

export const useActionStateUpdater = <K extends keyof ExtendedActionTypeRegistry>({
  id,
  setIsLoading,
  setIsError,
}: UseActionStateUpdaterArgs<K>) => {
  useEffect(() => {
    const unsubscribe = fetchManagement.actions.subscribe({
      callback: (value) => {
        const { isLoading, isError } = (value?.[id] ?? {}) as PseudoActionData<K>;

        setIsLoading(isLoading ?? false);
        setIsError(isError ?? false);
      },
      properties: [id],
      full: false,
      initial: true,
    });

    return () => {
      unsubscribe();
    };
  }, [id]);
};
