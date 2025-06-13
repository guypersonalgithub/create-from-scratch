import { useRef, useState } from "react";
import { type sendAbortableRequest, type SendAbortableRequestArgs } from "@packages/request";
import { fetchManagement } from "../observer";
import {
  type ExpiredAfter,
  type ExtendedRequestTypeRegistry,
  type ExtractedCallbackArg,
  type ExtractedData,
  type ExtractedCallback,
  type PseudoData,
} from "../types";
import { useRequestStateUpdater } from "./useRequestStateUpdater";
import { activateRequest } from "./activateRequest";
import { useShouldFetch } from "./useShouldFetch";
import { dictateIsLoadingInitially, shouldAvoidSendingRequest } from "../utils";

type UseRequestStateArgs<K extends keyof ExtendedRequestTypeRegistry> = {
  id: K;
  disabled?: boolean;
};

type FetchDataArgs<K extends keyof ExtendedRequestTypeRegistry> = {
  expiredAfter?: ExpiredAfter;
  callback: ExtractedCallback<K>;
} & Omit<SendAbortableRequestArgs<ExtractedCallbackArg<K>>, "fallback">;

export const useRequestStateInner = <K extends keyof ExtendedRequestTypeRegistry>({
  id,
  disabled,
}: UseRequestStateArgs<K>) => {
  const initialData = fetchManagement.requests.getState()?.[id] as PseudoData<K> | undefined;
  const [data, setData] = useState<ExtractedData<K> | undefined>(initialData?.data);
  const [isLoading, setIsLoading] = useState(dictateIsLoadingInitially({ initialData, disabled }));
  const [isError, setIsError] = useState(initialData?.isError ?? false);
  const abortRef = useRef<ReturnType<typeof sendAbortableRequest>["abort"]>();
  const amountOfAttemptsForCurrentRequest = useRef(0);

  const fetchData = async ({ expiredAfter, callback, ...args }: FetchDataArgs<K>) => {
    const shouldFetch = useShouldFetch({ id, ...args });
    const { shouldAvoid, attempts } = shouldAvoidSendingRequest({
      id,
      attempts: amountOfAttemptsForCurrentRequest.current,
      ...args,
    });

    amountOfAttemptsForCurrentRequest.current = attempts;

    if (!shouldFetch || shouldAvoid) {
      return;
    }

    activateRequest({
      id,
      expiredAfter,
      callback,
      abortRef,
      amountOfAttemptsForCurrentRequest,
      ...args,
    });
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
