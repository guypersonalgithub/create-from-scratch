import { SendAbortableRequestArgs } from "@packages/request";
import { ExtendedRequestTypeRegistry, ExtractedCallbackArg, PseudoData } from "./types";
import { fetchManagement } from "./observer";
import { areObjectsEqual } from "@packages/utils";

type UseShouldFetchArgs<K extends keyof ExtendedRequestTypeRegistry> = {
  id: K;
} & Omit<SendAbortableRequestArgs<ExtractedCallbackArg<K>>, "fallback">;

export const useShouldFetch = <K extends keyof ExtendedRequestTypeRegistry>({
  id,
  ...args
}: UseShouldFetchArgs<K>) => {
  const receivedData = fetchManagement.getState();
  const current = receivedData[id] as PseudoData<K> | undefined;
  const { url, params, method, body, headers, expiredAt } = current ?? {};

  const currentArgs = {
    ...(url ? { url } : {}),
    ...(params ? { params } : {}),
    ...(method ? { method } : {}),
    ...(body ? { body } : {}),
    ...(headers ? { headers } : {}),
  };

  const areArgsEqual = areObjectsEqual({
    obj1: currentArgs,
    obj2: { ...args },
  });

  return !(areArgsEqual && expiredAt && new Date() < expiredAt);
};
