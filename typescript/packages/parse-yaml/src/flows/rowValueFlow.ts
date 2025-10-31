import { isNumeric } from "@packages/string-utils";
import { TokenTypes } from "../constants";
import { type BaseToken, type OpenedContextsIdentation } from "../types";
import { endOfLineFlow } from "./endOfLineFlow";
import { spaceFlow } from "./spaceFlow";
import { dictateValueType } from "../utils";

type RowValueFlowArgs = {
  tokens: BaseToken[];
  input: string;
  currentIndex: number;
  identations: {
    lowestIdentation: number;
    currentIdentation: number;
  };
  openedContextsIdentations: OpenedContextsIdentation[];
};

export const rowValueFlow = ({
  tokens,
  input,
  currentIndex,
  identations,
  openedContextsIdentations,
}: RowValueFlowArgs) => {
  let currentChar = input.charAt(currentIndex);
  if (currentChar === "-") {
    if (openedContextsIdentations.length === 0) {
      return {
        updatedIndex: currentIndex,
        stop: true,
      };
    }

    tokens.push({ type: TokenTypes.OPERATOR, value: currentChar });
    currentIndex++;
    currentChar = input[currentIndex];
    const potentialSpace = spaceFlow({ tokens, input, currentIndex });
    if (potentialSpace) {
      const difference = potentialSpace.updatedIndex - currentIndex + 1;
      identations.currentIdentation += difference;
      currentIndex = potentialSpace.updatedIndex;
      currentChar = input[currentIndex];
    }
  }

  const { currentIdentation } = identations;
  if (openedContextsIdentations.length > 0) {
    const last = openedContextsIdentations[openedContextsIdentations.length - 1];
    if (last.childrenIdentiation === 0) {
      last.childrenIdentiation = currentIdentation;
    }
    // else {
    //   if (last.identiation < currentIdentation && last.childrenIdentiation !== currentIdentation) {
    //     return {
    //       updatedIndex: currentIndex,
    //       stop: true,
    //     };
    //   }
    // }
  }

  if (openedContextsIdentations.length > 0) {
    let last = openedContextsIdentations[openedContextsIdentations.length - 1];
    while (openedContextsIdentations.length > 0 && last.identiation >= currentIdentation) {
      openedContextsIdentations.pop();
      last = openedContextsIdentations[openedContextsIdentations.length - 1];
    }

    if (
      last &&
      last.identiation < currentIdentation &&
      last.childrenIdentiation !== currentIdentation
    ) {
      return {
        updatedIndex: currentIndex,
        stop: true,
      };
    }
  }

  let fullValue = "";
  currentChar = input[currentIndex];
  let key = "";

  while (input.length > currentIndex && currentChar !== "\n") {
    if (currentChar === ":") {
      const isNumber = isNumeric({ str: fullValue });
      tokens.push({
        type: !isNumber ? TokenTypes.STRING_KEY : TokenTypes.NUMERIC_KEY,
        value: fullValue,
      });
      tokens.push({ type: TokenTypes.OPERATOR, value: currentChar });

      openedContextsIdentations.push({
        identiation: identations.currentIdentation,
        childrenIdentiation: 0,
      });
      currentIndex++;
      currentChar = input[currentIndex];
      key = fullValue;
      fullValue = "";
      break;
    }

    fullValue += currentChar;
    currentIndex++;
    currentChar = input[currentIndex];
  }

  const potentialSpace = spaceFlow({ tokens, input, currentIndex });
  if (potentialSpace) {
    currentIndex = potentialSpace.updatedIndex;
    currentChar = input[currentIndex];
  }

  while (input.length >= currentIndex) {
    if (currentChar === "\n" || input.length === currentIndex) {
      if (fullValue.length > 0) {
        const type = dictateValueType({ fullValue });
        tokens.push({
          type,
          value: fullValue,
        });
        if (key.length > 0 && fullValue !== "|") {
          openedContextsIdentations.pop();
        }
      }
      endOfLineFlow({ tokens, newTokenValue: currentChar, currentIndex });
      currentIndex++;
      break;
    }

    fullValue += currentChar;
    currentIndex++;
    currentChar = input[currentIndex];
  }

  return {
    updatedIndex: currentIndex,
    stop: false,
  };
};
