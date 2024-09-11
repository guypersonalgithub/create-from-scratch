import { sendAbortableRequest, SendAbortableRequestArgs } from "@packages/request";
import {
  ExpiredAfter,
  ExtendedRequestTypeRegistry,
  ExtractedCallback,
  ExtractedCallbackArg,
  PseudoData,
  UpdateStates,
} from "./types";
import { fetchManagement, updateObserver, updateObserverMultiple } from "./observer";
import { MutableRefObject } from "react";

type ActivateRequestArgs<K extends keyof ExtendedRequestTypeRegistry> = {
  id: K;
  expiredAfter?: ExpiredAfter;
  callback: ExtractedCallback<K>;
  abortRef: MutableRefObject<(() => void) | undefined>;
} & Omit<SendAbortableRequestArgs<ExtractedCallbackArg<K>>, "fallback">;

export const activateRequest = async <K extends keyof ExtendedRequestTypeRegistry>({
  id,
  expiredAfter,
  callback,
  abortRef,
  ...args
}: ActivateRequestArgs<K>) => {
  abortRef.current?.();

  const { sendRequestFunction, abort } = sendAbortableRequest();
  abortRef.current = abort;

  let wasAborted = false;

  try {
    updateObserver({ id, expiredAfter, callback, isLoading: true, isError: false, ...args });

    const received = await sendRequestFunction<ExtractedCallbackArg<K>>(args);
    const { response, aborted } = received ?? {};
    wasAborted = aborted ?? false;
    if (!wasAborted) {
      let updateStates: UpdateStates<K> | undefined;
      const receivedData = fetchManagement.getState();
      const current = receivedData[id] as PseudoData<K> | undefined;

      const parsed = callback({
        updateAdditionalRequests: ({ updateStates: newUpdateStates }) => {
          updateStates = newUpdateStates;
        },
        requestData: response,
        previousData: current?.data,
      });

      updateObserver({ id, data: parsed, expiredAfter, callback, ...args });
      if (updateStates) {
        updateObserverMultiple({ updateStates });
      }
    }
  } catch (error) {
    if (!wasAborted) {
      console.error(error);
      updateObserver({ id, expiredAfter, isError: true, callback, ...args });
    }
  } finally {
    if (!wasAborted) {
      updateObserver({ id, expiredAfter, isLoading: false, callback, ...args });
    }
  }
};
