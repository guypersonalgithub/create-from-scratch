import type { OverlappingKeys } from "./overlappingKeys";

export type Disjoint<A, B> =
  OverlappingKeys<A, B> extends never
    ? unknown
    : ["Error: overlapping keys", OverlappingKeys<A, B>];
