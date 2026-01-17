import { diff } from "@packages/diff";
import type { EnhancedDiff, ParsedDiff } from "../types";
import type { InlineParseArgs } from "./types";
import { twoSidedInlineParsing } from "./twoSidedInlineParsing";
import { oneSidedInlineParsing } from "./oneSidedInlineParsing";
import { constructInlineDiff } from "./utils";

type IterationArgs = InlineParseArgs & {
  updatedAdd: EnhancedDiff[];
  updatedRemove: EnhancedDiff[];
  oldIndex: number;
  newIndex: number;
  currentBatchStartIndex: number;
};

export const iterateInlineParsing = ({
  updatedAdd,
  updatedRemove,
  oldVersion,
  newVersion,
  addEmptyIndexes,
  removeEmptyIndexes,
  newIndex,
  oldIndex,
  currentBatchStartIndex,
}: IterationArgs) => {
  const currentOld = oldVersion[oldIndex];
  const currentNew = newVersion[newIndex];

  if (currentOld.type === "UNCHANGED") {
    updatedAdd.push(currentNew);
    updatedRemove.push(currentOld);
    return { newIndex, oldIndex };
  }

  if (removeEmptyIndexes.has(oldIndex)) {
    const { size } = oldVersion[oldIndex];

    for (let j = newIndex; j < newIndex + size!; j++) {
      updatedAdd.push(newVersion[j]);
    }

    updatedRemove.push(oldVersion[oldIndex]);

    newIndex += size!;
    oldIndex++;
    return { newIndex, oldIndex };
  } else if (addEmptyIndexes.has(newIndex)) {
    const { size } = newVersion[newIndex];

    for (let j = oldIndex; j < oldIndex + size!; j++) {
      updatedRemove.push(oldVersion[j]);
    }

    updatedAdd.push(newVersion[newIndex]);

    oldIndex += size!;
    newIndex++;
    return { newIndex, oldIndex };
  }

  const newData: ParsedDiff[] = [],
    oldData: ParsedDiff[] = [];

  newData.push(currentNew);
  oldData.push(currentOld);

  const nextOldIndex = oldIndex + 1;
  const nextNewIndex = newIndex + 1;

  let removeEmptyIndex: number | undefined;
  let addEmptyIndex: number | undefined;

  if (removeEmptyIndexes.has(nextOldIndex)) {
    const { size } = oldVersion[nextOldIndex];
    removeEmptyIndex = nextOldIndex;

    for (let j = newIndex + 1; j < newIndex + 1 + size!; j++) {
      newData.push(newVersion[j]);
    }

    newIndex += size!;
    oldIndex++;
  } else if (addEmptyIndexes.has(nextNewIndex)) {
    const { size } = newVersion[nextNewIndex];
    addEmptyIndex = nextNewIndex;

    for (let j = oldIndex + 1; j < oldIndex + 1 + size!; j++) {
      oldData.push(oldVersion[j]);
    }

    oldIndex += size!;
    newIndex++;
  }

  const add = constructInlineDiff({ array: newData });
  const remove = constructInlineDiff({ array: oldData });

  const { result, hasAdditions, hasDeletions } = diff({
    from: remove,
    to: add,
    includeFlags: true,
  });

  if (hasAdditions && hasDeletions) {
    const { newAddition, newDeletion } = twoSidedInlineParsing({ result });

    updatedAdd.push(newAddition);
    updatedRemove.push(newDeletion);
  } else if (!hasAdditions) {
    updatedAdd.push(
      ...newVersion.slice(currentBatchStartIndex, currentBatchStartIndex + newData.length),
    );

    const newDeletion = oneSidedInlineParsing({
      type: "NESTED_DELETE",
      expectedResultType: "DELETED",
      result,
    });
    updatedRemove.push(newDeletion);
  } else {
    updatedRemove.push(
      ...oldVersion.slice(currentBatchStartIndex, currentBatchStartIndex + oldData.length),
    );

    const newAddition = oneSidedInlineParsing({
      type: "NESTED_ADD",
      expectedResultType: "ADDED",
      result,
    });
    updatedAdd.push(newAddition);
  }

  if (removeEmptyIndex !== undefined) {
    updatedRemove.push(oldVersion[removeEmptyIndex]);
  }

  if (addEmptyIndex !== undefined) {
    updatedAdd.push(newVersion[addEmptyIndex]);
  }

  return { newIndex, oldIndex };
};
