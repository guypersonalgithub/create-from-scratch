import { Observer } from "@packages/design-patterns";
import {
  ExpiredAfter,
  ExtendedRequestTypeRegistry,
  ExtractedCallback,
  ExtractedCallbackArg,
  ExtractedData,
  PseudoData,
  UpdateStates,
} from "./types";
import { calculateExpiredDate } from "./utils";
import { SendAbortableRequestArgs } from "@packages/request";

export const fetchManagement = new Observer<ExtendedRequestTypeRegistry>({});

type UpdateObserverArgs<K extends keyof ExtendedRequestTypeRegistry> = {
  id: K;
  data?: ExtractedData<K>;
  expiredAfter?: ExpiredAfter;
  callback?: ExtractedCallback<K>;
  isLoading?: boolean;
  isError?: boolean;
} & Partial<Omit<SendAbortableRequestArgs<ExtractedCallbackArg<K>>, "fallback">>;

export const updateObserver = <K extends keyof ExtendedRequestTypeRegistry>({
  id,
  data,
  expiredAfter,
  callback,
  isLoading,
  isError,
  ...args
}: UpdateObserverArgs<K>) => {
  const receivedData = fetchManagement.getState();
  const current = receivedData[id] as PseudoData<K> | undefined;

  fetchManagement.setState({
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

type UpdateObserverMultipleArgs<K extends keyof ExtendedRequestTypeRegistry> = {
  updateStates: UpdateStates<K>;
};

export const updateObserverMultiple = <K extends keyof ExtendedRequestTypeRegistry>({
  updateStates,
}: UpdateObserverMultipleArgs<K>) => {
  const receivedData = fetchManagement.getState();
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

  fetchManagement.setState(statesToUpdate);
};
