import type { Diff } from "@packages/diff";
import type { EnhancedDiff } from "../types";

type TwoSidedInlineParsingArgs = {
  result: Diff[];
};

export const twoSidedInlineParsing = ({ result }: TwoSidedInlineParsingArgs) => {
  const newAddition: EnhancedDiff = { type: "NESTED_ADD", value: [] };
  const newDeletion: EnhancedDiff = { type: "NESTED_DELETE", value: [] };

  let currentType = result[0].type;
  let currentCounter = 0;

  for (let i = 1; i < result.length; i++) {
    const current = result[i];

    if (current.type !== currentType) {
      const value = result
        .slice(currentCounter, i)
        .reduce((sum, current) => sum + current.value, "");

      if (currentType === "UNCHANGED") {
        const lastAddition = newAddition.value[newAddition.value.length - 1];
        if (lastAddition?.type === "UNCHANGED") {
          lastAddition.value += value;
        } else {
          newAddition.value.push({ type: "UNCHANGED", value });
        }

        const lastDeletion = newDeletion.value[newDeletion.value.length - 1];
        if (lastDeletion?.type === "UNCHANGED") {
          lastDeletion.value += value;
        } else {
          newDeletion.value.push({ type: "UNCHANGED", value });
        }
      } else if (currentType === "ADDED") {
        newAddition.value.push({ type: "HIGHLIGHTED_ADD", value });
      } else if (currentType === "DELETED") {
        newDeletion.value.push({ type: "HIGHLIGHTED_DELETE", value });
      }

      currentCounter = i;
      currentType = current.type;
    }
  }

  const end = result.length;
  if (end - currentCounter > 0) {
    const value = result
      .slice(currentCounter, end)
      .reduce((sum, current) => sum + current.value, "");

    newAddition.value.push({ type: "UNCHANGED", value });
    newDeletion.value.push({ type: "UNCHANGED", value });
  }

  return { newAddition, newDeletion };
};
