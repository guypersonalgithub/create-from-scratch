import { SendAbortableRequestArgs } from "@packages/request";
import { ExtendedRequestTypeRegistry, ExtractedCallbackArg, PseudoData } from "../types";
import { fetchManagement } from "../observer";
import { compareCurrentAndNewRequests } from "../utils";

type UseShouldFetchArgs<K extends keyof ExtendedRequestTypeRegistry> = {
  id: K;
} & Omit<SendAbortableRequestArgs<ExtractedCallbackArg<K>>, "fallback">;

export const useShouldFetch = <K extends keyof ExtendedRequestTypeRegistry>({
  id,
  ...args
}: UseShouldFetchArgs<K>) => {
  const receivedData = fetchManagement.requests.getState();
  const current = receivedData[id] as PseudoData<K> | undefined;
  const { expiredAt } = current ?? {};

  const areArgsEqual = compareCurrentAndNewRequests({ id, ...args });

  return !(areArgsEqual && expiredAt && new Date() < expiredAt);
};
