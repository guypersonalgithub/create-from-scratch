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
import { activateRequest } from "./activateRequest";
import { useShouldFetch } from "./useShouldFetch";
import { useRequest, UseRequestArgs } from "./useRequest";

type UseMountRequestArgs<K extends keyof ExtendedRequestTypeRegistry> = {
  id: K;
  expiredAfter?: ExpiredAfter;
  callback: ExtractedCallback<K>;
  disable?: boolean;
  disableAfterInitialFetch?: boolean;
  listenerCallback: Pick<UseRequestArgs<K>, "callback">["callback"];
} & Omit<SendAbortableRequestArgs<ExtractedCallbackArg<K>>, "fallback">;

export const useMountRequest = <K extends keyof ExtendedRequestTypeRegistry>({
  id,
  expiredAfter,
  callback,
  disable,
  disableAfterInitialFetch,
  listenerCallback,
  ...args
}: UseMountRequestArgs<K>) => {
  const { fetchData } = useRequest({ id, callback: listenerCallback });
  const abortRef = useRef<ReturnType<typeof sendAbortableRequest>["abort"]>(); // TODO: Ensure its a better experience to have different abortRefs for manual fetching and automated fetching.

  useEffect(() => {
    if (disable) {
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
  }, [id, expiredAfter, args, disable, disableAfterInitialFetch]);

  return {
    fetchData,
  };
};
