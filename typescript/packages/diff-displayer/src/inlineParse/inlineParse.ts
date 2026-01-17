import type { EnhancedDiff } from "../types";
import type { InlineParseArgs } from "./types";
import { iterateInlineParsing } from "./iterateInlineParsing";

export const inlineParse = ({
  oldVersion,
  newVersion,
  addEmptyIndexes,
  removeEmptyIndexes,
}: InlineParseArgs) => {
  const updatedAdd: EnhancedDiff[] = [];
  const updatedRemove: EnhancedDiff[] = [];

  let longerArrayOffset = 0;
  let currentBatchStartIndex = 0;

  if (newVersion.length > oldVersion.length) {
    for (let i = 0; i < oldVersion.length; i++) {
      const { newIndex, oldIndex } =
        iterateInlineParsing({
          updatedAdd,
          updatedRemove,
          oldVersion,
          newVersion,
          addEmptyIndexes,
          removeEmptyIndexes,
          newIndex: longerArrayOffset,
          oldIndex: i,
          currentBatchStartIndex,
        }) ?? {};

      longerArrayOffset = newIndex + 1;
      i = oldIndex;
      currentBatchStartIndex = i + 1;
    }
  } else {
    for (let i = 0; i < newVersion.length; i++) {
      const { newIndex, oldIndex } =
        iterateInlineParsing({
          updatedAdd,
          updatedRemove,
          oldVersion,
          newVersion,
          addEmptyIndexes,
          removeEmptyIndexes,
          newIndex: i,
          oldIndex: longerArrayOffset,
          currentBatchStartIndex,
        }) ?? {};

      longerArrayOffset = oldIndex + 1;
      i = newIndex;
      currentBatchStartIndex = i + 1;
    }
  }

  return { updatedAdd, updatedRemove };
};
