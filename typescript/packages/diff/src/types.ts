import type { DiffTypes } from "./constants";

export type Diff = {
  type: typeof DiffTypes[keyof typeof DiffTypes];
  value: string;
};
