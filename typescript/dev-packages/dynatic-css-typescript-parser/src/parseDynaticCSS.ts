import { tokenizerFlows } from "./tokenizerFlows";
import type {
  ClassNames,
  Contexts,
  Counters,
  DynaticStyleChunks,
  DynaticStyleOrderedChunks,
  ImportVariables,
  MappedImports,
  NameslessStyleOrderedChunks,
  UniqueImports,
} from "./types";
import { findNextBreakpoint } from "./utils";

type ParseDynaticCSSArgs = {
  input: string;
  identifier: string;
};

export const parseDynaticCSS = ({ input, identifier }: ParseDynaticCSSArgs) => {
  const dynaticStyleChunks: DynaticStyleChunks = {
    "": {},
  };
  const dynaticStyleOrderedChunks: DynaticStyleOrderedChunks = [];
  const nameslessStyleOrderedChunks: NameslessStyleOrderedChunks = [];
  const uniqueImports: UniqueImports = {
    [identifier]: [],
  };
  const mappedImports: MappedImports = {};
  const importVariables: ImportVariables = {};
  const contexts: Contexts = {
    "": {},
  };
  const counters: Counters = { if: 0, for: 0, while: 0, switch: 0 };
  const classNames: ClassNames = [];
  let currentIndex = 0;

  const openContexts: string[] = [];

  while (currentIndex < input.length) {
    const { updatedIndex, newTokenValue } = findNextBreakpoint({ input, currentIndex });

    const { updatedIndex: newIndex } = tokenizerFlows({
      input,
      currentIndex: updatedIndex,
      newTokenValue,
      identifier,
      dynaticStyleChunks,
      dynaticStyleOrderedChunks,
      nameslessStyleOrderedChunks,
      uniqueImports,
      mappedImports,
      importVariables,
      contexts,
      counters,
      openContexts,
      classNames,
    });
    currentIndex = newIndex;
  }

  return {
    dynaticStyleChunks,
    dynaticStyleOrderedChunks,
    nameslessStyleOrderedChunks,
    uniqueImports,
    mappedImports,
    importVariables,
    contexts,
    classNames,
  };
};
