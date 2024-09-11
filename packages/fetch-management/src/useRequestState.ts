import { useRef, useState } from "react";
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
import { useRequestStateUpdater } from "./useRequestStateUpdater";
import { activateRequest } from "./activateRequest";
import { useShouldFetch } from "./useShouldFetch";

type UseRequestStateArgs<K extends keyof ExtendedRequestTypeRegistry> = {
  id: K;
};

export const useRequestStateInner = <K extends keyof ExtendedRequestTypeRegistry>({
  id,
}: UseRequestStateArgs<K>) => {
  const initialData = fetchManagement.getState()?.[id] as PseudoData<K> | undefined;
  const [data, setData] = useState<ExtractedData<K> | undefined>(initialData?.data);
  const [isLoading, setIsLoading] = useState(initialData?.isLoading ?? false);
  const [isError, setIsError] = useState(initialData?.isError ?? false);
  const abortRef = useRef<ReturnType<typeof sendAbortableRequest>["abort"]>();

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

  useRequestStateUpdater({ id, setData, setIsLoading, setIsError });

  return {
    data,
    setData,
    isLoading,
    setIsLoading,
    isError,
    setIsError,
    fetchData,
  };
};

export const useRequestState = <K extends keyof ExtendedRequestTypeRegistry>({
  id,
}: UseRequestStateArgs<K>) => {
  const { data, isLoading, isError, fetchData } = useRequestStateInner({ id });

  return {
    data,
    isLoading,
    isError,
    fetchData,
  };
};
