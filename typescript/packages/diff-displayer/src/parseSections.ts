import { type Diff } from "@packages/diff";
import type { ParsedDiff } from "./types";

type ParseSectionsArgs = {
  parsed: Diff[];
};

export const parseSections = ({ parsed }: ParseSectionsArgs) => {
  const oldVersion: ParsedDiff[] = [];
  const newVersion: ParsedDiff[] = [];
  const addEmptyIndexes = new Set<number>();
  const removeEmptyIndexes = new Set<number>();

  if (parsed.length === 0) {
    return { oldVersion, newVersion, addEmptyIndexes, removeEmptyIndexes };
  }

  let addsInArow = 0;
  let removesInARow = 0;

  let lastTwoTypes: Diff["type"][] = [parsed[0].type];

  parsed.forEach((line) => {
    const { type } = line;

    if (lastTwoTypes.length < 2 && lastTwoTypes[0] !== type) {
      lastTwoTypes.push(type);
    } else {
      const [_, second] = lastTwoTypes;

      if (second && second !== type) {
        if (addsInArow !== removesInARow && addsInArow > 0 && removesInARow > 0) {
          if (type === "ADDED") {
            removeEmptyIndexes.add(oldVersion.length);
            oldVersion.push({ type: "EMPTY", size: addsInArow });
          } else if (type === "DELETED") {
            addEmptyIndexes.add(newVersion.length);
            newVersion.push({ type: "EMPTY", size: removesInARow });
          } else {
            const size = addsInArow - removesInARow;
            if (size > 0) {
              removeEmptyIndexes.add(oldVersion.length);
              oldVersion.push({ type: "EMPTY", size });
            } else if (size < 0) {
              addEmptyIndexes.add(newVersion.length);
              newVersion.push({ type: "EMPTY", size: -size });
            }
          }
        }

        lastTwoTypes = [type];
        addsInArow = 0;
        removesInARow = 0;
      }
    }

    if (type === "ADDED") {
      addsInArow++;
      newVersion.push(line);
    } else if (type === "DELETED") {
      removesInARow++;
      oldVersion.push(line);
    } else {
      newVersion.push(line);
      oldVersion.push(line);
    }
  });

  const size = addsInArow - removesInARow;
  if (size > 0) {
    removeEmptyIndexes.add(oldVersion.length);
    oldVersion.push({ type: "EMPTY", size });
  } else if (size < 0) {
    addEmptyIndexes.add(newVersion.length);
    newVersion.push({ type: "EMPTY", size: -size });
  }

  return { oldVersion, newVersion, addEmptyIndexes, removeEmptyIndexes };
};
