export type OmitByPattern<T, P extends string> = {
  [K in keyof T as K extends P ? never : K]: T[K];
};
