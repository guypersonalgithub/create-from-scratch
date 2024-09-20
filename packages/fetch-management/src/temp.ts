export type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;

export type Overwrite<T, U> = DistributiveOmit<T, keyof U> & U;

export type OriginalKey<K> = K extends `${infer Base}-${string | number}` ? Base : K;
