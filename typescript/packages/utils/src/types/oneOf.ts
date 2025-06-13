import type { Without } from "./without";

export type OneOf<T extends object> = T extends infer U
  ? U extends object
    ? U & Without<T, U>
    : never
  : never;
