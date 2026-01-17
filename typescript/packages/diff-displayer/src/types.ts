import type { Diff, DiffTypes } from "@packages/diff";
import type { NestedDiffTypes } from "./constants";

export type EmptyRows = { type: "EMPTY"; size: number; value?: never };
export type ParsedDiff = (Diff & { size?: number }) | EmptyRows;
export type NestedDiff =
  | {
      type: typeof NestedDiffTypes.NESTED_ADD;
      value: {
        type: typeof NestedDiffTypes.HIGHLIGHTED_ADD | typeof DiffTypes.UNCHANGED;
        value: string;
      }[];
    }
  | {
      type: typeof NestedDiffTypes.NESTED_DELETE;
      value: {
        type: typeof NestedDiffTypes.HIGHLIGHTED_DELETE | typeof DiffTypes.UNCHANGED;
        value: string;
      }[];
    };

export type EnhancedDiff = ParsedDiff | NestedDiff;
