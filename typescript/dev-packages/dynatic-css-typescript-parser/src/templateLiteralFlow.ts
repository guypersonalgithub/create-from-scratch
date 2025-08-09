import { expressionInterpolationFlow } from "./expressionInterpolationFlow";
import type { Callback, DynaticStyleChunksVariable } from "./types";

type TemplateLiteralFlow = Pick<Callback, "input" | "currentIndex" | "newTokenValue">;

export const templateLiteralFlow = ({
  input,
  currentIndex,
  newTokenValue,
}: TemplateLiteralFlow) => {
  if (!newTokenValue || newTokenValue !== "`") {
    return { updatedIndex: currentIndex };
  }

  let completeValue = newTokenValue;
  const variables: DynaticStyleChunksVariable[] = [];

  while (currentIndex < input.length) {
    const current = input[currentIndex];
    completeValue += current;
    currentIndex++;

    if (current === "$") {
      const followingCharacter = input[currentIndex];
      const expressionInterpolation = expressionInterpolationFlow({
        input,
        currentIndex: currentIndex + 1,
        newTokenValue: followingCharacter,
        calledFromTemplateLiteral: true,
      });
      if (expressionInterpolation.value) {
        completeValue += expressionInterpolation.value;
        currentIndex = expressionInterpolation.updatedIndex;

        if (expressionInterpolation.variables) {
          variables.push(...expressionInterpolation.variables);
        }

        continue;
      }
    } else if (current === "`") {
      break;
    }
  }

  return { value: completeValue, updatedIndex: currentIndex, variables };
};
