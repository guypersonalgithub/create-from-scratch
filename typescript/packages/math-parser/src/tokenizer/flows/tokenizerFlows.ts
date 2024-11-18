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
import { factorialFlow } from "./factorialFlow";

type TokenizerFlowsArgs = {
  tokens: BaseToken[];
  input: string;
  currentIndex: number;
  isWithinParenthesis?: boolean;
  isWithinLog?: boolean;
  isWithinLimit?: boolean;
};

export const tokenizerFlows = ({
  tokens,
  input,
  currentIndex,
  isWithinParenthesis,
  isWithinLog,
  isWithinLimit,
}: TokenizerFlowsArgs) => {
  const currentChar = input.charAt(0);

  const singleTokenCallbacks = [
    () => {
      if (!isCharacterNumber({ currentChar }) && currentChar !== ".") {
        return false;
      }

      return numberFlow({
        input,
        currentIndex,
        isWithinParenthesis,
        isWithinLog,
        isWithinLimit,
      });
    },
    () => {
      if (!basicOperators.has(currentChar)) {
        return;
      }

      return basicOperatorFlow({ input, currentIndex, isWithinLimit });
    },
    () => {
      if (currentChar !== "^") {
        return;
      }

      return powerFlow({ input, currentIndex });
    },
    () => {
      if (currentChar !== "!") {
        return;
      }

      return factorialFlow({
        input,
        currentIndex,
        isWithinParenthesis,
      });
    },
  ];

  for (let i = 0; i < singleTokenCallbacks.length; i++) {
    const current = singleTokenCallbacks[i];
    const response = current();
    if (!response) {
      continue;
    }

    const { token, newInput, updatedIndex } = response;
    tokens.push(token);

    return {
      newInput,
      updatedIndex,
    };
  }

  const multipleTokenCallbacks = [
    () => {
      if (currentChar !== "(") {
        return;
      }

      return parenthesisFlow({ input, currentIndex, isWithinLog, isWithinLimit });
    },
    () => {
      if (currentChar !== "|") {
        return;
      }

      return absoluteFlow({ input, currentIndex, isWithinLimit });
    },
    () => {
      if (!isCharacterLetter({ currentChar })) {
        return;
      }

      return uniqueFunctionFlow({ input, currentIndex, isWithinParenthesis });
    },
  ];

  for (let i = 0; i < multipleTokenCallbacks.length; i++) {
    const current = multipleTokenCallbacks[i];
    const response = current();
    if (!response) {
      continue;
    }

    let { tokens: parsedTokens, newInput, updatedIndex } = response;
    tokens.push(...parsedTokens);

    if (parsedTokens[0].value === "log") {
      input = newInput;
      currentIndex = updatedIndex;
      const {
        tokens: parsedTokens,
        newInput: newLogInput,
        updatedIndex: updatedLogIndex,
      } = logFlow({ input, currentIndex });
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
