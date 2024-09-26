import { sendAbortableRequest, SendAbortableRequestArgs } from "@packages/request";
import {
  ExpiredAfter,
  ExtendedRequestTypeRegistry,
  ExtractedCallback,
  ExtractedCallbackArg,
  PseudoData,
  UpdateStates,
} from "../types";
import {
  fetchManagement,
  updateRequestsObserver,
  updateRequestsObserverMultiple,
} from "../observer";
import { MutableRefObject } from "react";

type ActivateRequestArgs<K extends keyof ExtendedRequestTypeRegistry> = {
  id: K;
  expiredAfter?: ExpiredAfter;
  callback: ExtractedCallback<K>;
  abortRef: MutableRefObject<(() => void) | undefined>;
  amountOfAttemptsForCurrentRequest: MutableRefObject<number>;
} & Omit<SendAbortableRequestArgs<ExtractedCallbackArg<K>>, "fallback">;

export const activateRequest = async <K extends keyof ExtendedRequestTypeRegistry>({
  id,
  expiredAfter,
  callback,
  abortRef,
  amountOfAttemptsForCurrentRequest,
  ...args
}: ActivateRequestArgs<K>) => {
  abortRef.current?.();

  const { sendRequestFunction, abort } = sendAbortableRequest();
  abortRef.current = abort;

  let wasAborted = false;

  try {
    updateRequestsObserver({
      id,
      expiredAfter,
      callback,
      isLoading: true,
      isError: false,
      ...args,
    });

    const received = await sendRequestFunction<ExtractedCallbackArg<K>>(args);
    const { response, aborted } = received ?? {};
    wasAborted = aborted ?? false;
    if (!wasAborted) {
      let updateStates: UpdateStates<K> | undefined;
      const receivedData = fetchManagement.requests.getState();
      const current = receivedData[id] as PseudoData<K> | undefined;

      const parsed = callback({
        updateAdditionalRequests: ({ updateStates: newUpdateStates }) => {
          updateStates = newUpdateStates;
        },
        requestData: response,
        previousData: current?.data,
      });

      updateRequestsObserver({ id, data: parsed });
      if (updateStates) {
        updateRequestsObserverMultiple({ updateStates });
      }
    }
  } catch (error) {
    console.error(error);
    if (!wasAborted) {
      updateRequestsObserver({ id, isError: true });
    }
  } finally {
    if (!wasAborted) {
      updateRequestsObserver({ id, isLoading: false });
      amountOfAttemptsForCurrentRequest.current = 0;
    }
  }
};
