import { TokenTypes } from "../../constants";
import { BaseToken } from "../../types";
import { unicodes } from "../../uniqueUnicodes";
import { tokenizerFlows } from "../tokenizerFlows";
import { getNextNonSpaceCharIndex, isCharacterLetter } from "@packages/utils";

type VariableLimitArgs = {
  tokens: BaseToken[];
  input: string;
  currentIndex: number;
};

const arrow = unicodes.javascript.arrow;

export const variableLimit = ({ tokens, input, currentIndex }: VariableLimitArgs) => {
  let amountOfVariables = 0;
  let amountOfValues = 0;

  const { skippedIndexes: firstCharaterSkippedIndexes } = getNextNonSpaceCharIndex({ input });
  if (firstCharaterSkippedIndexes === undefined) {
    throw new Error(
      `The input ended unexpectedly when expecting the limit's range's parenthesis on index ${currentIndex}.`,
    );
  }

  let duplicatedInput = input.slice(firstCharaterSkippedIndexes);
  let currentChar = duplicatedInput.charAt(0);
  if (currentChar !== "(") {
    throw new Error(
      `Encountered an unexpected character ${currentChar} on index ${currentIndex} instead of "(".`,
    );
  }

  currentIndex += firstCharaterSkippedIndexes;
  tokens.push({
    type: TokenTypes.UNIQUE_TOKEN,
    value: currentChar,
  });

  duplicatedInput = duplicatedInput.slice(1);
  currentIndex++;
  currentChar = duplicatedInput.charAt(0);

  while (duplicatedInput.length > 0 && isCharacterLetter({ currentChar })) {
    tokens.push({
      type: TokenTypes.VARIABLE,
      value: currentChar,
    });

    amountOfVariables++;

    duplicatedInput = duplicatedInput.slice(1);
    currentIndex++;
    currentChar = duplicatedInput.charAt(0);

    const { skippedIndexes: skippedIndexesAfterVariable } = getNextNonSpaceCharIndex({
      input: duplicatedInput,
    });
    if (skippedIndexesAfterVariable === undefined) {
      throw new Error(
        `The input ended unexpectedly when expecting either a coma or an ${arrow} on index ${currentIndex}.`,
      );
    }

    currentIndex += skippedIndexesAfterVariable;
    duplicatedInput = duplicatedInput.slice(skippedIndexesAfterVariable);
    const followingChar = duplicatedInput.charAt(0);
    if (followingChar === ",") {
      tokens.push({
        type: TokenTypes.LIMIT_SPREAD,
        value: followingChar,
      });

      currentIndex++;
      duplicatedInput = duplicatedInput.slice(1);

      const { skippedIndexes } = getNextNonSpaceCharIndex({
        input: duplicatedInput,
      });

      if (skippedIndexes === undefined) {
        throw new Error(
          `The input ended unexpectedly when expecting a variable after a coma on index ${currentIndex}`,
        );
      }

      currentIndex += skippedIndexes;
      duplicatedInput = duplicatedInput.slice(skippedIndexes);
      currentChar = duplicatedInput.charAt(0);
    }
  }

  if (tokens[tokens.length - 1].value === ",") {
    throw new Error(
      `The input neded unexpectedly when expecting a variable after a coma on index ${currentIndex}`,
    );
  }

  if (currentChar !== arrow) {
    throw new Error(
      `Encountered an unexpected character ${currentChar} while expected ${arrow} on index ${currentIndex}`,
    );
  }

  tokens.push({
    type: TokenTypes.LIMIT_ARROW,
    value: currentChar,
  });

  currentIndex++;
  duplicatedInput = duplicatedInput.slice(1);
  currentChar = duplicatedInput.charAt(0);

  if (currentChar !== undefined) {
    amountOfValues++;
  }

  while (duplicatedInput.length > 0 && currentChar !== ")") {
    if (currentChar === ",") {
      const lastCurrentToken = tokens[tokens.length - 1];
      if (lastCurrentToken.value === "-" || lastCurrentToken.value === "+") {
        tokens[tokens.length - 1].type = TokenTypes.LIMIT_DIRECTION;
      }

      amountOfValues++;

      tokens.push({
        type: TokenTypes.LIMIT_SPREAD,
        value: currentChar,
      });

      currentIndex++;
      duplicatedInput = duplicatedInput.slice(1);

      const { skippedIndexes } = getNextNonSpaceCharIndex({
        input: duplicatedInput,
      });

      if (skippedIndexes === undefined) {
        throw new Error(
          `The input ended unexpectedly when expecting a value after a coma on index ${currentIndex}`,
        );
      }

      currentIndex += skippedIndexes;
      duplicatedInput = duplicatedInput.slice(skippedIndexes);
      currentChar = duplicatedInput.charAt(0);
    }

    const { newInput, updatedIndex } = tokenizerFlows({
      tokens,
      input: duplicatedInput,
      currentIndex,
      isWithinParenthesis: true,
      isWithinLimit: true,
    });
    if (newInput === undefined) {
      if (currentChar === unicodes.javascript.infinity) {
        tokens.push({
          type: TokenTypes.VALUE,
          value: currentChar,
        });
        currentIndex++;
        duplicatedInput = duplicatedInput.slice(1);
        currentChar = duplicatedInput.charAt(0);

        if (currentChar === "+" || currentChar === "-") {
          tokens.push({
            type: TokenTypes.UNIQUE_OPERATION,
            value: currentChar,
          });
        }

        currentIndex++;
        duplicatedInput = duplicatedInput.slice(1);
        currentChar = duplicatedInput.charAt(0);
      } else {
        throw new Error(`The limit values ended unexpectedly on index ${currentIndex}.`);
      }
    } else {
      duplicatedInput = newInput;
      currentIndex = updatedIndex;
      currentChar = duplicatedInput.charAt(0);
    }
  }

  if (currentChar !== ")") {
    throw new Error(
      `Encountered an unexpected character ${currentChar} on index ${currentIndex} instead of ")".`,
    );
  }

  const lastCurrentToken = tokens[tokens.length - 1];
  if (lastCurrentToken.value === "-" || lastCurrentToken.value === "+") {
    tokens[tokens.length - 1].type = TokenTypes.LIMIT_DIRECTION;
  }

  tokens.push({
    type: TokenTypes.UNIQUE_TOKEN,
    value: currentChar,
  });

  duplicatedInput = duplicatedInput.slice(1);
  currentIndex++;

  if (amountOfVariables !== amountOfValues) {
    throw new Error(`Received an unequal amount of variables and values for a limit.`);
  }

  return {
    newInput: duplicatedInput,
    updatedIndex: currentIndex,
  };
};
