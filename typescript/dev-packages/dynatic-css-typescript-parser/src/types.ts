export type UniqueImports = Record<string, string[]>;
export type MappedImports = Record<string, string[]>;
export type ImportVariables = Record<string, string>;
export type Contexts = Record<
  string,
  Record<
    string,
    | {
        type: "string";
        value: string;
      }
    | { type: "function" }
    | { type: "variable" }
  >
>;

type ChunkVariableProperties = {
  name: string;
  startIndex: number;
  endIndex: number;
  isWithinTemplateLiteral?: boolean;
};

export type RegularVariableTypes =
  | "variable"
  | "function"
  | "multi-step-variable"
  | "arrow-function-without-content"
  | "nested-variable"
  | "config-variable"
  | "multi-step-function-static-value";

export type ArgumentTypes = "property" | "value" | "config-variable" | "static-value";

export type DynaticStyleChunksVariable = ChunkVariableProperties &
  (
    | {
        type: RegularVariableTypes;
        args?: never;
      }
    | {
        type: "multi-step-function";
        args: (ChunkVariableProperties & {
          type: ArgumentTypes;
        })[];
      }
  );

type DynaticStyleChunk = {
  name: string;
  context: string;
  startIndex: number;
  endIndex: number;
  value: string;
  variables: DynaticStyleChunksVariable[];
};
export type DynaticStyleOrderedChunks = DynaticStyleChunk[];
export type NameslessStyleOrderedChunks = Omit<DynaticStyleChunk, "name">[];
export type DynaticStyleChunks = Record<
  string,
  Record<string, Omit<DynaticStyleChunk, "name" | "context">>
>;
export type Counters = {
  if: number;
  for: number;
  while: number;
  switch: number;
};
export type ClassNames = {
  startIndex: number;
  endIndex: number;
  value: string;
  variables: DynaticStyleChunksVariable[];
  context: string;
}[];

export type Callback = {
  input: string;
  currentIndex: number;
  newTokenValue: string;
  identifier: string;
  dynaticStyleChunks: DynaticStyleChunks;
  dynaticStyleOrderedChunks: DynaticStyleOrderedChunks;
  nameslessStyleOrderedChunks: NameslessStyleOrderedChunks;
  uniqueImports: UniqueImports;
  mappedImports: MappedImports;
  importVariables: ImportVariables;
  contexts: Contexts;
  counters: Counters;
  openContexts: string[];
  classNames: ClassNames;
};
