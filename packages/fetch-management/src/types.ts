import { SendAbortableRequestArgs } from "@packages/request";

type TimeUnit = "seconds" | "minutes" | "hours" | "days";
export type ExpiredAfter = `never` | `${number} ${TimeUnit}`;

export type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;

export type Overwrite<T, U> = DistributiveOmit<T, keyof U> & U;

export interface BaseRequestTypeRegistry {}

export type ExtendedBase = {
  [K in keyof BaseRequestTypeRegistry]: BaseRequestTypeRegistry[K];
} & {
  // Include K-${string} variations
  [K in keyof BaseRequestTypeRegistry as `${K}-${string}`]?: BaseRequestTypeRegistry[K];
} & {
  // Include K-${number} variations
  [K in keyof BaseRequestTypeRegistry as `${K}-${number}`]?: BaseRequestTypeRegistry[K];
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
    }) => T["data"];
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