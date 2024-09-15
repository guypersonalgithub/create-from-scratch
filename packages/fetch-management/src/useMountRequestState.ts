import { useEffect, useRef } from "react";
import { sendAbortableRequest, SendAbortableRequestArgs } from "@packages/request";
import { fetchManagement } from "./observer";
import {
  ExpiredAfter,
  ExtendedRequestTypeRegistry,
  ExtractedCallbackArg,
  ExtractedCallback,
  PseudoData,
} from "./types";
import "./types";
import { useRequestStateUpdater } from "./useRequestStateUpdater";
import { activateRequest } from "./activateRequest";
import { useShouldFetch } from "./useShouldFetch";
import { useRequestStateInner } from "./useRequestState";

type UseMountRequestStateArgs<K extends keyof ExtendedRequestTypeRegistry> = {
  id: K;
  expiredAfter?: ExpiredAfter;
  callback: ExtractedCallback<K>;
  disabled?: boolean;
  disableAfterInitialFetch?: boolean;
} & Omit<SendAbortableRequestArgs<ExtractedCallbackArg<K>>, "fallback">;

export const useMountRequestState = <K extends keyof ExtendedRequestTypeRegistry>({
  id,
  expiredAfter,
  callback,
  disabled,
  disableAfterInitialFetch,
  ...args
}: UseMountRequestStateArgs<K>) => {
  const { data, setData, isLoading, setIsLoading, isError, setIsError, fetchData } =
    useRequestStateInner({ id, disabled });
  const abortRef = useRef<ReturnType<typeof sendAbortableRequest>["abort"]>(); // TODO: Ensure its a better experience to have different abortRefs for manual fetching and automated fetching.

  useEffect(() => {
    if (disabled) {
      return;
    }

    const receivedData = fetchManagement.getState();
    const current = receivedData[id] as PseudoData<K> | undefined;
    const cachedData = current?.data;

    if (disableAfterInitialFetch && cachedData !== undefined) {
      return;
    }

    const shouldFetch = useShouldFetch({ id, ...args });
    if (!shouldFetch) {
      return;
    }

    const currentRequest = async () => {
      activateRequest({ id, expiredAfter, callback, abortRef, ...args });
    };

    currentRequest();
  }, [id, expiredAfter, args, disabled, disableAfterInitialFetch]);

  useRequestStateUpdater({ id, setData, setIsLoading, setIsError });

  return {
    data,
    isLoading,
    isError,
    fetchData,
  };
};
