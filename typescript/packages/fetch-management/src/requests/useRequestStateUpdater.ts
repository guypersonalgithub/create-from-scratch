import { type Dispatch, type SetStateAction, useEffect } from "react";
import { type ExtendedRequestTypeRegistry, type ExtractedData, type PseudoData } from "../types";
import { fetchManagement } from "../observer";

type UseRequestStateUpdaterArgs<K extends keyof ExtendedRequestTypeRegistry> = {
  id: K;
  setData: Dispatch<SetStateAction<ExtractedData<K> | undefined>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setIsError: Dispatch<SetStateAction<boolean>>;
};

export const useRequestStateUpdater = <K extends keyof ExtendedRequestTypeRegistry>({
  id,
  setData,
  setIsLoading,
  setIsError,
}: UseRequestStateUpdaterArgs<K>) => {
  useEffect(() => {
    const unsubscribe = fetchManagement.requests.subscribe({
      callback: (value) => {
        const { data, isLoading, isError } = (value?.[id] ?? {}) as PseudoData<K>;

        setData(data);
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
