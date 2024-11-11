import { absoluteFlow } from "./absoluteFlow";
import { numberFlow } from "./numberFlow";
import { parenthesisFlow } from "./parenthesisFlow";
import { BaseToken } from "../types";
import { basicOperators } from "../uniqueTokens";
import { basicOperatorFlow } from "./basicOperatorFlow";
import { isCharacterLetter, isCharacterNumber } from "../utils";
import { powerFlow } from "./powerFlow";
import { uniqueFunctionFlow } from "./uniqueFunctionFlow";
import { logFlow } from "./logFlow";

type TokenizerFlowsArgs = {
  tokens: BaseToken[];
  input: string;
  currentIndex: number;
  isWithinParenthesis?: boolean;
  isWithinLog?: boolean;
};

export const tokenizerFlows = ({
  tokens,
  input,
  currentIndex,
  isWithinParenthesis,
  isWithinLog,
}: TokenizerFlowsArgs) => {
  const currentChar = input.charAt(0);

  if (isCharacterNumber({ currentChar }) || currentChar === ".") {
    const { token, newInput, updatedIndex } = numberFlow({
      input,
      currentIndex,
      isWithinParenthesis,
      isWithinLog,
    });

    tokens.push(token);
    return {
      newInput,
      updatedIndex,
    };
  }

  if (basicOperators.has(currentChar)) {
    const { token, newInput, updatedIndex } = basicOperatorFlow({ input, currentIndex });

    tokens.push(token);
    return {
      newInput,
      updatedIndex,
    };
  }

  if (currentChar === "^") {
    const { token, newInput, updatedIndex } = powerFlow({ input, currentIndex });

    tokens.push(token);
    return {
      newInput,
      updatedIndex,
    };
  }

  const callbacks = [
    () => {
      if (currentChar !== "(") {
        return;
      }

      return parenthesisFlow({ input, currentIndex, isWithinLog });
    },
    () => {
      if (currentChar !== "|") {
        return;
      }

      return absoluteFlow({ input, currentIndex });
    },
    () => {
      if (!isCharacterLetter({ currentChar })) {
        return;
      }

      return uniqueFunctionFlow({ input, currentIndex, isWithinParenthesis });
    },
  ];

  for (let i = 0; i < callbacks.length; i++) {
    const current = callbacks[i];
    const response = current();
    if (!response) {
      continue;
    }

    let { tokens: parsedTokens, newInput, updatedIndex } = response;
    tokens.push(...parsedTokens);

    if (parsedTokens[0].value === "log") {
      input = newInput;
      currentIndex = updatedIndex;
      const { tokens: parsedTokens, newInput: newLogInput, updatedIndex: updatedLogIndex } = logFlow({ input, currentIndex });
      tokens.push(...parsedTokens);
      newInput = newLogInput;
      updatedIndex = updatedLogIndex;
    }

    return {
      newInput,
      updatedIndex,
    };
  }

  return {};
};
