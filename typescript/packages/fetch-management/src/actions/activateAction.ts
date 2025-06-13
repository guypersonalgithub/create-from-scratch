import { sendAbortableRequest, type SendAbortableRequestArgs } from "@packages/request";
import { type ExtractedCallbackArg, type PreviousRequestProperties } from "../types";
import { updateActionsObserver, updateRequestsObserverMultiple } from "../observer";
import { type MutableRefObject } from "react";
import { type ActionCallback, type ExtendedActionTypeRegistry, type ExtractedBody } from "../types";

type ActivateRequestArgs<K extends keyof ExtendedActionTypeRegistry> = {
  id: K;
  abortRef: MutableRefObject<(() => void) | undefined>;
  body: ExtractedBody<K>;
  callback: ActionCallback<K>;
  amountOfAttemptsForCurrentRequest: MutableRefObject<number>;
  previousRequestProperties: MutableRefObject<PreviousRequestProperties<K>>;
} & Omit<SendAbortableRequestArgs<ExtractedCallbackArg<K>>, "fallback" | "body">;

export const activateAction = async <K extends keyof ExtendedActionTypeRegistry>({
  id,
  abortRef,
  body,
  callback,
  amountOfAttemptsForCurrentRequest,
  previousRequestProperties,
  ...args
}: ActivateRequestArgs<K>) => {
  abortRef.current?.();

  const { sendRequestFunction, abort } = sendAbortableRequest();
  abortRef.current = abort;

  let wasAborted = false;

  try {
    updateActionsObserver({
      id,
      isLoading: true,
      isError: false,
    });

    const received = await sendRequestFunction<ExtractedCallbackArg<K>>({ ...args, body });
    const { response, aborted } = received ?? {};
    wasAborted = aborted ?? false;
    if (!wasAborted) {
      callback({
        updateRequests: ({ updateStates }) => {
          updateRequestsObserverMultiple({ updateStates });
        },
        requestData: response,
      });
    }
  } catch (error) {
    console.error(error);
    if (!wasAborted) {
      updateActionsObserver({ id, isError: true });
    }
  } finally {
    if (!wasAborted) {
      updateActionsObserver({ id, isLoading: false });
      amountOfAttemptsForCurrentRequest.current = 0;
      previousRequestProperties.current = undefined;
    }
  }
};
