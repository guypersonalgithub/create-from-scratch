import { useRef } from "react";
import { sendAbortableRequest, SendAbortableRequestArgs } from "@packages/request";
import {
  ExtendedActionTypeRegistry,
  ExtractedCallbackArg,
  ExtractedBody,
  ActionCallback,
} from "../types";
import { activateAction } from "./activateAction";

// TODO: Consider adding isLoading and isError with useRefs.

type UseActionArgs<K extends keyof ExtendedActionTypeRegistry> = {
  id: K;
};

type InitiateActionArgs<K extends keyof ExtendedActionTypeRegistry> = {
  body: ExtractedBody<K>;
  callback: ActionCallback<K>;
} & Omit<SendAbortableRequestArgs<ExtractedCallbackArg<K>>, "fallback" | "body">;

export const useAction = <K extends keyof ExtendedActionTypeRegistry>({ id }: UseActionArgs<K>) => {
  const abortRef = useRef<ReturnType<typeof sendAbortableRequest>["abort"]>();

  const initiateAction = async ({ body, callback, ...args }: InitiateActionArgs<K>) => {
    activateAction({ id, abortRef, body, callback, ...args });
  };

  return {
    initiateAction,
  };
};
