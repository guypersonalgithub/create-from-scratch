import { type SendAbortableRequestArgs } from "@packages/request";
import { type ExtractedCallbackArg, type UpdateAdditionalRequests } from "./requests";

export interface BaseActionTypeRegistry {}

export type ExtendedActionBase = {
  [K in keyof BaseActionTypeRegistry]: BaseActionTypeRegistry[K];
} & {
  [K in keyof BaseActionTypeRegistry as `${K}-${string}`]: BaseActionTypeRegistry[K];
} & {
  [K in keyof BaseActionTypeRegistry as `${K}-${number}`]: BaseActionTypeRegistry[K];
};

export type OriginalKey<K> = K extends `${infer Base}-${string | number}` ? Base : K;

export type ActionTypeRegistryProperties<T extends { body: unknown; callbackArgument: unknown }> = {
  isLoading: boolean;
  isError: boolean;
};

export type ActionTypeRegistry<
  T extends Record<string, { body: unknown; callbackArgument: unknown }>,
> = Partial<{
  [K in keyof T]: ActionTypeRegistryProperties<T[K]>;
}>;

export type ExtendedActionTypeRegistry = ActionTypeRegistry<ExtendedActionBase>;

export type ExtractedActionCallbackArg<K extends keyof ExtendedActionTypeRegistry> =
  ExtendedActionBase[K]["callbackArgument"];

export type ExtractedBody<K extends keyof ExtendedActionTypeRegistry> =
  ExtendedActionBase[K]["body"];

export type ActionCallback<K extends keyof ExtendedActionTypeRegistry> = ({
  updateRequests,
  requestData,
}: {
  updateRequests: UpdateAdditionalRequests;
  requestData?: ExtractedActionCallbackArg<K>;
}) => void;

type Action<T, R> = Record<
  string,
  {
    body: T;
    callbackArgument: R;
  }
>;

export type PseudoActionData<K extends keyof ExtendedActionTypeRegistry> =
  ActionTypeRegistryProperties<Action<ExtractedBody<K>, ExtractedActionCallbackArg<K>>[K]>;

export type PreviousRequestProperties<K extends keyof ExtendedActionTypeRegistry> =
  | ({
      body: ExtractedBody<K>;
    } & Omit<SendAbortableRequestArgs<ExtractedCallbackArg<K>>, "fallback" | "body">)
  | undefined;
