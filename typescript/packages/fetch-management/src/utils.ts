import { SendAbortableRequestArgs } from "@packages/request";
import {
  ExpiredAfter,
  ExtendedRequestTypeRegistry,
  ExtractedCallbackArg,
  PseudoData,
} from "./types";
import {
  ExtendedActionTypeRegistry,
  ExtractedBody,
  PreviousRequestProperties,
} from "./types/actions";
import { fetchManagement } from "./observer";
import { areObjectsEqual } from "@packages/utils";

type CalculateExpiredDateArgs = {
  expiredAfter?: ExpiredAfter;
};

export const calculateExpiredDate = ({ expiredAfter }: CalculateExpiredDateArgs) => {
  if (!expiredAfter) {
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 1);
    return currentDate;
  }

  if (expiredAfter === "never") {
    return;
  }

  const [amountString, unit] = expiredAfter.split(" ");
  const amount = parseInt(amountString, 10);

  const currentDate = new Date();

  switch (unit) {
    case "seconds":
      currentDate.setSeconds(currentDate.getSeconds() + amount);
      break;
    case "minutes":
      currentDate.setMinutes(currentDate.getMinutes() + amount);
      break;
    case "hours":
      currentDate.setHours(currentDate.getHours() + amount);
      break;
    case "days":
      currentDate.setDate(currentDate.getDate() + amount);
      break;
    default:
      throw new Error("Invalid time unit");
  }

  return currentDate;
};

type DictateIsLoadingInitiallyArgs<K extends keyof ExtendedRequestTypeRegistry> = {
  initialData?: PseudoData<K>;
  disabled?: boolean;
};

export const dictateIsLoadingInitially = <K extends keyof ExtendedRequestTypeRegistry>({
  initialData,
  disabled,
}: DictateIsLoadingInitiallyArgs<K>) => {
  if (disabled) {
    return false;
  }

  const { data, isLoading, expiredAt } = initialData ?? {};

  if (isLoading || !data) {
    return true;
  }

  return expiredAt ? new Date() > expiredAt : false;
};

type CompareCurrentAndNewRequestsArgs<K extends keyof ExtendedRequestTypeRegistry> = {
  id: K;
} & Omit<SendAbortableRequestArgs<ExtractedCallbackArg<K>>, "fallback">;

export const compareCurrentAndNewRequests = <K extends keyof ExtendedRequestTypeRegistry>({
  id,
  ...args
}: CompareCurrentAndNewRequestsArgs<K>) => {
  const receivedData = fetchManagement.requests.getState();
  const current = receivedData[id] as PseudoData<K> | undefined;
  const { url, params, method, body, headers } = current ?? {};

  const currentArgs = {
    ...(url ? { url } : {}),
    ...(params ? { params } : {}),
    ...(method ? { method } : {}),
    ...(body ? { body } : {}),
    ...(headers ? { headers } : {}),
  };

  return areObjectsEqual({
    obj1: currentArgs,
    obj2: { ...args },
  });
};

type ShouldAvoidSendingRequestArgs<K extends keyof ExtendedRequestTypeRegistry> = {
  id: K;
  attempts: number;
} & Omit<SendAbortableRequestArgs<ExtractedCallbackArg<K>>, "fallback">;

export const shouldAvoidSendingRequest = <K extends keyof ExtendedRequestTypeRegistry>({
  id,
  attempts,
  ...args
}: ShouldAvoidSendingRequestArgs<K>) => {
  const updatedAttempts = attempts + 1;

  if (attempts >= 10) {
    return { shouldAvoid: true, attempts: updatedAttempts };
  }

  const areEqual = compareCurrentAndNewRequests({ id, ...args });
  return { shouldAvoid: areEqual, attempts: updatedAttempts };
};

type CompareCurrentAndNewActionArgs<K extends keyof ExtendedActionTypeRegistry> = {
  id: K;
  body: ExtractedBody<K>;
  previousRequestProperties: PreviousRequestProperties<K>;
} & Omit<SendAbortableRequestArgs<ExtractedCallbackArg<K>>, "fallback" | "body">;

const compareCurrentAndNewAction = <K extends keyof ExtendedActionTypeRegistry>({
  id,
  body,
  previousRequestProperties,
  ...args
}: CompareCurrentAndNewActionArgs<K>) => {
  const currentArgs = {
    body,
    ...args,
  };

  return areObjectsEqual({
    obj1: currentArgs,
    obj2: previousRequestProperties,
  });
};

type ShouldAvoidSendingActionArgs<K extends keyof ExtendedActionTypeRegistry> = {
  id: K;
  attempts: number;
  body: ExtractedBody<K>;
  previousRequestProperties: PreviousRequestProperties<K>;
} & Omit<SendAbortableRequestArgs<ExtractedCallbackArg<K>>, "fallback" | "body">;

export const shouldAvoidSendingAction = <K extends keyof ExtendedActionTypeRegistry>({
  id,
  attempts,
  body,
  previousRequestProperties,
  ...args
}: ShouldAvoidSendingActionArgs<K>) => {
  const updatedAttempts = attempts + 1;

  if (attempts >= 10) {
    return { shouldAvoid: true, attempts: updatedAttempts };
  }

  const areEqual = compareCurrentAndNewAction({ id, body, previousRequestProperties, ...args });
  return { shouldAvoid: areEqual, attempts: updatedAttempts };
};
