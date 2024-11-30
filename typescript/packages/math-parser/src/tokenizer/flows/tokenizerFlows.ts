import { absoluteFlow } from "./absoluteFlow";
import { numberFlow } from "./numberFlow";
import { parenthesisFlow } from "./parenthesisFlow";
import { BaseToken } from "../types";
import { basicOperators } from "../uniqueTokens";
import { basicOperatorFlow } from "./basicOperatorFlow";
import { isCharacterLetter, isCharacterNumber, isValidLimit } from "../utils";
import { powerFlow } from "./powerFlow";
import { uniqueFunctionFlow } from "./uniqueFunctionFlow";
import { logFlow } from "./logFlow";
import { factorialFlow } from "./factorialFlow";
import { deltaFlow } from "./deltaFlow";
import { unicodes } from "../uniqueUnicodes";
import { equalSignFlow } from "./equalSignFlow";
import { limitFlow } from "./limitFlow";
import { derivativeSignFlow } from "./derivativeSignFlow";
import { inequalitySignsFlow } from "./inequalitySignsFlow";

type TokenizerFlowsArgs = {
  tokens: BaseToken[];
  input: string;
  currentIndex: number;
  isWithinParenthesis?: boolean;
  isWithinLog?: boolean;
  isWithinLimit?: boolean;
  isAnExpression?: boolean;
};

export const tokenizerFlows = ({
  tokens,
  input,
  currentIndex,
  isWithinParenthesis,
  isWithinLog,
  isWithinLimit,
  isAnExpression,
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
        isAnExpression,
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

      return powerFlow({ input, currentIndex, isAnExpression });
    },
    () => {
      if (currentChar !== "!") {
        return;
      }

      return factorialFlow({ input, currentIndex, isWithinParenthesis });
    },
    () => {
      if (!isAnExpression || currentChar !== unicodes.javascript.capitalDelta) {
        return;
      }

      return deltaFlow({ input, currentIndex });
    },
    () => {
      if (!isAnExpression || currentChar !== "=") {
        return;
      }

      return equalSignFlow({ input, currentIndex });
    },
    () => {
      if (!isAnExpression || currentChar !== "'") {
        return;
      }

      return derivativeSignFlow({ tokens, input, currentIndex });
    },
    () => {
      if (
        !isAnExpression ||
        (currentChar !== ">" &&
          currentChar !== "<" &&
          currentChar !== unicodes.javascript.lessThanEqual &&
          currentChar !== unicodes.javascript.greaterThanEqual)
      ) {
        return;
      }

      return inequalitySignsFlow({ input, currentIndex });
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

      return parenthesisFlow({ input, currentIndex, isWithinLog, isWithinLimit, isAnExpression });
    },
    () => {
      if (currentChar !== "|") {
        return;
      }

      return absoluteFlow({ input, currentIndex, isWithinLimit, isAnExpression });
    },
    () => {
      if (!isAnExpression || !isValidLimit({ input })) {
        return;
      }

      return limitFlow({ input, currentIndex });
    },
    () => {
      if (!isCharacterLetter({ currentChar })) {
        return;
      }

      return uniqueFunctionFlow({ input, currentIndex, isWithinParenthesis, isAnExpression });
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
