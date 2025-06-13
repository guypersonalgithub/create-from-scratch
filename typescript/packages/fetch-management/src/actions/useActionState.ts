import { useRef, useState } from "react";
import { type sendAbortableRequest, type SendAbortableRequestArgs } from "@packages/request";
import { type ExtractedCallbackArg, type PreviousRequestProperties } from "../types";
import {
  type ActionCallback,
  type ExtendedActionTypeRegistry,
  type ExtractedBody,
  type PseudoActionData,
} from "../types";
import { activateAction } from "./activateAction";
import { fetchManagement } from "../observer";
import { useActionStateUpdater } from "./useActionStateUpdater";
import { shouldAvoidSendingAction } from "../utils";

type UseMountRequestStateArgs<K extends keyof ExtendedActionTypeRegistry> = {
  id: K;
};

type InitiateActionArgs<K extends keyof ExtendedActionTypeRegistry> = {
  body: ExtractedBody<K>;
  callback: ActionCallback<K>;
} & Omit<SendAbortableRequestArgs<ExtractedCallbackArg<K>>, "fallback" | "body">;

export const useActionState = <K extends keyof ExtendedActionTypeRegistry>({
  id,
}: UseMountRequestStateArgs<K>) => {
  const initialData = fetchManagement.actions.getState()?.[id] as PseudoActionData<K> | undefined;
  const [isLoading, setIsLoading] = useState(initialData?.isLoading ?? false);
  const [isError, setIsError] = useState(initialData?.isError ?? false);
  const abortRef = useRef<ReturnType<typeof sendAbortableRequest>["abort"]>(); // TODO: Ensure its a better experience to have different abortRefs for manual fetching and automated fetching.
  const previousRequestProperties = useRef<PreviousRequestProperties<K>>();
  const amountOfAttemptsForCurrentRequest = useRef(0);

  const initiateAction = async ({ body, callback, ...args }: InitiateActionArgs<K>) => {
    const { shouldAvoid, attempts } = shouldAvoidSendingAction({
      id,
      attempts: amountOfAttemptsForCurrentRequest.current,
      body,
      previousRequestProperties: previousRequestProperties.current,
      ...args,
    });

    amountOfAttemptsForCurrentRequest.current = attempts;

    if (shouldAvoid) {
      return;
    }

    previousRequestProperties.current = {
      body,
      ...args,
    };

    activateAction({
      id,
      abortRef,
      body,
      callback,
      amountOfAttemptsForCurrentRequest,
      previousRequestProperties,
      ...args,
    });
  };

  useActionStateUpdater({ id, setIsLoading, setIsError });

  return {
    isLoading,
    isError,
    initiateAction,
  };
};
