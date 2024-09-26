import { SendAbortableRequestArgs } from "@packages/request";

export interface BaseRequestTypeRegistry {}

export type ExtendedBase = {
  [K in keyof BaseRequestTypeRegistry]: BaseRequestTypeRegistry[K];
} & {
  [K in keyof BaseRequestTypeRegistry as `${K}-${string}`]: BaseRequestTypeRegistry[K];
} & {
  [K in keyof BaseRequestTypeRegistry as `${K}-${number}`]: BaseRequestTypeRegistry[K];
};

export type UpdateAdditionalRequests = ({
  updateStates,
}: {
  updateStates: {
    [K in keyof ExtendedRequestTypeRegistry]: ({
      previousData,
    }: {
      previousData?: ExtractedData<K>;
    }) => ExtractedData<K>;
  };
}) => void;

export type RequestTypeRegistryProperties<T extends { data: unknown; callbackArgument: unknown }> =
  {
    data?: T["data"];
    expiredAt?: Date;
    callback: ({
      updateAdditionalRequests,
      requestData,
      previousData,
    }: {
      updateAdditionalRequests: UpdateAdditionalRequests;
      requestData?: T["callbackArgument"];
      previousData?: T["data"];
    }) => T["data"] | undefined;
    isLoading: boolean;
    isError: boolean;
  } & Omit<Partial<SendAbortableRequestArgs<T["callbackArgument"]>>, "fallback">;

export type RequestTypeRegistry<
  T extends Record<string, { data: unknown; callbackArgument: unknown }>,
> = Partial<{
  [K in keyof T]: RequestTypeRegistryProperties<T[K]>;
}>;

export type ExtendedRequestTypeRegistry = RequestTypeRegistry<ExtendedBase>;

export type ExtractedData<K extends keyof ExtendedRequestTypeRegistry> = ExtendedBase[K]["data"];

export type ExtractedCallbackArg<K extends keyof ExtendedRequestTypeRegistry> =
  ExtendedBase[K]["callbackArgument"];

export type ExtractedCallback<K extends keyof ExtendedRequestTypeRegistry> =
  RequestTypeRegistryProperties<ExtendedBase[K]>["callback"];

type Request<T, R> = Record<
  string,
  {
    data: T;
    callbackArgument: R;
  }
>;

export type PseudoData<K extends keyof ExtendedRequestTypeRegistry> = RequestTypeRegistryProperties<
  Request<ExtractedData<K>, ExtractedCallbackArg<K>>[K]
>;

export type UpdateStates<K extends keyof ExtendedRequestTypeRegistry> = Partial<
  Record<K, ({ previousData }: { previousData?: ExtractedData<K> }) => ExtractedData<K>>
>;
