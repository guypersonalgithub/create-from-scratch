export type AllPropertiesOfType<T, N> = {
  [K in keyof T]: N;
};
