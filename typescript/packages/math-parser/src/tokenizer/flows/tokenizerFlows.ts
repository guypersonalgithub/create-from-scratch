import { absoluteFlow } from "./absoluteFlow";
import { numberFlow } from "./numberFlow";
import { parenthesisFlow } from "./parenthesisFlow";
import { BaseToken } from "../types";
import { basicOperators } from "../uniqueTokens";
import { basicOperatorFlow } from "./basicOperatorFlow";
import { isValidLimit } from "../utils";
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
import { rootFlow } from "./rootFlow";
import { floorFlow } from "./floorFlow";
import { cancelFlow } from "./cancelFlow";
import { isCharacterLetter, isCharacterNumber } from "@packages/utils";

type TokenizerFlowsArgs = {
  tokens: BaseToken[];
  input: string;
  currentIndex: number;
  isWithinParenthesis?: boolean;
  isWithinLog?: boolean;
  isWithinLimit?: boolean;
  isAnExpression?: boolean;
  isWithinRoot?: boolean;
};

export const tokenizerFlows = ({
  tokens,
  input,
  currentIndex,
  isWithinParenthesis,
  isWithinLog,
  isWithinLimit,
  isAnExpression,
  isWithinRoot,
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
        isWithinRoot,
      });
    },
    () => {
      if (!basicOperators.has(currentChar)) {
        return;
      }

      return basicOperatorFlow({ input, currentIndex, isWithinLimit, isAnExpression });
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

      return parenthesisFlow({
        input,
        currentIndex,
        isWithinLog,
        isWithinLimit,
        isAnExpression,
        isWithinRoot,
      });
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

    const result = uniqueFunctionsFlows({
      firstToken: parsedTokens[0],
      newInput,
      updatedIndex,
      isAnExpression,
    });
    if (result) {
      const {
        tokens: parsedTokens,
        newInput: updatedNewInput,
        updatedIndex: updatedNewIndex,
      } = result;
      tokens.push(...parsedTokens);
      newInput = updatedNewInput;
      updatedIndex = updatedNewIndex;
    }

    return {
      newInput,
      updatedIndex,
    };
  }

  return {};
};

type UniqueFunctionsFlowsArgs = {
  firstToken: BaseToken;
  newInput: string;
  updatedIndex: number;
  isAnExpression?: boolean;
};

const uniqueFunctionsFlows = ({
  firstToken,
  newInput,
  updatedIndex,
  isAnExpression,
}: UniqueFunctionsFlowsArgs) => {
  const firstTokenValue = firstToken.value;
  if (!isAnExpression && (firstTokenValue === "floor" || firstTokenValue === "cancel")) {
    return;
  }

  const callbacks: Record<
    string,
    (args: { input: string; currentIndex: number }) => {
      tokens: BaseToken[];
      newInput: string;
      updatedIndex: number;
    }
  > = {
    log: logFlow,
    root: rootFlow,
    floor: floorFlow,
    cancel: cancelFlow,
  };

  if (!callbacks[firstTokenValue]) {
    return;
  }

  return callbacks[firstTokenValue]({ input: newInput, currentIndex: updatedIndex });
};
