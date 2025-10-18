import type { Exports } from "@packages/export-parser/src/types";
import type { Imports } from "@packages/import-parser";

export type FullPathData = {
  imports: Imports;
  exports?: Exports;
  currentIndex: number;
  input: string;
};
