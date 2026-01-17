import type { ParsedDiff } from "../types";

type ConstructInlineDiffArgs = {
  array: ParsedDiff[];
};

export const constructInlineDiff = ({ array }: ConstructInlineDiffArgs) => {
  const parsed: string[] = [];

  array.forEach((cell, index) => {
    let currentIndex = 0;

    for (let i = 0; i < cell.value!.length; i++) {
      const current = cell.value![i];

      if (current === " " || current === "\n" || current === ",") {
        if (i - currentIndex > 0) {
          parsed.push(cell.value!.slice(currentIndex, i));
        }
        currentIndex = i + 1;
        parsed.push(current);
      }
    }

    // if (currentIndex < cell.value!.length) {
    parsed.push(cell.value!.slice(currentIndex));
    // }

    if (index < array.length - 1) {
      parsed.push("\n");
    }
  });

  return parsed;
};
