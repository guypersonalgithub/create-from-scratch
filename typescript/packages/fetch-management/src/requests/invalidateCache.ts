import { updateRequestsObserver } from "../observer";
import { ExtendedRequestTypeRegistry } from "../types";

type InvaldiateCacheArgs<K extends keyof ExtendedRequestTypeRegistry> = {
  id: K;
};

export const invalidateCache = <K extends keyof ExtendedRequestTypeRegistry>({
  id,
}: InvaldiateCacheArgs<K>) => {
  updateRequestsObserver({ id, expiredAfter: "never" });
};