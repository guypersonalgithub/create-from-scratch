import type { Diff } from "@packages/diff";
import type { NestedDiff } from "../types";

type OneSidedInlineParsingArgs = {
  type: NestedDiff["type"];
  expectedResultType: Exclude<Diff["type"], "UNCHANGED">;
  result: Diff[];
};

export const oneSidedInlineParsing = ({
  type,
  expectedResultType,
  result,
}: OneSidedInlineParsingArgs) => {
  const newNestedLine: NestedDiff = { type, value: [] };
  const subType: NestedDiff["value"][number]["type"] =
    type === "NESTED_ADD" ? "HIGHLIGHTED_ADD" : "HIGHLIGHTED_DELETE";

  let currentType = result[0].type;
  let currentCounter = 0;

  for (let i = 1; i < result.length; i++) {
    const current = result[i];

    if (current.type !== currentType) {
      const value = result
        .slice(currentCounter, i)
        .reduce((sum, current) => sum + current.value, "");

      if (currentType === "UNCHANGED") {
        newNestedLine.value.push({ type: "UNCHANGED", value });
      } else if (currentType === expectedResultType) {
        newNestedLine.value.push({ type: subType as "UNCHANGED", value });
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

    newNestedLine.value.push({ type: "UNCHANGED", value });
  }

  return newNestedLine;
};
