import { Observer } from "@packages/design-patterns";
import {
  type ExpiredAfter,
  type ExtendedRequestTypeRegistry,
  type ExtractedCallback,
  type ExtractedCallbackArg,
  type ExtractedData,
  type PseudoData,
  type UpdateStates,
} from "./types";
import { calculateExpiredDate } from "./utils";
import { type SendAbortableRequestArgs } from "@packages/request";
import { type ExtendedActionTypeRegistry } from "./types/actions";

export const fetchManagement = {
  requests: new Observer<ExtendedRequestTypeRegistry>({}),
  actions: new Observer<ExtendedActionTypeRegistry>({}),
};

type UpdateRequestsObserverArgs<K extends keyof ExtendedRequestTypeRegistry> = {
  id: K;
  data?: ExtractedData<K>;
  expiredAfter?: ExpiredAfter;
  callback?: ExtractedCallback<K>;
  isLoading?: boolean;
  isError?: boolean;
} & Partial<Omit<SendAbortableRequestArgs<ExtractedCallbackArg<K>>, "fallback">>;

export const updateRequestsObserver = <K extends keyof ExtendedRequestTypeRegistry>({
  id,
  data,
  expiredAfter,
  callback,
  isLoading,
  isError,
  ...args
}: UpdateRequestsObserverArgs<K>) => {
  const receivedData = fetchManagement.requests.getState();
  const current = receivedData[id] as PseudoData<K> | undefined;

  fetchManagement.requests.setState({
    [id]: {
      ...(current ?? {}),
      ...(args ?? {}),
      ...(data ? { data } : {}),
      ...(isLoading !== undefined ? { isLoading } : {}),
      ...(isError !== undefined ? { isError } : {}),
      expiredAt: calculateExpiredDate({ expiredAfter }),
      ...(callback ? { callback } : {}),
    },
  });
};

type UpdateRequestsObserverMultipleArgs<K extends keyof ExtendedRequestTypeRegistry> = {
  updateStates: UpdateStates<K>;
};

export const updateRequestsObserverMultiple = <K extends keyof ExtendedRequestTypeRegistry>({
  updateStates,
}: UpdateRequestsObserverMultipleArgs<K>) => {
  const receivedData = fetchManagement.requests.getState();
  const statesToUpdate = {} as ExtendedRequestTypeRegistry;
  const updatingStates = updateStates as PseudoData<K>;
  for (const key in updatingStates) {
    const currentKey = key as K;
    const callback = updatingStates[currentKey] as ({
      previousData,
    }: {
      previousData?: ExtractedData<K>;
    }) => ExtractedData<K>;
    const received = receivedData[currentKey] as PseudoData<K> | undefined;
    const newData = callback({ previousData: received?.data });
    (statesToUpdate[currentKey] as Partial<{}>) = {
      ...(received ?? {}),
      data: newData,
    };
  }

  fetchManagement.requests.setState(statesToUpdate);
};

type UpdateActionsObserverArgs<K extends keyof ExtendedActionTypeRegistry> = {
  id: K;
  isLoading?: boolean;
  isError?: boolean;
};

export const updateActionsObserver = <K extends keyof ExtendedActionTypeRegistry>({
  id,
  isLoading,
  isError,
}: UpdateActionsObserverArgs<K>) => {
  if (isLoading === undefined && isError === undefined) {
    return;
  }

  fetchManagement.actions.setState({
    [id]: {
      ...(isLoading !== undefined ? { isLoading } : {}),
      ...(isError !== undefined ? { isError } : {}),
    },
  });
};
