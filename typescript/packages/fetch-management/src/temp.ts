export type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;

export type Overwrite<T, U> = DistributiveOmit<T, keyof U> & U;

export type OriginalKey<K> = K extends `${infer Base}-${string | number}` ? Base : K;

export type DataState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "success"; data: T };
