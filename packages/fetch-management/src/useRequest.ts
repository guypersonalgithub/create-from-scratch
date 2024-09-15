import { useEffect, useRef } from "react";
import { sendAbortableRequest, SendAbortableRequestArgs } from "@packages/request";
import { fetchManagement } from "./observer";
import {
  ExpiredAfter,
  ExtendedRequestTypeRegistry,
  ExtractedCallbackArg,
  ExtractedData,
  ExtractedCallback,
  PseudoData,
} from "./types";
import "./types";
import { activateRequest } from "./activateRequest";
import { useShouldFetch } from "./useShouldFetch";

// TODO: Consider adding data, isLoading and isError with useRefs.

export type UseRequestArgs<K extends keyof ExtendedRequestTypeRegistry> = {
  id: K;
  callback?: ({
    data,
    isLoading,
    isError,
  }: {
    data?: ExtractedData<K>;
    isLoading?: boolean;
    isError?: boolean;
  }) => void;
};

export const useRequest = <K extends keyof ExtendedRequestTypeRegistry>({
  id,
  callback,
}: UseRequestArgs<K>) => {
  const abortRef = useRef<ReturnType<typeof sendAbortableRequest>["abort"]>();

  useEffect(() => {
    const unsubscribe = fetchManagement.subscribe({
      callback: (value) => {
        const { data, isLoading, isError } = (value?.[id] ?? {}) as PseudoData<K>;
        callback?.({ data, isLoading, isError });
      },
      properties: [id],
      full: false,
      initial: true,
    });

    return () => {
      unsubscribe();
    };
  }, [id]);

  const fetchData = async ({
    expiredAfter,
    callback,
    ...args
  }: {
    expiredAfter?: ExpiredAfter;
    callback: ExtractedCallback<K>;
  } & Omit<SendAbortableRequestArgs<ExtractedCallbackArg<K>>, "fallback">) => {
    const shouldFetch = useShouldFetch({ id, ...args });
    if (!shouldFetch) {
      return;
    }

    activateRequest({ id, expiredAfter, callback, abortRef, ...args });
  };

  return {
    fetchData,
  };
};
